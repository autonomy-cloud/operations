<!-- markdownlint-disable MD033 MD041 -->
<p align="center">
  <a href="/README.md">English</a> ·
  <a href="/translations/README.zh-CN.md">简体中文</a> ·
  <a href="/translations/README.zh-TW.md">繁體中文</a> ·
  <a href="/translations/README.ja.md">日本語</a> ·
  <a href="/translations/README.ko.md">한국어</a> ·
  <a href="/translations/README.es.md">Español</a> ·
  <a href="/translations/README.fr.md">Français</a> ·
  <a href="/translations/README.de.md">Deutsch</a> ·
  <a href="/translations/README.pt.md">Português</a> ·
  <a href="/translations/README.it.md">Italiano</a> ·
  <a href="/translations/README.ru.md">Русский</a> ·
  <a href="/translations/README.hi.md">हिन्दी</a> ·
  <a href="/translations/README.nl.md">Nederlands</a> ·
  <a href="/translations/README.da.md">Dansk</a> ·
  <a href="/translations/README.sv.md">Svenska</a> ·
  <a href="/translations/README.no.md">Norsk</a>
</p>

<div align="center">
  <a href="https://latticeruntime.com">
    <img alt="Cast Operations logo" width="55%" src="https://raw.githubusercontent.com/autonomy-cloud/operations/master/Common/UI/Images/logos/CastOperationsSVG/logo.svg"/>
  </a>

  <h3>Agentic observability — one open-source platform for uptime, incidents, on-call, status pages, logs, traces, metrics & APM.</h3>

  <p><b>When things go wrong, be the first to know — and the fastest to fix.</b></p>

  <p>Cast Operations replaces a whole shelf of SaaS tools with one platform you can self-host for free. It catches the outage, pages the right person, updates your status page, finds the root cause, and even opens the fix PR.</p>

  <p>
    <a href="https://github.com/autonomy-cloud/operations/blob/master/LICENSE"><img src="https://img.shields.io/github/license/autonomy-cloud/operations?color=1a73e8" alt="License"></a>
    <a href="https://github.com/autonomy-cloud/operations/releases"><img src="https://img.shields.io/github/v/release/autonomy-cloud/operations" alt="Release"></a>
    <a href="https://github.com/autonomy-cloud/operations/stargazers"><img src="https://img.shields.io/github/stars/autonomy-cloud/operations?style=flat" alt="Stars"></a>
    <a href="https://artifacthub.io/packages/helm/autonomy-cloud/operations"><img src="https://img.shields.io/badge/Helm-Chart-0f1689" alt="Helm Chart"></a>
    <a href="https://github.com/autonomy-cloud/operations/discussions"><img src="https://img.shields.io/badge/Slack-Community-4A154B" alt="Slack"></a>
  </p>

  <p>
    <a href="https://latticeruntime.com"><b>Website</b></a> &nbsp;•&nbsp;
    <a href="https://latticeruntime.com/docs"><b>Docs</b></a> &nbsp;•&nbsp;
    <a href="#quick-start"><b>Quick Start</b></a> &nbsp;•&nbsp;
    <a href="https://latticeruntime.com/pricing"><b>Pricing</b></a> &nbsp;•&nbsp;
    <a href="#contributing"><b>Contribute</b></a>
  </p>

  <a href="https://latticeruntime.com"><b>🚀 Try Cast Operations Cloud — free forever plan, no credit card →</b></a>
</div>

<br/>

<div align="center">
  <img alt="Cast Operations command center during a live incident" width="92%" src="https://raw.githubusercontent.com/autonomy-cloud/operations/master/Home/Static/img/readme/hero-command-center.png"/>
</div>

---

## Replace your whole observability stack

Cast Operations brings monitoring, alerting, incident response, and observability into a single open-source app — so you stop paying for (and stitching together) a dozen separate tools.

| Instead of… | Use Cast Operations for… |
|---|---|
| Pingdom / UptimeRobot | **Uptime Monitoring** — website, API, ping, port, SSL, DNS & synthetic checks from around the world |
| StatusPage.io | **Status Pages** — branded public & private status pages with subscribers |
| PagerDuty / Opsgenie | **On-Call & Alerts** — schedules, escalation policies, SMS / call / push / Slack |
| Incident.io | **Incident Management** — declare, triage, communicate, and post-mortem |
| Datadog / New Relic | **APM & Metrics** — traces, dashboards, and service performance |
| Loggly | **Log Management** — collect, search, and alert on logs |
| Sentry | **Error Tracking** — exceptions with full stack traces and context |

