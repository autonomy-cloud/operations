# Send Continuous Profiling Data to Cast Operations

## Overview

Continuous profiling is the fourth pillar of observability alongside logs, metrics, and traces. Profiles capture how your application spends CPU time and allocates memory at the function level, and Cast Operations renders them as interactive flamegraphs alongside your other telemetry.

Cast Operations exposes a **Pyroscope-compatible ingest API**. Anything that can push to a Pyroscope server — the Grafana Alloy eBPF profiler or a Pyroscope language SDK — can push to Cast Operations.

## Ingest Endpoint

| Setting                             | Value                                               |
| ----------------------------------- | --------------------------------------------------- |
| Base URL (Pyroscope server address) | `https://visca.ai/pyroscope`                   |
| Authentication header               | `x-cast-operations-token: YOUR_CAST_OPERATIONS_INGESTION_TOKEN` |

Pyroscope SDKs append `/ingest` to the base URL and Grafana Alloy appends `/push.v1.PusherService/Push` — you always configure just the base URL. SDKs that take an `authToken` / `auth_token` option send it as `Authorization: Bearer <token>`, which Cast Operations accepts as an alias for the `x-cast-operations-token` header.

**Self Hosted Cast Operations:** replace `https://visca.ai` with your own host, e.g. `http(s)://YOUR-OPERATIONS-HOST/pyroscope`.

## Supported Profile Formats

| Format                                      | Sent by                                                             | Supported                                     |
| ------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------- |
| pprof (binary protobuf, optionally gzipped) | Go, Node.js, and .NET Pyroscope SDKs; Grafana Alloy                 | Yes                                           |
| Folded / collapsed text                     | Python, Ruby, and Rust Pyroscope SDKs (their default upload format) | Yes                                           |
| JFR (Java Flight Recorder)                  | Pyroscope Java agent                                                | Not yet — use Grafana Alloy for Java services |

## Step 1 - Create a Telemetry Ingestion Token

After you sign up to Cast Operations and create a project, click on "More" in the Navigation bar and click on "Project Settings".

On the Telemetry Ingestion Key page, click on "Create Ingestion Key" to create a token.

![Create Service](/docs/static/images/TelemetryIngestionKeys.png)

Once you created a token, click on "View" to view the token.

![View Service](/docs/static/images/TelemetryIngestionKeyView.png)

## Step 2 - Send Profiles

### Option A: Grafana Alloy with eBPF (recommended, zero code changes)

