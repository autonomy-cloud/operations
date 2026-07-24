# Cast Operations Docker Swarm Agent

Monitor a Docker Swarm cluster — nodes, services, tasks, stacks, overlay networks, secrets, configs, volumes, plus per-container metrics and logs — with Cast Operations using a pre-configured OpenTelemetry Collector and a lightweight inventory poller.

The agent is two cooperating containers:

1. **Collector** (`cast-operations/docker-swarm-agent`) — a stock `otel/opentelemetry-collector-contrib` with a tuned config. It scrapes `docker_stats` for container metrics, tails container logs, and tails the inventory snapshot file, stamping everything with your cluster identity (`docker.swarm.cluster.name`) before shipping over OTLP.
2. **Inventory poller** (a small `alpine` + `curl` + `jq` sidecar running [`inventory-snapshot.sh`](./inventory-snapshot.sh)) — every 5 minutes it walks the Swarm manager API (`/nodes`, `/services?status=true`, `/tasks`, `/networks`, `/secrets`, `/configs`, `/volumes`) and derives stacks from the `com.docker.stack.namespace` service label, writing one JSON line per object to a file the collector tails.

## Prerequisites

- Docker Engine 20.10+ with the Compose v2 plugin, **on a swarm manager node**. The inventory poller calls manager-only API endpoints, so it must run where the Docker socket belongs to a manager.
- A **Cast Operations Telemetry Ingestion Key** — create one from _Project Settings → Telemetry Ingestion Keys_.

### Where to run the agent

Run it on a **manager node**. For full per-node container metrics, run the collector on every node (all with the same `DOCKER_SWARM_CLUSTER_NAME`); the inventory poller only needs to run on one manager. When deploying as a swarm stack, constrain the inventory poller with `node.role == manager` (see the commented `deploy.placement` block in [`docker-compose.yml`](./docker-compose.yml)).

## Quick Start — install script

```bash
curl -sSL https://raw.githubusercontent.com/autonomy-cloud/operations/master/DockerSwarmAgent/install.sh -o install.sh
sh install.sh
```

The script prompts for your Cast Operations URL, ingestion key, and cluster name, installs to `/opt/cast-operations-docker-swarm-agent`, and starts the agent.

## Quick Start — Docker Compose

Download `docker-compose.yml`, `otel-collector-config.yaml`, and `inventory-snapshot.sh` into a folder on a manager node, then create a `.env`:

```bash
CAST_OPERATIONS_URL=https://latticeruntime.com
CAST_OPERATIONS_SERVICE_TOKEN=your-telemetry-ingestion-key
DOCKER_SWARM_CLUSTER_NAME=my-swarm
```

Then:

```bash
chmod +x inventory-snapshot.sh
docker compose up -d
```

The cluster auto-registers in Cast Operations on first telemetry (keyed by `DOCKER_SWARM_CLUSTER_NAME`), and the inventory list pages populate after the first snapshot (≤ 5 min).

## What gets collected

| Signal                                                                       | Source                               | Powers                                     |
| ---------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------ |
| Node / Service / Task / Stack / Network / Secret / Config / Volume inventory | inventory poller → Swarm manager API | the cluster's resource list + detail pages |
| Cluster counts (nodes ready, tasks running, services, stacks, …)             | derived from the same snapshot       | the overview cards + sidebar badges        |
| Container CPU / memory / pids / uptime                                       | `docker_stats` receiver              | the Metrics tab                            |
| Container stdout/stderr logs                                                 | `filelog` receiver                   | the Logs tab                               |

## Environment variables

| Variable                            | Required | Default                 | Notes                                                          |
| ----------------------------------- | -------- | ----------------------- | -------------------------------------------------------------- |
| `CAST_OPERATIONS_URL`                     | yes      | `https://latticeruntime.com` | Your Cast Operations instance                                        |
| `CAST_OPERATIONS_SERVICE_TOKEN`           | yes      | —                       | Telemetry ingestion key                                        |
| `DOCKER_SWARM_CLUSTER_NAME`         | yes      | `docker-swarm`          | The cluster join key (matches the cluster's Name in Cast Operations) |
| `DOCKER_INVENTORY_INTERVAL_SECONDS` | no       | `300`                   | How often the poller refreshes the inventory snapshot          |

## How it differs from the Docker Host agent

The Docker Host agent models a single host and stamps `host.name` + `container.runtime=docker`. The Swarm agent deliberately stamps **only** `docker.swarm.cluster.name` (not `host.name`/`container.runtime`) so Cast Operations attributes the telemetry to the swarm cluster instead of auto-registering each node as a standalone Host or Docker Host.

## Troubleshooting

### Run the diagnostic script first

`troubleshoot.sh` checks the whole chain — both containers, that the inventory poller is on a manager (`docker node ls`), the snapshot file, cluster-name stamping, token shape, collector self-metrics, and a **definitive server-side token validation** (Cast Operations’ OTLP endpoints return a silent `200` on a bad ingestion key, so log inspection alone cannot tell you the key is wrong; the script asks `GET /otlp/v1/validate` for a real 200/401 verdict):

```bash
curl -sSL https://raw.githubusercontent.com/autonomy-cloud/operations/master/DockerSwarmAgent/troubleshoot.sh -o troubleshoot.sh
bash troubleshoot.sh    # add -d <dir> if you installed outside /opt/cast-operations-docker-swarm-agent
```

- **No inventory appears**: confirm the poller is on a manager (`docker node ls` works there). Check `docker compose logs cast-operations-docker-swarm-inventory` for `failed to emit ...` lines.
- **Cluster not appearing at all**: check the collector logs and that `CAST_OPERATIONS_SERVICE_TOKEN` / `CAST_OPERATIONS_URL` are correct.
- **Status flaps to Disconnected**: the cluster is marked disconnected after 15 minutes without telemetry; make sure the collector container stays up.
