#!/bin/sh
# Cast Operations Docker Swarm Agent — installer.
#
# Run this on a swarm MANAGER node. It downloads the compose file, the
# collector config and the inventory poller into
# /opt/cast-operations-docker-swarm-agent, writes a .env from your answers,
# and starts the agent with Docker Compose.

set -eu

INSTALL_DIR="/opt/cast-operations-docker-swarm-agent"
RAW_BASE="https://raw.githubusercontent.com/autonomy-cloud/operations/master/DockerSwarmAgent"

echo "Cast Operations Docker Swarm Agent installer"
echo "--------------------------------------"
echo "Run this on a Docker Swarm MANAGER node (the inventory poller needs the manager API)."
echo ""

printf "Cast Operations URL [https://visca.ai]: "
read -r CAST_OPERATIONS_URL
CAST_OPERATIONS_URL="${CAST_OPERATIONS_URL:-https://visca.ai}"

printf "Cast Operations Telemetry Ingestion Key: "
read -r CAST_OPERATIONS_SERVICE_TOKEN

printf "Docker Swarm cluster name (the join key) [my-swarm]: "
read -r DOCKER_SWARM_CLUSTER_NAME
DOCKER_SWARM_CLUSTER_NAME="${DOCKER_SWARM_CLUSTER_NAME:-my-swarm}"

if [ -z "${CAST_OPERATIONS_SERVICE_TOKEN}" ]; then
    echo "ERROR: a telemetry ingestion key is required." >&2
    exit 1
fi

mkdir -p "${INSTALL_DIR}"
cd "${INSTALL_DIR}"

echo "Downloading agent files into ${INSTALL_DIR}..."
curl -fsSL "${RAW_BASE}/docker-compose.yml" -o docker-compose.yml
curl -fsSL "${RAW_BASE}/otel-collector-config.yaml" -o otel-collector-config.yaml
curl -fsSL "${RAW_BASE}/inventory-snapshot.sh" -o inventory-snapshot.sh
chmod +x inventory-snapshot.sh

cat > .env <<EOF
CAST_OPERATIONS_URL=${CAST_OPERATIONS_URL}
CAST_OPERATIONS_SERVICE_TOKEN=${CAST_OPERATIONS_SERVICE_TOKEN}
DOCKER_SWARM_CLUSTER_NAME=${DOCKER_SWARM_CLUSTER_NAME}
EOF

echo "Starting the agent..."
docker compose pull
docker compose up -d

echo ""
echo "Done. The cluster '${DOCKER_SWARM_CLUSTER_NAME}' should appear in Cast Operations within a few minutes."
echo "Logs: docker compose -f ${INSTALL_DIR}/docker-compose.yml logs -f"
