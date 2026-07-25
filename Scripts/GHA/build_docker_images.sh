#!/usr/bin/env bash

set -euo pipefail

usage() {
	cat <<'EOF'
Usage: build_docker_images.sh --image <name> --version <version> --dockerfile <path> [options]

Builds and pushes the single Cast Operations image. No remote (GHA) cache is
used because GitHub can evict a cache blob while its manifest still references
it, causing intermittent BlobNotFound failures during import.

Required flags:
	--image <name>        Image name without registry prefix (example: mcp)
	--version <version>   Version/tag string appended to the generated tags
	--dockerfile <path>   Path to the Dockerfile relative to the repo root

Optional flags:
	--context <path>      Build context directory (default: .)
	--platforms <list>    Comma-separated platforms passed to docker buildx (default: linux/amd64,linux/arm64)
	                      When a single platform is given, tags are suffixed with the arch
	                      (e.g. -amd64 or -arm64) so parallel builds don't overwrite each other.
	--git-sha <sha>       Commit SHA used for the GIT_SHA build arg (default: detected via git)
	--extra-tags <tag>    Additional tag (no version; can be repeated)
EOF
}

IMAGE=""
VERSION=""
DOCKERFILE=""
CONTEXT="."
PLATFORMS="linux/amd64,linux/arm64"
GIT_SHA=""
EXTRA_TAGS=()
GHCR_REPOSITORY="${GHCR_REPOSITORY:-ghcr.io/autonomy-cloud/operations}"

while [[ $# -gt 0 ]]; do
	case "$1" in
		--image)
			IMAGE="$2"
			shift 2
			;;
		--version)
			VERSION="$2"
			shift 2
			;;
		--dockerfile)
			DOCKERFILE="$2"
			shift 2
			;;
		--context)
			CONTEXT="$2"
			shift 2
			;;
		--platforms)
			PLATFORMS="$2"
			shift 2
			;;
		--git-sha)
			GIT_SHA="$2"
			shift 2
			;;
		--extra-tags)
			EXTRA_TAGS+=("$2")
			shift 2
			;;
		-h|--help)
			usage
			exit 0
			;;
		*)
			echo "Unknown option: $1" >&2
			usage
			exit 1
			;;
	esac
done

if [[ -z "$IMAGE" || -z "$VERSION" || -z "$DOCKERFILE" ]]; then
	echo "Missing required arguments" >&2
	usage
	exit 1
fi

if [[ -z "$GIT_SHA" ]]; then
	if ! GIT_SHA=$(git rev-parse HEAD 2>/dev/null); then
		echo "Failed to detect git SHA. Provide --git-sha." >&2
		exit 1
	fi
fi

# Determine if this is a single-platform build.
# When building for a single platform, append the arch suffix to tags
# so that parallel per-arch jobs don't overwrite each other.
ARCH_SUFFIX=""
if [[ "$PLATFORMS" != *","* ]]; then
	# Single platform — extract arch (e.g. linux/amd64 -> amd64)
	ARCH_SUFFIX="-${PLATFORMS#*/}"
fi

SANITIZED_VERSION="${VERSION//+/-}"

build_image() {
	local extras=("$@")

	local -a tag_args
	tag_args=(
		--tag "${GHCR_REPOSITORY}/${IMAGE}:${SANITIZED_VERSION}${ARCH_SUFFIX}"
	)
	for tag_suffix in "${extras[@]+"${extras[@]}"}"; do
		tag_args+=(--tag "${GHCR_REPOSITORY}/${IMAGE}:${tag_suffix}${ARCH_SUFFIX}")
	done

	# No --cache-from/--cache-to: the GHA remote cache was removed because GitHub
	# evicts cache blobs (7-day TTL / ~10 GB-per-repo LRU) while leaving the
	# manifest that references them, producing intermittent BlobNotFound import
	# failures that fail the whole build. BuildKit's in-builder local cache still
	# speeds up repeat builds within the same builder.
	docker buildx build \
		--file "$DOCKERFILE" \
		--platform "$PLATFORMS" \
		--push \
		"${tag_args[@]}" \
		--build-arg "GIT_SHA=${GIT_SHA}" \
		--build-arg "APP_VERSION=${VERSION}" \
		"$CONTEXT"
}

echo "🚀 Building docker images for ${IMAGE} (${VERSION}) [${PLATFORMS}]"
build_image "${EXTRA_TAGS[@]+"${EXTRA_TAGS[@]}"}"
echo "✅ Pushed image for ${IMAGE}:${SANITIZED_VERSION}${ARCH_SUFFIX}"
