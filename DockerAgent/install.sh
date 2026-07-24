#!/bin/bash
set -e

echo "=========================================="
echo "  Cast Operations Docker Agent Installer"
echo "=========================================="
echo ""

# Check prerequisites
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed. Please install Docker first."
    exit 1
fi

if ! docker info &> /dev/null 2>&1; then
    echo "Error: Docker daemon is not running or you don't have permission to access it."
    echo "Try running with sudo or add your user to the docker group."
    exit 1
fi

# Prompt for configuration
if [ -z "$CAST_OPERATIONS_URL" ]; then
    read -rp "Cast Operations URL (e.g., https://latticeruntime.com): " CAST_OPERATIONS_URL
fi

if [ -z "$CAST_OPERATIONS_SERVICE_TOKEN" ]; then
    read -rp "Cast Operations Service Token: " CAST_OPERATIONS_SERVICE_TOKEN
fi

if [ -z "$DOCKER_HOST_NAME" ]; then
    read -rp "Docker host name (friendly label shown in Cast Operations) [docker-host]: " DOCKER_HOST_NAME
    DOCKER_HOST_NAME="${DOCKER_HOST_NAME:-docker-host}"
fi

IMAGE="${CAST_OPERATIONS_DOCKER_AGENT_IMAGE:-cast-operations/docker-agent:release}"

echo ""
echo "Pulling image: $IMAGE"
docker pull "$IMAGE"

# Remove any existing container
if docker ps -a --format '{{.Names}}' | grep -q '^cast-operations-docker-agent$'; then
    echo "Removing existing cast-operations-docker-agent container..."
    docker rm -f cast-operations-docker-agent
fi

echo ""
echo "Starting Cast Operations Docker Agent..."
docker run -d \
    --name cast-operations-docker-agent \
    --user 0:0 \
    --restart unless-stopped \
    -v /var/run/docker.sock:/var/run/docker.sock:ro \
    -v /var/lib/docker/containers:/var/lib/docker/containers:ro \
    -e CAST_OPERATIONS_URL="$CAST_OPERATIONS_URL" \
    -e CAST_OPERATIONS_SERVICE_TOKEN="$CAST_OPERATIONS_SERVICE_TOKEN" \
    -e DOCKER_HOST_NAME="$DOCKER_HOST_NAME" \
    --log-driver json-file \
    --log-opt max-size=10m \
    --log-opt max-file=3 \
    "$IMAGE"

echo ""
echo "=========================================="
echo "  Cast Operations Docker Agent is running!"
echo "=========================================="
echo ""
echo "To check status:  docker ps --filter name=cast-operations-docker-agent"
echo "To view logs:     docker logs -f cast-operations-docker-agent"
echo "To stop:          docker rm -f cast-operations-docker-agent"
echo "To upgrade:       docker pull $IMAGE && docker rm -f cast-operations-docker-agent && re-run this script"
