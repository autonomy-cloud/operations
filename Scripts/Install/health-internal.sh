#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
hostname="health.internal.latticeruntime.com"
certificate="${root}/Certs/ServerCerts/${hostname}.crt"
certificate_key="${root}/Certs/ServerCerts/${hostname}.key"
config_file="${CONFIG_ENV_FILE:-${root}/config.env}"
compose_files=(-f docker-compose.base.yml -f docker-compose.dev.yml -f docker-compose.health-internal.yml)

fail() { echo "health.internal: $1" >&2; exit 1; }

for command in docker openssl; do
  command -v "${command}" >/dev/null || fail "${command} is required"
done

[[ -s "${config_file}" ]] || fail "config.env is absent; create it from config.example.env"
set -a
# shellcheck disable=SC1091 -- config.env is deployment-local and intentionally untracked.
source "${config_file}"
set +a

[[ -s "${certificate}" ]] || fail "certificate is absent: ${certificate}"
[[ -s "${certificate_key}" ]] || fail "certificate key is absent: ${certificate_key}"

openssl x509 -in "${certificate}" -noout -checkend 86400 >/dev/null ||
  fail "certificate is expired or expires within 24 hours"
openssl x509 -in "${certificate}" -noout -text |
  grep -Eq "DNS:${hostname}([,[:space:]]|$)" ||
  fail "certificate SAN does not contain ${hostname}"

certificate_public_key="$(openssl x509 -in "${certificate}" -pubkey -noout | openssl sha256)"
private_public_key="$(openssl pkey -in "${certificate_key}" -pubout 2>/dev/null | openssl sha256)"
[[ "${certificate_public_key}" == "${private_public_key}" ]] ||
  fail "certificate and private key do not match"

docker compose "${compose_files[@]}" config --quiet
echo "health.internal: TLS inputs and Compose configuration are valid"

case "${1:-check}" in
  check) ;;
  up)
    docker compose "${compose_files[@]}" up -d --build ingress
    ;;
  *) fail "usage: $0 [check|up]" ;;
esac
