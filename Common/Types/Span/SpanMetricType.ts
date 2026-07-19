enum SpanMetricType {
  SpanCount = "cast-operations.span.count",
  SpanDuration = "cast-operations.span.duration",
  SpanErrorCount = "cast-operations.span.error.count",
  SpanErrorRate = "cast-operations.span.error.rate",
  SpanRequestRate = "cast-operations.span.request.rate",
  SpanP50Duration = "cast-operations.span.duration.p50",
  SpanP90Duration = "cast-operations.span.duration.p90",
  SpanP95Duration = "cast-operations.span.duration.p95",
  SpanP99Duration = "cast-operations.span.duration.p99",
  SpanStatusOk = "cast-operations.span.status.ok",
  SpanStatusError = "cast-operations.span.status.error",
  SpanStatusUnset = "cast-operations.span.status.unset",
  SpanThroughput = "cast-operations.span.throughput",
}

export default SpanMetricType;