[Grafana Alloy](https://grafana.com/docs/alloy/latest/) collects CPU profiles from every process on a Linux host using eBPF — no agent inside your application and no code changes. It works for Go, Rust, C/C++, Java, Python, Ruby, PHP, Node.js, and .NET.

Create `alloy-config.alloy`:

```hcl
discovery.process "all" {
  refresh_interval = "60s"
}

discovery.relabel "alloy_profiles" {
  targets = discovery.process.all.targets

  rule {
    action       = "replace"
    source_labels = ["__meta_process_exe"]
    target_label  = "service_name"
  }
}

pyroscope.ebpf "default" {
  targets    = discovery.relabel.alloy_profiles.output
  forward_to = [pyroscope.write.cast-operations.receiver]

  collect_interval = "15s"
  sample_rate      = 97
}

pyroscope.write "cast-operations" {
  endpoint {
    url = "https://visca.ai/pyroscope"
    headers = {
      "x-cast-operations-token" = "YOUR_CAST_OPERATIONS_INGESTION_TOKEN",
    }
  }
}
```

Run it with Docker (eBPF needs a privileged container with the host PID namespace):

```yaml
# docker-compose.yml
services:
  alloy:
    image: grafana/alloy:latest
    privileged: true
    pid: host
    volumes:
      - ./alloy-config.alloy:/etc/alloy/config.alloy
      - /proc:/proc:ro
      - /sys:/sys:ro
    command:
      - run
      - /etc/alloy/config.alloy
```

Or run it directly on the host:

```bash
alloy run alloy-config.alloy
```

### Option B: Pyroscope language SDKs (in-process profiling)

Pyroscope SDKs run inside your application and continuously upload profiles. Point the SDK's server address at the Cast Operations base URL and pass your ingestion token as the auth token.

**Go** (uploads pprof):

```go
import "github.com/grafana/pyroscope-go"

pyroscope.Start(pyroscope.Config{
    ApplicationName: "my-service",
    ServerAddress:   "https://visca.ai/pyroscope",
    AuthToken:       "YOUR_CAST_OPERATIONS_INGESTION_TOKEN",
    ProfileTypes: []pyroscope.ProfileType{
        pyroscope.ProfileCPU,
        pyroscope.ProfileAllocObjects,
        pyroscope.ProfileAllocSpace,
        pyroscope.ProfileInuseObjects,
        pyroscope.ProfileInuseSpace,
        pyroscope.ProfileGoroutines,
    },
})
```

**Node.js** (uploads pprof):

```javascript
const Pyroscope = require("@pyroscope/nodejs");

Pyroscope.init({
  serverAddress: "https://visca.ai/pyroscope",
  appName: "my-service",
  authToken: "YOUR_CAST_OPERATIONS_INGESTION_TOKEN",
});

Pyroscope.start();
```

**Python** (uploads folded text):

```python
import pyroscope

pyroscope.configure(
    application_name="my-service",
    server_address="https://visca.ai/pyroscope",
    auth_token="YOUR_CAST_OPERATIONS_INGESTION_TOKEN",
)
```

**.NET** (uploads pprof), **Ruby** and **Rust** (upload folded text) work the same way: install the [Pyroscope SDK for your language](https://grafana.com/docs/pyroscope/latest/configure-client/) and set the server address to `https://visca.ai/pyroscope` with your ingestion token as the auth token.

### Java

The Pyroscope Java agent uploads profiles in JFR format, which Cast Operations does not ingest yet. Profile Java services with the Grafana Alloy eBPF integration (Option A above) instead — it captures JVM CPU profiles with no agent or code changes.

## Supported Profile Types

Each uploaded profile is classified by the first sample type it declares (the standard pprof / Pyroscope convention). Any type is stored and viewable; the types below get first-class grouping, units, and labels in the Cast Operations UI:

| Profile type                         | Shown as               | Unit        |
| ------------------------------------ | ---------------------- | ----------- |
| `cpu`, `samples`                     | CPU time               | nanoseconds |
| `wall`                               | Wall time              | nanoseconds |
| `inuse_space`, `alloc_space`, `heap` | Memory (bytes)         | bytes       |
| `inuse_objects`, `alloc_objects`     | Memory (object counts) | count       |
| `mutex`, `contention`, `block`       | Lock contention        | nanoseconds |
| `goroutine`                          | Goroutines (Go)        | count       |

Anything else (for example a custom sample type) appears under "Other" with its raw name.

## Verify It Is Working

1. **Check your token.** The ingest endpoints intentionally return HTTP 200 even for an invalid token (so a misconfigured agent does not retry-storm the server), which means a silent token typo is invisible from the agent side. Ask the validation endpoint instead:

   ```bash
   curl -i -H "x-cast-operations-token: YOUR_CAST_OPERATIONS_INGESTION_TOKEN" \
     https://visca.ai/otlp/v1/validate
   ```

   A valid token returns `200` with `{"valid": true, ...}`; an unknown or revoked token returns `401`.

2. **Open the Profiles page.** In the Cast Operations Dashboard go to **Telemetry > Profiles**. With Alloy's default 15-second collect interval (or the SDKs' ~10-second upload interval), the first profiles and their flamegraphs appear within a minute or two of the agent starting.

3. **Check the service.** Profiles are attached to the telemetry service named by the SDK's `application_name` / `appName` (or the process executable name under Alloy's default relabel rule above).

## Features

### Flamegraph Visualization

Cast Operations renders profile data as interactive flamegraphs. Each bar represents a function in the call stack, and its width is proportional to the time or resources consumed. You can click on any function to zoom in and see its callers and callees.

### Function List

View a sortable table of all functions captured in a profile, ranked by self time, total time, or allocation count. This helps you quickly identify the most expensive functions in your application.

### Trace Correlation

When a profile carries trace and span IDs (for example as `trace_id` / `span_id` sample labels), you can navigate directly from a slow trace span to the corresponding CPU or memory profile to understand exactly what code was executing.

### Filtering by Profile Type

Filter profiles by category (CPU, Memory, Locks, Wall time, Goroutines) to focus on the specific resource dimension you are investigating.

## Data Retention

Profile data retention is configured per telemetry service in your Cast Operations project settings. The default retention period is 15 days. Data is automatically deleted after the retention period expires.

To change the retention period for a service, navigate to **Telemetry > Services > [Your Service] > Settings** and update the data retention value.

## Need Help?

Please contact support@visca.ai if you need any help setting up profiling with Cast Operations.
