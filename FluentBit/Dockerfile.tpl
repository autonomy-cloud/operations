FROM cr.fluentbit.io/fluent/fluent-bit

# the bottom for consistency with the other images (this image has no build
# steps, so it only affects metadata layering).

LABEL org.opencontainers.image.title="Cast Operations Fluent Bit"
LABEL org.opencontainers.image.description="Cast Operations Fluent Bit collector — lightweight log shipper for the Cast Operations telemetry pipeline."
LABEL org.opencontainers.image.source="https://github.com/autonomy-cloud/operations"
LABEL org.opencontainers.image.url="https://latticeruntime.com"
LABEL org.opencontainers.image.documentation="https://latticeruntime.com/docs"
LABEL org.opencontainers.image.vendor="Cast Operations"
LABEL org.opencontainers.image.licenses="Apache-2.0"

# This container will only run in dev env, so this is ok.
USER root

EXPOSE 24224
EXPOSE 24284
EXPOSE 2020
EXPOSE 8889

# Per-build metadata last (kept consistent with the other images).
ARG GIT_SHA
ARG APP_VERSION
ENV GIT_SHA=${GIT_SHA}
ENV APP_VERSION=${APP_VERSION}
LABEL org.opencontainers.image.revision="${GIT_SHA}"
LABEL org.opencontainers.image.version="${APP_VERSION}"

CMD ["/fluent-bit/bin/fluent-bit", "-c", "/fluent-bit/etc/fluent-bit.yaml"]