All of it is **100% open source (Apache 2.0)** and free to self-host.

---

<details>
<summary><b>🌙 One incident, handled end to end</b></summary>

<br/>

It's 2:47 AM. Checkout starts timing out. Here's what Cast Operations does before most tools would even fire the first alert — and what the screenshots below actually show.

### 1 · Detect — *know in seconds*

Probes in multiple regions catch checkout latency blowing past your 5s threshold and open an incident automatically — before your customers hit refresh.

![Detect — global monitoring catches the checkout API degrading](/Home/Static/img/readme/detect.png?raw=true)

### 2 · Respond — *the right person, paged*

The on-call engineer for the Payments policy is called, texted, and push-notified, escalating to backup automatically until someone acknowledges.

![Respond — the incident is routed to on-call and acknowledged](/Home/Static/img/readme/respond.png?raw=true)

### 3 · Communicate — *customers in the loop*

Your status page updates itself and every subscriber is notified by email and SMS — no one has to hand-write the update.

![Communicate — the public status page updates and notifies subscribers](/Home/Static/img/readme/communicate.png?raw=true)

### 4 · Diagnose — *root cause, found*

Traces, logs, and metrics are correlated down to the exact span: a slow `SELECT … FOR UPDATE` on `orders`, stuck on a missing index.

![Diagnose — the trace waterfall pinpoints the slow database span](/Home/Static/img/readme/diagnose.png?raw=true)

### 5 · Auto-Fix — *the fix, drafted for you*

The AI agent opens a pull request with the fix, linked to the incident, with tests green — you review and merge. Like an SRE that never sleeps.

![Auto-Fix — the AI agent opens a pull request with the fix](/Home/Static/img/readme/autofix.png?raw=true)

</details>

---

<a name="quick-start"></a>

## ⚡ Quick Start

### ☁️ Cast Operations Cloud — the easy way

Zero setup, always up to date, and it funds the open-source project.

