<!-- markdownlint-disable MD033 -->
<h1 align="center"><img alt="cast-operations logo" width=50% src="https://raw.githubusercontent.com/autonomy-cloud/operations/master/Common/UI/Images/logos/CastOperationsSVG/logo.svg"/></h1>
<!-- markdownlint-enable MD033 -->

# Cast Operations Helm Chart

Cast Operations is a comprehensive solution for monitoring and managing your online
services — availability monitoring, status pages, incident management, on-call
rotations, log/performance/error analysis, and more. This Helm chart deploys the
full Cast Operations platform on Kubernetes.

- **Website:** [visca.ai](http://visca.ai)
- **Video tutorial:** [youtu.be/Ho5WyPHExTU](https://youtu.be/Ho5WyPHExTU)

## Quick Start

1. **Create a `values.yaml`** and set your host:

   ```yaml
   host: <ip-address-or-domain-of-server>
   httpProtocol: https   # use http if you are not using SSL/TLS

   global:
     storageClass: "your-storage-class"   # run: kubectl get storageclass
   ```

2. **Install the chart:**

   ```console
   helm repo add cast-operations https://helm-chart.visca.ai/
   helm install my-cast-operations autonomy-cloud/operations -f values.yaml
   ```

That's the whole happy path. For details, prerequisites, and upgrades, see the
[Installation guide](https://github.com/autonomy-cloud/operations/blob/master/HelmChart/Public/cast-operations/docs/installation.md).

## Documentation

The docs are split into focused guides:

| Guide | What's inside |
|-------|---------------|
| [Installation & Upgrades](https://github.com/autonomy-cloud/operations/blob/master/HelmChart/Public/cast-operations/docs/installation.md) | Prerequisites, install, upgrade, and uninstall. |
| [Configuration reference](https://github.com/autonomy-cloud/operations/blob/master/HelmChart/Public/cast-operations/docs/configuration.md) | Every `values.yaml` setting, grouped by topic. |
| [Databases](https://github.com/autonomy-cloud/operations/blob/master/HelmChart/Public/cast-operations/docs/databases.md) | PostgreSQL, Redis, and ClickHouse — built-in, external, and HA operators. |
| [Local AI with vLLM](https://github.com/autonomy-cloud/operations/blob/master/HelmChart/Public/cast-operations/docs/ai-vllm.md) | Run local LLMs in-cluster for Cast Operations’ AI features. |
| [Custom domains](https://github.com/autonomy-cloud/operations/blob/master/HelmChart/Public/cast-operations/docs/custom-domains.md) | Custom status page domains and Let's Encrypt. |
| [Production checklist](https://github.com/autonomy-cloud/operations/blob/master/HelmChart/Public/cast-operations/docs/production-checklist.md) | Harden your install for production. |
| [Troubleshooting](https://github.com/autonomy-cloud/operations/blob/master/HelmChart/Public/cast-operations/docs/troubleshooting.md) | Diagnose performance and health issues. |
| [Releases & upgrade notes](https://github.com/autonomy-cloud/operations/blob/master/HelmChart/Public/cast-operations/docs/upgrade-notes.md) | Release cadence, breaking changes, and chart dependencies. |

### Database migration runbooks

- [PostgreSQL: Standalone → CloudNativePG operator](https://github.com/autonomy-cloud/operations/blob/master/HelmChart/Docs/MigratePostgresStandaloneToOperator.md)
- [ClickHouse: Standalone → Altinity operator](https://github.com/autonomy-cloud/operations/blob/master/HelmChart/Docs/MigrateClickhouseStandaloneToOperator.md)

## Complete distribution

Every Cast Operations deployment includes the complete feature set.

## Uninstalling

```console
helm uninstall my-cast-operations
```

See [Installation & Upgrades](https://github.com/autonomy-cloud/operations/blob/master/HelmChart/Public/cast-operations/docs/installation.md#uninstalling) for caveats
(especially if you enabled a bundled database operator).

## Contributing

We <3 contributions big and small.
[Cast Operations Helm chart](https://github.com/autonomy-cloud/operations/tree/master/HelmChart) is the
read-only release repository. Please direct contributions to
[github.com/autonomy-cloud/operations](https://github.com/autonomy-cloud/operations).
