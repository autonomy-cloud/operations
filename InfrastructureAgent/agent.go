package main

import (
	"bytes"
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
	"net/url"
	"cast-operations-infrastructure-agent/model"
	"cast-operations-infrastructure-agent/utils"
	"os"
	"strconv"
	"time"

	"github.com/go-co-op/gocron/v2"
)

type Agent struct {
	SecretKey    string
	OperationsURL string
	ProxyURL     string
	scheduler    gocron.Scheduler
	mainJob      gocron.Job
	shutdownHook Hook
}

func NewAgent(secretKey string, castOperationsUrl string, proxyUrl string) *Agent {

	ag := &Agent{
		SecretKey:    secretKey,
		OperationsURL: castOperationsUrl,
		ProxyURL:     proxyUrl,
	}

	slog.Info("Starting agent...")
	slog.Info("Agent configuration:")
	slog.Info("Secret key: " + ag.SecretKey)
	slog.Info("Cast Operations URL: " + ag.OperationsURL)
	slog.Info("Proxy URL: " + ag.ProxyURL)
	if ag.SecretKey == "" || ag.OperationsURL == "" {
		slog.Error("Secret key and Cast Operations URL are required")
		os.Exit(1)
		return ag
	}

	// check if secret key is valid
	if !checkIfSecretKeyIsValid(ag.SecretKey, ag.OperationsURL, ag.ProxyURL) {
		slog.Error("Secret key is invalid. If you are sure that the secret key is correct, please check your network connection, Cast Operations URL (" + ag.OperationsURL + "), Proxy URL (" + ag.ProxyURL + ") and try again.")
		os.Exit(1)
		return ag
	}

	scheduler, err := gocron.NewScheduler()
	if err != nil {
		slog.Error(err.Error())
		os.Exit(1)
		return ag
	}

	job, err := scheduler.NewJob(gocron.DurationJob(30*time.Second), gocron.NewTask(collectMetricsJob, ag.SecretKey, ag.OperationsURL, ag.ProxyURL))
	if err != nil {
		slog.Error(err.Error())
		os.Exit(1)
		return ag
	}

	ag.scheduler = scheduler
	ag.mainJob = job

	return ag
}

func (ag *Agent) Start() {
	ag.scheduler.Start()
	err := ag.mainJob.RunNow()
	if err != nil {
		slog.Info(err.Error())
		os.Exit(1)
		return
	}
}

func (ag *Agent) Close() {
	err := ag.scheduler.Shutdown()
	if err != nil {
		slog.Error(err.Error())
	}
}

func collectMetricsJob(secretKey string, castOperationsUrl string, proxyUrl string) {
	memMetrics := utils.GetMemoryMetrics()
	if memMetrics == nil {
		slog.Warn("Failed to get memory metrics")
	}

	cpuMetrics := utils.GetCpuMetrics()
	if cpuMetrics == nil {
		slog.Warn("Failed to get CPU metrics")
	}

	diskMetrics := utils.ListDiskMetrics()
	if diskMetrics == nil {
		slog.Warn("Failed to get disk metrics")
	}

	networkMetrics := utils.GetNetworkMetrics()
	if networkMetrics == nil {
		slog.Warn("Failed to get network metrics")
	}

	loadMetrics := utils.GetLoadMetrics()
	if loadMetrics == nil {
		slog.Warn("Failed to get load average metrics")
	}

	hostMetrics := utils.GetHostMetrics()
	if hostMetrics == nil {
		slog.Warn("Failed to get host metrics")
	}

	servProcesses := utils.GetServerProcesses()
	if servProcesses == nil {
		slog.Warn("Failed to get server processes")
	}

	metricsReport := &model.ServerMonitorReport{
		SecretKey: secretKey,
		BasicInfrastructureMetrics: &model.BasicInfrastructureMetrics{
			MemoryMetrics:  memMetrics,
			CpuMetrics:     cpuMetrics,
			DiskMetrics:    diskMetrics,
			NetworkMetrics: networkMetrics,
			LoadMetrics:    loadMetrics,
			HostMetrics:    hostMetrics,
		},
		RequestReceivedAt:          time.Now().UTC().Format("2006-01-02T15:04:05.000Z"),
		OnlyCheckRequestReceivedAt: false,
		Processes:                  servProcesses,
		Hostname:                   utils.GetHostname(),
	}

	reqData := struct {
		ServerMonitorResponse *model.ServerMonitorReport `json:"serverMonitorResponse"`
	}{
		ServerMonitorResponse: metricsReport,
	}
	reqBody, err := json.Marshal(reqData)
	if err != nil {
		slog.Error("Failed to marshal request data", "error", err)
		return
	}

	client := &http.Client{}

	if proxyUrl != "" {
		proxyURL, _ := url.Parse(proxyUrl)
		transport := &http.Transport{Proxy: http.ProxyURL(proxyURL)}
		client = &http.Client{Transport: transport}
		slog.Info("Using proxy to send request:" + proxyUrl)
	}

	resp, err := client.Post(castOperationsUrl+"/server-monitor/response/ingest/"+secretKey, "application/json", bytes.NewBuffer(reqBody))
	if err != nil {
		slog.Error("Failed to send request to server", "error", err)
		return
	}

	defer resp.Body.Close()

	if resp.StatusCode == http.StatusOK {
		slog.Info("Metrics successfully pushed to Cast Operations server", "status", resp.StatusCode, "endpoint", castOperationsUrl+"/server-monitor/response/ingest/"+secretKey)
	} else {
		slog.Error("Failed to ingest metrics", "status_code", resp.StatusCode)
		respBody, err := io.ReadAll(resp.Body)
		if err != nil {
			slog.Error("Failed to read error response body", "error", err)
		} else {
			slog.Error("Server response", "body", string(respBody))
		}
	}
}

func checkIfSecretKeyIsValid(secretKey string, castOperationsUrl string, proxyUrl string) bool {

	// if we have a proxy, we need to use that to make the request

	client := &http.Client{}

	if proxyUrl != "" {
		proxyURL, _ := url.Parse(proxyUrl)
		transport := &http.Transport{Proxy: http.ProxyURL(proxyURL)}
		client = &http.Client{Transport: transport}
		slog.Info("Using proxy to send request:" + proxyUrl)
	}

	if secretKey == "" {
		slog.Error("Secret key is empty")
		return false
	}
	resp, err := client.Get(castOperationsUrl + "/server-monitor/secret-key/verify/" + secretKey)
	if err != nil {
		slog.Error(err.Error())
		return false
	}
	if resp.StatusCode != 200 {
		slog.Error("Secret key verification failed with status code " + strconv.Itoa(resp.StatusCode))
		return false
	}
	return true
}
