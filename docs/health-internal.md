# Internal health endpoint

`health.internal.latticeruntime.com` is the private Cast Operations status
page served from the `m3` Docker deployment. Its public DNS record deliberately
contains the host's Tailscale address, so HTTP-01 certificate validation cannot
reach it from the public Internet.

The deployment contract is `docker-compose.health-internal.yml`. It gives the
Operations ingress an exact HTTPS virtual host and mounts the certificate
directory read-only. The ingress fails closed when either TLS file is absent;
it must never expose the dynamic status-page TLS listener as a substitute for
the primary host certificate.

Issue or renew a publicly trusted certificate with DNS-01 outside the
application deployment. Deliver it without committing either file:

```text
Certs/ServerCerts/health.internal.latticeruntime.com.crt
Certs/ServerCerts/health.internal.latticeruntime.com.key
```

The certificate must include `health.internal.latticeruntime.com` as a SAN.
Validate inputs without changing containers:

```sh
Scripts/Install/health-internal.sh check
```

After DNS still resolves to the intended `m3` Tailscale address, apply only the
ingress overlay:

```sh
Scripts/Install/health-internal.sh up
```

Acceptance requires a successful direct-SNI request before ordinary DNS is
treated as healthy:

```sh
curl --resolve health.internal.latticeruntime.com:443:100.70.237.119 \
  https://health.internal.latticeruntime.com/
```
