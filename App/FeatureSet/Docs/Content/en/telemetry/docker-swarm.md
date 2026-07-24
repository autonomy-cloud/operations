# Cast Operations Docker Swarm Agent

## Overview

The Cast Operations Docker Swarm Agent monitors a Docker Swarm cluster — nodes, services, tasks, stacks, overlay networks, secrets, configs, volumes — plus per-container metrics and logs. It is two cooperating containers run with Docker Compose on a swarm **manager** node:

1. **Collector** — a pre-configured OpenTelemetry Collector that scrapes `docker_stats` for container metrics, tails container logs, and tails the inventory snapshot file, stamping everything with your cluster identity (`docker.swarm.cluster.name`) before shipping over OTLP.
2. **Inventory poller** — a small `curl` + `jq` sidecar that every 5 minutes walks the Swarm manager API (`/nodes`, `/services`, `/tasks`, `/networks`, `/secrets`, `/configs`, `/volumes`) and derives stacks from the `com.docker.stack.namespace` service label, writing one JSON line per object for the collector to forward.

The cluster auto-registers in Cast Operations on first telemetry, keyed by the cluster name you configure.

## Prerequisites

- Docker Engine 20.10+ with the Docker Compose v2 plugin, **on a swarm manager node** (the inventory poller calls manager-only API endpoints).
- A **Cast Operations Telemetry Ingestion Key** — create one from _Project Settings → Telemetry Ingestion Keys_ and copy the value.

### Where to run the agent

Run it on a **manager node**. For full per-node container metrics, run the collector on every node (all sharing the same `DOCKER_SWARM_CLUSTER_NAME`); the inventory poller only needs to run on one manager. When deploying as a swarm stack rather than via Compose, constrain the inventory poller to managers with `node.role == manager`.

## Quick Start — install script

```bash
curl -sSL https://raw.githubusercontent.com/autonomy-cloud/operations/master/DockerSwarmAgent/install.sh -o install.sh
sh install.sh
```

The script prompts for your Cast Operations URL, telemetry ingestion key, and cluster name, installs to `/opt/cast-operations-docker-swarm-agent`, and starts the agent.

## Quick Start — Docker Compose

Download `docker-compose.yml`, `otel-collector-config.yaml`, and `inventory-snapshot.sh` from the [`DockerSwarmAgent`](https://github.com/autonomy-cloud/operations/tree/master/DockerSwarmAgent) directory onto a manager node, then create a `.env` file next to them:

```bash
CAST_OPERATIONS_URL=https://latticeruntime.com
CAST_OPERATIONS_SERVICE_TOKEN=your-telemetry-ingestion-key
DOCKER_SWARM_CLUSTER_NAME=my-swarm
```

Then start the agent:

```bash
chmod +x inventory-snapshot.sh
docker compose up -d
```

The cluster appears in Cast Operations within a few minutes, and the resource list pages (Nodes, Services, Tasks, Stacks, Networks, Secrets, Configs, Volumes) populate after the first inventory snapshot (≤ 5 minutes).

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

The Docker Host agent models a single host and stamps `host.name` + `container.runtime=docker`. The Swarm agent deliberately stamps **only** `docker.swarm.cluster.name` so Cast Operations attributes the telemetry to the swarm cluster rather than auto-registering each node as a standalone Host or Docker Host.

## Troubleshooting

- **No inventory appears** — confirm the poller runs on a manager (`docker node ls` must succeed there). Check `docker compose logs cast-operations-docker-swarm-inventory` for `failed to emit ...` lines.
- **Cluster never appears** — check the collector logs and that `CAST_OPERATIONS_SERVICE_TOKEN` / `CAST_OPERATIONS_URL` are correct.
- **Status flaps to Disconnected** — the cluster is marked disconnected after 15 minutes without telemetry; ensure the collector container stays running.
