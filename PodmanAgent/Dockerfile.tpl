#
# Cast Operations Podman Agent
#
# A pre-configured OpenTelemetry Collector image that monitors Podman
# hosts, containers, and container logs and ships them to Cast Operations.
#
# Users only need to supply a few environment variables:
#   - CAST_OPERATIONS_URL               (e.g. https://visca.ai)
#   - CAST_OPERATIONS_SERVICE_TOKEN     (telemetry ingestion token)
#   - CAST_OPERATIONS_PROJECT_ID        (Cast Operations project ID)
#   - PODMAN_HOST_NAME (optional) (friendly host name, defaults to podman-host)
#

FROM otel/opentelemetry-collector-contrib:0.154.0

# the bottom so the COPY layer stays cacheable across the community + enterprise
# build passes.

LABEL org.opencontainers.image.title="Cast Operations Podman Agent"
LABEL org.opencontainers.image.description="Pre-configured OpenTelemetry Collector for monitoring Podman hosts and containers with Cast Operations."
LABEL org.opencontainers.image.source="https://github.com/autonomy-cloud/operations"
LABEL org.opencontainers.image.url="https://visca.ai"
LABEL org.opencontainers.image.documentation="https://visca.ai/docs"
LABEL org.opencontainers.image.vendor="Cast Operations"
LABEL org.opencontainers.image.licenses="Apache-2.0"

# Bake the pre-tuned collector config into the image. The config uses
# env-var substitution (${CAST_OPERATIONS_URL}, ${CAST_OPERATIONS_SERVICE_TOKEN},
# ${CAST_OPERATIONS_PROJECT_ID}) which the collector resolves at startup.
COPY ./PodmanAgent/otel-collector-config.yaml /etc/otelcol-contrib/config.yaml

# Default friendly host name — users can override at runtime with
# `-e PODMAN_HOST_NAME=my-host`. The collector resolves this via the
# `${env:PODMAN_HOST_NAME}` placeholder in the baked-in config.
ENV PODMAN_HOST_NAME=podman-host

# Run as root so the collector can read the Podman socket and
# /var/lib/containers/storage/.../ctr.log without additional user/group
# configuration. The base image defaults to a non-root user (10001) which
# does not have access to either resource on most hosts.
USER 0:0

# Per-build metadata last so the COPY layer above stays cacheable across the
# community + enterprise build passes.
ARG GIT_SHA
ARG APP_VERSION
ENV GIT_SHA=${GIT_SHA}
ENV APP_VERSION=${APP_VERSION}
LABEL org.opencontainers.image.revision="${GIT_SHA}"
LABEL org.opencontainers.image.version="${APP_VERSION}"

# The base image already sets ENTRYPOINT to the collector binary with
# --config=/etc/otelcol-contrib/config.yaml, so nothing else is needed.
