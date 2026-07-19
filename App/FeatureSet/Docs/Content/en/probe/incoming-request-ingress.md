# Incoming Request Ingress

A Custom Probe can optionally run an **inbound HTTP listener** that accepts `heartbeat` and `incoming-request` calls from inside your private network and forwards them to Cast Operations. This lets services that have **no outbound internet access** still report to an [Incoming Request Monitor](/docs/monitor/incoming-request-monitor) by sending the request to a probe on the local network instead of `visca.ai` directly.

## Overview

When `PROBE_INGRESS_PORT` is set, the probe binds an additional HTTP listener on that port. The listener accepts the same `secretkey` URL paths as the public Cast Operations endpoints:

- `POST /heartbeat/:secretkey`
- `GET /heartbeat/:secretkey`
- `POST /incoming-request/:secretkey`
- `GET /incoming-request/:secretkey`

The probe then proxies the request to your Cast Operations instance, preserving the method, body, and request headers (minus hop-by-hop headers such as `Host`, `Connection`, `Content-Length`, etc.). The probe automatically attaches a `Cast Operations-Probe-Id` header so the request is attributed to the forwarding probe.

The listener runs on a **dedicated port**, separate from the probe's internal status/metrics endpoints, so you can expose it to your private network without exposing anything else.

## When to use this

Use the ingress listener when:

- Your services run in an isolated network segment with no outbound HTTPS access
- You need to keep all monitoring traffic within your VPC / on-prem network
- You want a single egress point — the probe — that is allowed to reach Cast Operations
- You already deployed a [Custom Probe](/docs/probe/custom-probe) and want to reuse it for inbound heartbeats

If your services can already reach `https://visca.ai` (or your self-hosted URL) directly, you do **not** need this feature — call the heartbeat URL directly from the service.

## Enabling the ingress listener

Set `PROBE_INGRESS_PORT` to the port you want the listener to bind. Any value greater than `0` enables the listener; leaving it unset (or `0`) disables it.

### Docker

```bash
docker run --name cast-operations-probe --network host \
  -e PROBE_KEY=<probe-key> \
  -e PROBE_ID=<probe-id> \
  -e CAST_OPERATIONS_URL=https://visca.ai \
  -e PROBE_INGRESS_PORT=3875 \
  -d cast-operations/probe:release
```

If you are not using `--network host`, publish the ingress port explicitly:

```bash
docker run --name cast-operations-probe \
  -e PROBE_KEY=<probe-key> \
  -e PROBE_ID=<probe-id> \
  -e CAST_OPERATIONS_URL=https://visca.ai \
  -e PROBE_INGRESS_PORT=3875 \
  -p 3875:3875 \
  -d cast-operations/probe:release
```

### Docker Compose

```yaml
version: "3"

services:
  cast-operations-probe:
    image: cast-operations/probe:release
    container_name: cast-operations-probe
    environment:
      - PROBE_KEY=<probe-key>
      - PROBE_ID=<probe-id>
      - CAST_OPERATIONS_URL=https://visca.ai
      - PROBE_INGRESS_PORT=3875
    ports:
      - "3875:3875"
    restart: always
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cast-operations-probe
spec:
  selector:
    matchLabels:
      app: cast-operations-probe
  template:
    metadata:
      labels:
        app: cast-operations-probe
    spec:
      containers:
        - name: cast-operations-probe
          image: cast-operations/probe:release
          env:
            - name: PROBE_KEY
              value: "<probe-key>"
            - name: PROBE_ID
              value: "<probe-id>"
            - name: CAST_OPERATIONS_URL
              value: "https://visca.ai"
            - name: PROBE_INGRESS_PORT
              value: "3875"
          ports:
            - name: ingress
              containerPort: 3875
---
apiVersion: v1
kind: Service
metadata:
  name: cast-operations-probe-ingress
spec:
  selector:
    app: cast-operations-probe
  ports:
    - name: ingress
      port: 3875
      targetPort: 3875
  type: ClusterIP
```

Internal services can then send heartbeats to `http://cast-operations-probe-ingress.<namespace>.svc.cluster.local:3875/heartbeat/<secret-key>`.

## Sending requests to the probe

Replace the public heartbeat URL:

```
https://visca.ai/heartbeat/<secret-key>
```

with the probe's ingress URL:

