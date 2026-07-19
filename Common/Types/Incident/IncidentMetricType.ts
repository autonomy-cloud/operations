enum IncidentMetricType {
  TimeToAcknowledge = "cast-operations.incident.time-to-acknowledge",
  TimeToResolve = "cast-operations.incident.time-to-resolve",
  IncidentCount = "cast-operations.incident.count",
  IncidentDuration = "cast-operations.incident.duration",
  TimeInState = "cast-operations.incident.time-in-state",
  SeverityChange = "cast-operations.incident.severity-change",
  PostmortemCompletionTime = "cast-operations.incident.postmortem-completion-time",
  /*
   * Seconds from incident creation to the moment the AI investigation
   * posted its root-cause analysis. Written once from the investigation
   * runner (not from refreshIncidentMetrics — the refresh replace-list
   * deliberately excludes this name so refreshes never tombstone it).
   */
  TimeToRootCausePosted = "cast-operations.incident.time-to-rca",
}

export default IncidentMetricType;
