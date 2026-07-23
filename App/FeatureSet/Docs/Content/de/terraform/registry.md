# Installationsanleitung für den Terraform-Provider

## Installation aus dem Terraform Registry

Der Cast Operations Terraform-Provider ist im offiziellen [Terraform Registry](https://registry.terraform.io/providers/autonomy-cloud/operations) verfügbar.

### Für Cast Operations-Cloud-Benutzer

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Neueste kompatible Version verwenden
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  cast_operations_url = "https://latticeruntime.com"
  api_key       = var.cast_operations_api_key
}
```

### Für selbst gehostete Cast Operations-Benutzer

⚠️ **Kritisch**: Selbst gehostete Kunden müssen die Provider-Version exakt auf ihre Cast Operations-Installation pinnen.

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Durch Ihre genaue Cast Operations-Version ersetzen
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  cast_operations_url = "https://operations.yourcompany.com"  # Ihre selbst gehostete URL
  api_key       = var.cast_operations_api_key
}
```

## Warum Versions-Pinning für selbst gehostete Instanzen?

Der Cast Operations Terraform-Provider wird automatisch aus der Cast Operations-API-Spezifikation generiert. Jede Cast Operations-Version kann haben:

- Unterschiedliche API-Endpunkte
- Aktualisierte Ressourcenschemata
- Neue oder entfernte Funktionen
- Geänderte Validierungsregeln

Die Verwendung einer Provider-Version, die nicht mit Ihrer Cast Operations-Installation übereinstimmt, kann zu API-Kompatibilitätsfehlern führen.

## Ihre Cast Operations-Version finden

### Methode 1: Dashboard

1. Melden Sie sich bei Ihrem Cast Operations-Dashboard an
2. Gehen Sie zu **Einstellungen** → **Über**
3. Notieren Sie die Versionsnummer (z. B. "7.0.123")

### Methode 2: API

```bash
curl https://your-operations-instance.com/api/version | jq '.version'
```

### Methode 3: Docker

```bash
docker images | grep cast-operations
# Nach dem Tag suchen, z. B. cast-operations/dashboard:7.0.123
```

## Provider Registry-Informationen

- **Registry-URL**: https://registry.terraform.io/providers/autonomy-cloud/operations
- **Quell-Repository**: https://github.com/autonomy-cloud/operations
- **Dokumentation**: https://registry.terraform.io/providers/autonomy-cloud/operations/latest/docs

## Versionskompatibilitätsmatrix

| Cast Operations-Version | Provider-Version  | Terraform-Konfiguration |
| ----------------- | ----------------- | ----------------------- |
| 7.0.x             | 7.0.x             | `version = "~> 7.0.0"`  |
| 7.1.x             | 7.1.x             | `version = "~> 7.1.0"`  |
| Neueste Cloud     | Neuester Provider | `version = "~> 7.0"`    |

## Registry-Updates

Der Provider wird automatisch im Terraform Registry veröffentlicht, wenn neue Cast Operations-Versionen erscheinen. Cloud-Benutzer können semantische Versionierung (`~> 7.0`) verwenden, um automatisch kompatible Updates zu erhalten, während selbst gehostete Benutzer auf genaue Versionen pinnen sollten.
