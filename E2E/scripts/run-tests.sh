#!/usr/bin/env bash

set -uo pipefail

npx playwright test
test_status=$?

if [[ ${test_status} -ne 0 && -n "${E2E_TESTS_FAILED_WEBHOOK_URL:-}" ]]; then
  curl \
    --fail \
    --silent \
    --show-error \
    --max-time 10 \
    "${E2E_TESTS_FAILED_WEBHOOK_URL}" || true
fi

exit "${test_status}"
