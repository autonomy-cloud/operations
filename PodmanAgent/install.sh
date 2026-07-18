#!/bin/bash
set -e

echo "=========================================="
echo "  Cast Operations Podman Agent Installer"
echo "=========================================="
echo ""

# Check prerequisites
if ! command -v podman &> /dev/null; then
    echo "Error: Podman is not installed. Please install Podman first."
    exit 1
fi

if ! podman info &> /dev/null 2>&1; then
    echo "Error: Podman is not available or you don't have permission to access it."
    echo "Ensure the Podman API socket is enabled, e.g. 'systemctl --user enable --now podman.socket'"
    echo "(rootless) or 'sudo systemctl enable --now podman.socket' (rootful), or run with sudo."
    exit 1
fi

# Prompt for configuration
if [ -z "$ONEUPTIME_URL" ]; then
    read -rp "Cast Operations URL (e.g., https://visca.ai): " ONEUPTIME_URL
fi

if [ -z "$ONEUPTIME_SERVICE_TOKEN" ]; then
    read -rp "Cast Operations Service Token: " ONEUPTIME_SERVICE_TOKEN
fi

if [ -z "$PODMAN_HOST_NAME" ]; then
    read -rp "Podman host name (friendly label shown in Cast Operations) [podman-host]: " PODMAN_HOST_NAME
    PODMAN_HOST_NAME="${PODMAN_HOST_NAME:-podman-host}"
fi

IMAGE="${ONEUPTIME_PODMAN_AGENT_IMAGE:-oneuptime/podman-agent:release}"

echo ""
echo "Pulling image: $IMAGE"
podman pull "$IMAGE"

# Remove any existing container
if podman ps -a --format '{{.Names}}' | grep -q '^oneuptime-podman-agent$'; then
    echo "Removing existing oneuptime-podman-agent container..."
    podman rm -f oneuptime-podman-agent
fi

echo ""
echo "Starting Cast Operations Podman Agent..."
podman run -d \
    --name oneuptime-podman-agent \
    --user 0:0 \
    --restart unless-stopped \
    -v /run/podman/podman.sock:/run/podman/podman.sock:ro \
    -v /var/lib/containers/storage:/var/lib/containers/storage:ro \
    -e ONEUPTIME_URL="$ONEUPTIME_URL" \
    -e ONEUPTIME_SERVICE_TOKEN="$ONEUPTIME_SERVICE_TOKEN" \
    -e PODMAN_HOST_NAME="$PODMAN_HOST_NAME" \
    --log-driver json-file \
    --log-opt max-size=10m \
    --log-opt max-file=3 \
    "$IMAGE"

echo ""
echo "=========================================="
echo "  Cast Operations Podman Agent is running!"
echo "=========================================="
echo ""
echo "To check status:  podman ps --filter name=oneuptime-podman-agent"
echo "To view logs:     podman logs -f oneuptime-podman-agent"
echo "To stop:          podman rm -f oneuptime-podman-agent"
echo "To upgrade:       podman pull $IMAGE && podman rm -f oneuptime-podman-agent && re-run this script"
