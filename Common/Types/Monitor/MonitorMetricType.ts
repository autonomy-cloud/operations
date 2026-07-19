enum MonitorMetricType {
  ResponseTime = "cast-operations.monitor.response.time",
  ResponseStatusCode = "cast-operations.monitor.response.status.code",
  DiskUsagePercent = "cast-operations.monitor.disk.usage.percent",
  CPUUsagePercent = "cast-operations.monitor.cpu.usage.percent",
  MemoryUsagePercent = "cast-operations.monitor.memory.usage.percent",
  IsOnline = "cast-operations.monitor.online",
  ExecutionTime = "cast-operations.monitor.execution.time",

  /*
   * Packet-level network metrics. Emitted by Ping/IP monitors when the
   * probe sends multiple echo requests per check; absent for older probes.
   */
  PacketLossPercent = "cast-operations.monitor.ping.packet.loss.percent",
  Jitter = "cast-operations.monitor.ping.jitter",

  /*
   * HTTP(S) phase breakdown. Emitted by Website/API monitors when the probe
   * captured socket-level timings; absent behind proxies and on older probes.
   */
  DnsLookupTime = "cast-operations.monitor.http.dns.lookup.time",
  TcpConnectTime = "cast-operations.monitor.http.tcp.connect.time",
  TlsHandshakeTime = "cast-operations.monitor.http.tls.handshake.time",
  TimeToFirstByte = "cast-operations.monitor.http.time.to.first.byte",
  DownloadTime = "cast-operations.monitor.http.download.time",

  /*
   * Per-interface SNMP metrics. Emitted when interface monitoring is enabled
   * on an SNMP monitor; one series per interface (interfaceName attribute).
   */
  SnmpInterfaceOperStatus = "cast-operations.monitor.snmp.interface.oper.status",
  SnmpInterfaceInBitsPerSecond = "cast-operations.monitor.snmp.interface.in.bits.per.second",
  SnmpInterfaceOutBitsPerSecond = "cast-operations.monitor.snmp.interface.out.bits.per.second",
  SnmpInterfaceUtilizationPercent = "cast-operations.monitor.snmp.interface.utilization.percent",
  SnmpInterfaceErrorsPerSecond = "cast-operations.monitor.snmp.interface.errors.per.second",

  /*
   * One series per polled OID that returned a numeric value (oid / oidName
   * attributes) — CPU, memory, temperature from vendor templates and any
   * custom OID a user adds. This is what makes polled OIDs chartable and
   * evaluable over time.
   */
  SnmpOidValue = "cast-operations.monitor.snmp.oid.value",

  /*
   * Extended server/VM metrics. Emitted when the agent payload contains them;
   * absent for older agents, which keeps the pipeline backwards-compatible.
   */
  LoadAverage1Min = "cast-operations.monitor.load.avg.1min",
  LoadAverage5Min = "cast-operations.monitor.load.avg.5min",
  LoadAverage15Min = "cast-operations.monitor.load.avg.15min",

  SwapUsagePercent = "cast-operations.monitor.memory.swap.usage.percent",
  MemoryAvailableBytes = "cast-operations.monitor.memory.available.bytes",

  CPUTimeUserPercent = "cast-operations.monitor.cpu.time.user.percent",
  CPUTimeSystemPercent = "cast-operations.monitor.cpu.time.system.percent",
  CPUTimeIoWaitPercent = "cast-operations.monitor.cpu.time.iowait.percent",
  CPUTimeIdlePercent = "cast-operations.monitor.cpu.time.idle.percent",
  CPUTimeStealPercent = "cast-operations.monitor.cpu.time.steal.percent",

  DiskReadBytesTotal = "cast-operations.monitor.disk.io.read.bytes.total",
  DiskWriteBytesTotal = "cast-operations.monitor.disk.io.write.bytes.total",
  DiskReadOpsTotal = "cast-operations.monitor.disk.io.read.ops.total",
  DiskWriteOpsTotal = "cast-operations.monitor.disk.io.write.ops.total",

  NetworkBytesReceivedTotal = "cast-operations.monitor.network.bytes.received.total",
  NetworkBytesSentTotal = "cast-operations.monitor.network.bytes.sent.total",
  NetworkPacketsReceivedTotal = "cast-operations.monitor.network.packets.received.total",
  NetworkPacketsSentTotal = "cast-operations.monitor.network.packets.sent.total",
  NetworkErrorsIn = "cast-operations.monitor.network.errors.in",
  NetworkErrorsOut = "cast-operations.monitor.network.errors.out",
  NetworkConnectionsEstablished = "cast-operations.monitor.network.connections.established",
  NetworkConnectionsListen = "cast-operations.monitor.network.connections.listen",

  HostUptimeSeconds = "cast-operations.monitor.host.uptime.seconds",
  ProcessCountTotal = "cast-operations.monitor.process.count.total",
}

export default MonitorMetricType;