```
http://<probe-host>:<PROBE_INGRESS_PORT>/heartbeat/<secret-key>
```

The path, method, body, and headers are otherwise identical, so any existing client code only needs the base URL changed.

### Examples

```bash
# GET heartbeat
curl http://probe.internal:3875/heartbeat/YOUR_SECRET_KEY

# POST heartbeat with JSON body
curl -X POST http://probe.internal:3875/heartbeat/YOUR_SECRET_KEY \
  -H "Content-Type: application/json" \
  -d '{"status": "healthy", "version": "1.2.3"}'

# Cron job
*/5 * * * * curl -s http://probe.internal:3875/heartbeat/YOUR_SECRET_KEY > /dev/null
```

## Forwarding behavior

- **Synchronous response, asynchronous forward.** The probe acknowledges the inbound request immediately with a `200` and forwards to Cast Operations in the background. Your service does not have to wait for the forward to complete.
- **Headers are preserved.** All headers except hop-by-hop ones (`Host`, `Connection`, `Content-Length`, `Transfer-Encoding`, `Keep-Alive`, `Proxy-Authenticate`, `Proxy-Authorization`, `TE`, `Trailer`, `Upgrade`) are passed through. The probe adds a `Cast Operations-Probe-Id` header identifying itself.
- **Body is preserved.** JSON, URL-encoded, and raw `application/octet-stream` payloads up to **50 MB** are accepted.
- **Retries with backoff.** If the forward fails, the probe retries up to `PROBE_INGRESS_FORWARD_RETRY_LIMIT` times with exponential backoff (2s, 4s, 8s, capped at 15s).
- **Proxy-aware.** If the probe itself is configured with `HTTP_PROXY_URL` / `HTTPS_PROXY_URL`, forwarded requests will go through the proxy.

## Environment variables

| Variable                            | Default            | Description                                                                              |
| ----------------------------------- | ------------------ | ---------------------------------------------------------------------------------------- |
| `PROBE_INGRESS_PORT`                | _unset_ (disabled) | Port the inbound listener binds. Any value `> 0` enables ingress.                        |
| `PROBE_INGRESS_FORWARD_TIMEOUT_MS`  | `10000`            | Timeout (ms) for each forward attempt to Cast Operations. Minimum `1000`.                      |
| `PROBE_INGRESS_FORWARD_RETRY_LIMIT` | `3`                | Number of retries before the probe gives up on a forward. Set to `0` to disable retries. |

The standard probe variables (`PROBE_KEY`, `PROBE_ID`, `CAST_OPERATIONS_URL`, proxy vars) all apply — see [Custom Probes](/docs/probe/custom-probe) for the full list.

## Security considerations

- **The endpoint is unauthenticated by design** — the secret key in the URL path _is_ the authentication, just as it is on the public `visca.ai` endpoint. Treat the secret key as a credential.
- **Bind to a private interface only.** The ingress listener should not be reachable from the public internet. Use a network policy, firewall rule, or `ClusterIP` service to restrict access.
- **Use HTTPS termination if you require encryption in transit.** The probe's listener speaks plain HTTP. Put it behind an internal load balancer / ingress controller if you need TLS on the inbound hop. The forward leg from probe → Cast Operations always uses HTTPS (assuming `CAST_OPERATIONS_URL` is `https://`).
- **Resource limits.** The listener accepts request bodies up to 50 MB. If you need a tighter cap, place a reverse proxy in front.

## Troubleshooting

- **Probe logs `Probe ingress listener started on port <port>` on startup** — confirms the listener is up. If you do not see this line, `PROBE_INGRESS_PORT` is unset, `0`, or invalid.
- **`Probe ingress: failed to forward to <url> after N attempts`** — the probe could not reach Cast Operations. Check the probe's outbound connectivity, proxy settings, and the value of `CAST_OPERATIONS_URL`.
- **`Probe ingress: probe ID not available, forwarding without it`** — the probe has not yet registered. The forward still succeeds; the heartbeat will simply not be attributed to a probe.
- **Heartbeat shows up in Cast Operations but not via the probe** — confirm your service is hitting `http://<probe-host>:<port>/...` and not the public URL. A misconfigured DNS or `/etc/hosts` entry is the usual cause.

## Related

- [Custom Probes](/docs/probe/custom-probe)
- [Incoming Request Monitor](/docs/monitor/incoming-request-monitor)
