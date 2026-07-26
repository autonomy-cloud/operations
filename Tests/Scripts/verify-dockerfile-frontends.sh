#!/usr/bin/env bash

set -euo pipefail

readonly expected_frontend='# syntax=mirror.gcr.io/docker/dockerfile:1.7@sha256:a57df69d0ea827fb7266491f2813635de6f17269be881f696fbfdf2d83dda33e'
failed=0

while IFS= read -r dockerfile; do
  first_line="$(head -n 1 "$dockerfile")"
  if [[ "$first_line" == '# syntax='* && "$first_line" != "$expected_frontend" ]]; then
    echo "Unpinned or non-mirrored Dockerfile frontend in ${dockerfile}: ${first_line}" >&2
    failed=1
  fi
done < <(git ls-files '*Dockerfile*')

if [[ "$failed" -ne 0 ]]; then
  exit 1
fi

echo "All Dockerfile frontends use the immutable mirrored reference."
