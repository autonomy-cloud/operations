#!/usr/bin/env bash

set -euo pipefail

version="${1:?Usage: verify-release-images.sh <version> [repository]}"
repository="${2:-ghcr.io/autonomy-cloud/operations}"

rendered_images="$(
  APP_TAG="$version" \
    CAST_OPERATIONS_IMAGE_REPOSITORY="$repository" \
    docker compose config --images
)"

expected_images=(
  "${repository}/app:${version}"
  "${repository}/probe:${version}"
  "${repository}/ai-agent:${version}"
  "${repository}/nginx:${version}"
)

for expected_image in "${expected_images[@]}"; do
  if ! grep -Fxq "$expected_image" <<<"$rendered_images"; then
    echo "Missing canonical release image: $expected_image" >&2
    echo "Rendered images:" >&2
    echo "$rendered_images" >&2
    exit 1
  fi
done

if grep -Eq '^cast-operations/(app|probe|ai-agent|nginx):' <<<"$rendered_images"; then
  echo "Docker Hub application image found in rendered release compose:" >&2
  echo "$rendered_images" >&2
  exit 1
fi

echo "Release image contract verified for ${repository}:${version}"
