#!/bin/bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_DIR="$(dirname "$SCRIPT_DIR")"
ROOT_DIR="$(cd "$TEST_DIR/../../.." && pwd)"

dump_service_diagnostics() {
    local exit_code=$?

    if [ "$exit_code" -eq 0 ]; then
        return
    fi

    echo ""
    echo "=== Cast Operations service diagnostics ==="
    cd "$ROOT_DIR"
    set -a
    if [ -f ./config.env ]; then
        # shellcheck disable=SC1091
        . ./config.env
    fi
    set +a
    docker compose -f docker-compose.dev.yml ps -a || true
    docker compose -f docker-compose.dev.yml logs \
        --no-color \
        --tail=300 \
        app clickhouse postgres redis || true
}

trap dump_service_diagnostics EXIT

echo "=========================================="
echo "Terraform Provider E2E Tests"
echo "=========================================="
echo ""

# Step 1: Install dependencies
#
# Dependencies are installed and the Terraform provider is generated BEFORE the
# Cast Operations services stack is started. Generating the provider loads the entire
# codebase through ts-node (to build the OpenAPI spec) and then shells out to the
# Go toolchain to compile the provider, both of which are very memory hungry. If
# the full docker compose stack is already running at that point, the combined
# memory usage exhausts the CI runner and the job dies with "The runner has
# received a shutdown signal". Doing dependency install + generation first keeps
# those two memory peaks from overlapping with the running services.
echo ""
echo "=== Step 1: Installing dependencies ==="
cd "$ROOT_DIR"

# Clean node_modules to avoid permission issues with npm cache in CI
rm -rf Common/node_modules Scripts/node_modules || true

npm install
cd Common && npm install && cd ..
cd Scripts && npm install && cd ..

# Step 2: Generate Terraform Provider (before services start, see note above)
echo ""
echo "=== Step 2: Generating Terraform Provider ==="
cd "$ROOT_DIR"
npm run generate-terraform-provider

# Step 3: Start Cast Operations services
echo ""
echo "=== Step 3: Starting Cast Operations Services ==="
cd "$ROOT_DIR"
# Terraform provider tests exercise the API only. Starting the frontend
# hot-reload toolchain here delays API readiness and can exhaust CI memory.
export CAST_OPERATIONS_API_ONLY=true
# Scope Compose to the API service. Its declared dependencies bring up
# PostgreSQL, Redis, and ClickHouse, while frontend/probe services remain off.
npm_config_services=app npm run dev

# Step 4: Wait for the API used by the provider
echo ""
echo "=== Step 4: Waiting for the API to be ready ==="
cd "$ROOT_DIR"
set -a
# config-to-dev, invoked by npm run dev, generated the resolved local ports.
# shellcheck disable=SC1091
. ./config.env
set +a
export CAST_OPERATIONS_URL="http://localhost:${APP_PORT}"
bash ./Tests/Scripts/endpoint-status.sh \
    "Cast Operations API" \
    "${CAST_OPERATIONS_URL}/status/ready"

# Step 5: Setup test account
echo ""
echo "=== Step 5: Setting up test account ==="
cd "$TEST_DIR"
"$SCRIPT_DIR/setup-test-account.sh"

# Step 6: Run E2E tests (includes standard tests and CRUD tests with API validation)
echo ""
echo "=== Step 6: Running Terraform E2E Tests ==="
"$SCRIPT_DIR/run-tests.sh"

echo ""
echo "=========================================="
echo "E2E Tests Completed Successfully!"
echo "=========================================="
