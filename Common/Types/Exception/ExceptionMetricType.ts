enum ExceptionMetricType {
  ExceptionCount = "cast-operations.exception.count",
  ExceptionRate = "cast-operations.exception.rate",
  ExceptionCountByType = "cast-operations.exception.count.by.type",
  ExceptionCountByService = "cast-operations.exception.count.by.service",
  UnresolvedExceptionCount = "cast-operations.exception.unresolved.count",
  ResolvedExceptionCount = "cast-operations.exception.resolved.count",
  MutedExceptionCount = "cast-operations.exception.muted.count",
  ExceptionFirstSeenTime = "cast-operations.exception.first.seen.time",
  ExceptionLastSeenTime = "cast-operations.exception.last.seen.time",
  ExceptionOccurrenceCount = "cast-operations.exception.occurrence.count",
  ExceptionAffectedServiceCount = "cast-operations.exception.affected.service.count",
}

export default ExceptionMetricType;
