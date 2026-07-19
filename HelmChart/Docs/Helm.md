### Installation

Test Install:

```
helm install cast-operations ./HelmChart/Public/cast-operations -f ./HelmChart/Public/cast-operations/values.yaml -f ./HelmChart/Values/test.values.yaml
```

Prod Install:

```
helm install cast-operations ./HelmChart/Public/cast-operations -f ./HelmChart/Public/cast-operations/values.yaml -f ./HelmChart/Values/prod.values.yaml
```

### Upgrade

Test Upgrade:

```
helm upgrade cast-operations ./HelmChart/Public/cast-operations -f ./HelmChart/Public/cast-operations/values.yaml  -f ./HelmChart/Values/test.values.yaml
```

Prod Upgrade:

```
helm upgrade cast-operations ./HelmChart/Public/cast-operations -f ./HelmChart/Public/cast-operations/values.yaml -f ./HelmChart/Values/prod.values.yaml
```

### Remove

```
helm uninstall cast-operations
```

### Lint

```
helm lint ./HelmChart/Public/cast-operations
```

### Run tests

```
helm test cast-operations
```
