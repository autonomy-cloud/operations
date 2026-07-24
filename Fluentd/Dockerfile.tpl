FROM fluentd

# the bottom so the apt-get layer stays cacheable across the community +
# enterprise build passes.

LABEL org.opencontainers.image.title="Cast Operations Fluentd"
LABEL org.opencontainers.image.description="Cast Operations Fluentd log forwarder — ships container logs into the Cast Operations telemetry pipeline."
LABEL org.opencontainers.image.source="https://github.com/autonomy-cloud/operations"
LABEL org.opencontainers.image.url="https://latticeruntime.com"
LABEL org.opencontainers.image.documentation="https://latticeruntime.com/docs"
LABEL org.opencontainers.image.vendor="Cast Operations"
LABEL org.opencontainers.image.licenses="Apache-2.0"

# This container will only run in dev env, so this is ok.
USER root

# Install bash and curl. 
RUN apt-get update \
	&& apt-get install -y --no-install-recommends bash curl \
	&& rm -rf /var/lib/apt/lists/*

EXPOSE 24224
EXPOSE 8888

# Per-build metadata last so the apt-get layer above stays cacheable across the
# community + enterprise build passes.
ARG GIT_SHA
ARG APP_VERSION
ENV GIT_SHA=${GIT_SHA}
ENV APP_VERSION=${APP_VERSION}
LABEL org.opencontainers.image.revision="${GIT_SHA}"
LABEL org.opencontainers.image.version="${APP_VERSION}"