**→ [Sign up free at latticeruntime.com](https://latticeruntime.com)**

### 🐳 Self-host with Docker Compose

Everything you need on a single server (Debian / Ubuntu / RHEL, Docker + Docker Compose). Great for homelabs and small teams — a Raspberry Pi even works.

```bash
# 1. Clone the release branch
git clone --depth 1 --single-branch --branch release https://github.com/autonomy-cloud/operations.git
cd cast-operations

# 2. Create your config (then edit it — set strong, random secrets!)
cp config.example.env config.env

# 3. Start everything
npm start
```

Cast Operations is now running at **http://localhost** — open it and create your first account.

📖 Full guide: [Docker Compose install](/App/FeatureSet/Docs/Content/en/installation/docker-compose.md) · [Sizing & requirements](/App/FeatureSet/Docs/Content/en/installation/sizing.md)

### ☸️ Kubernetes with Helm — for production

```bash
helm repo add cast-operations https://helm-chart.latticeruntime.com
helm install cast-operations autonomy-cloud/operations
```

📖 Full install instructions & values on [Artifact Hub →](https://artifacthub.io/packages/helm/autonomy-cloud/operations)

> **Upgrading an existing install?** See the [upgrade guide](/App/FeatureSet/Docs/Content/en/installation/upgrading.md).

---

## ✨ Everything in the box

| | Feature | What it does |
|---|---|---|
| 📊 | **Uptime Monitoring** | Website, API, IP, port, SSL, DNS, and synthetic monitors from multiple global regions. |
| 📋 | **Status Pages** | Beautiful branded status pages, incident history, scheduled maintenance, and subscriber notifications. |
| 🚨 | **Incident Management** | End-to-end incident workflow: declare, assign, communicate, resolve, and run post-mortems. |
| 📞 | **On-Call & Alerts** | On-call schedules and escalation policies with SMS, phone call, push, email, and Slack alerts. |
| 📝 | **Log Management** | Ingest, store, search, and alert on logs via OpenTelemetry. |
| 🔍 | **APM & Traces** | Distributed traces, spans, and performance dashboards to find slow paths and bottlenecks. |
| 📈 | **Metrics & Dashboards** | Custom dashboards over your telemetry — build the views your team needs. |
| 🐛 | **Error Tracking** | Capture exceptions with full stack traces, context, and release tracking. |
| ⚡ | **Workflows** | Automate and integrate with Slack, Jira, GitHub, Microsoft Teams, and 5,000+ apps. |
| 🤖 | **AI Copilot** | An always-on agent that finds anomalies across logs, traces & metrics, spots root causes, and opens PRs with fixes. |

<details>
<summary><b>⚡ Automate the busywork</b></summary>

<br/>

Wire up escalations, ticketing, and notifications on a visual, no-code canvas — or drop in custom code. The incident above paged on-call, opened a Jira ticket, and posted to Slack without anyone lifting a finger.

![Workflows — a no-code automation canvas for incident escalation](/Home/Static/img/readme/workflows.png?raw=true)

</details>

### 🖥️ Infrastructure Monitoring

Drop in copy-paste, **OpenTelemetry-based** agents to watch everything your services run on — with ready-made alert templates included:

- **Servers & VMs** — CPU, memory, disk, network, processes, and logs from Linux, macOS & Windows. [Docs →](/App/FeatureSet/Docs/Content/en/telemetry/host-otel-collector.md)
- **Kubernetes** — one `helm install` ships node/pod/container/cluster metrics, events, logs, and eBPF traces & service maps. [Docs →](/App/FeatureSet/Docs/Content/en/telemetry/kubernetes-agent.md)
- **Docker** — a single agent auto-discovers every container and ships metrics & logs. [Docs →](/App/FeatureSet/Docs/Content/en/telemetry/docker-host.md)
- **Podman** — same one-agent auto-discovery via Podman's Docker-compatible socket. [Docs →](/App/FeatureSet/Docs/Content/en/telemetry/podman-host.md)
- **Proxmox** — nodes, VMs, containers, storage, HA state, backup coverage & replication health. [Docs →](/App/FeatureSet/Docs/Content/en/telemetry/proxmox.md)
- **Ceph** — cluster health, capacity forecasts, and OSD/pool/PG/monitor visibility. [Docs →](/App/FeatureSet/Docs/Content/en/telemetry/ceph.md)

---

## 💼 Community vs. Enterprise

| | **Community** | **Enterprise** |
|---|---|---|
| **Best for** | Self-hosters & small teams | Regulated teams needing premium support |
| **Cost** | Free & open source | [Contact sales](mailto:sales@latticeruntime.com) |
| **Features** | Full feature set | Full feature set + hardened images, priority support, custom features & data residency |

---

## 💡 Why Cast Operations?

Our mission is simple: **reduce downtime and help more products succeed.** Instead of duct-taping seven vendors together, you get one platform that helps you understand *why* things break, respond to incidents fast, and cut operational toil — fully open source, so you own your data and your stack.

---

<a name="contributing"></a>

## 🤝 Contributing

We welcome contributions of every size. Start here:

- 🐛 **[Open issues](https://github.com/autonomy-cloud/operations/issues)** — pick one up, or [file a new one](https://github.com/autonomy-cloud/operations/issues/new)
- ✅ **[Help write tests](https://github.com/autonomy-cloud/operations/issues?q=is%3Aopen+is%3Aissue+label%3A%22write+tests%22)** for the codebase
- 🧑‍💻 **[Local development guide](/App/FeatureSet/Docs/Content/en/installation/local-development.md)** to get set up
- 📖 Read the **[contributing guidelines](/CONTRIBUTING.md)**
- 💬 Chat with us in the **[Developer Slack](https://github.com/autonomy-cloud/operations/discussions)** or **[Community Slack](https://github.com/autonomy-cloud/operations/discussions)**

## ❤️ Support the project

If Cast Operations is useful to you:

- ⭐ **Star this repo** — it genuinely helps others find us
- 💵 **[Sponsor us](https://github.com/autonomy-cloud/operations)** — every dollar ships new features
- 🛍️ **[Grab some merch](https://shop.latticeruntime.com)** — all proceeds fund open-source development

---

## 📄 License

Cast Operations is licensed under the [Apache License 2.0](/LICENSE).

<div align="center">
  <sub>Made with ❤️ by the <a href="https://latticeruntime.com">Cast Operations</a> team and <a href="https://github.com/autonomy-cloud/operations/graphs/contributors">contributors</a>.</sub>
</div>
