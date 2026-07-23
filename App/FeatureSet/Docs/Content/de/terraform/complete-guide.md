# Cast Operations Terraform-Provider

Der Cast Operations Terraform-Provider ermöglicht die Verwaltung von Cast Operations-Ressourcen mittels Infrastructure as Code (IaC). Dieser Provider ermöglicht Ihnen, Überwachung, Incident-Management, Status-Seiten und andere Cast Operations-Funktionen über Terraform zu konfigurieren.

## Installation

### Aus dem Terraform Registry (Empfohlen)

Der Cast Operations Terraform-Provider ist im [Terraform Registry](https://registry.terraform.io/providers/autonomy-cloud/operations) verfügbar.

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Neueste 7.x-Version verwenden
    }
  }
  required_version = ">= 1.0"
}
```

### Versions-Pinning für selbst gehostete Installationen

⚠️ **Wichtig für selbst gehostete Kunden**: Pinnen Sie die Terraform-Provider-Version immer auf Ihre Cast Operations-Installationsversion, um API-Kompatibilität sicherzustellen.

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Auf genaue Version pinnen, die Ihrer Cast Operations-Installation entspricht
    }
  }
  required_version = ">= 1.0"
}
```

## Provider-Konfiguration

### Grundkonfiguration

```hcl
provider "cast-operations" {
  cast_operations_url = "https://your-operations-instance.com"  # Oder https://latticeruntime.com für Cloud
  api_key       = var.cast_operations_api_key
}
```

### Umgebungsvariablen

```bash
export CAST_OPERATIONS_URL="https://your-operations-instance.com"
export CAST_OPERATIONS_API_KEY="your-api-key-here"
```

### Konfigurationsoptionen

| Argument        | Umgebungsvariable   | Beschreibung            | Erforderlich |
| --------------- | ------------------- | ----------------------- | ------------ |
| `cast_operations_url` | `CAST_OPERATIONS_URL`     | Cast Operations-URL           | Ja           |
| `api_key`       | `CAST_OPERATIONS_API_KEY` | Cast Operations-API-Schlüssel | Ja           |

## Schnellstart

### 1. API-Schlüssel erstellen

1. Gehen Sie zu **Einstellungen** → **API-Schlüssel**
2. Klicken Sie auf **API-Schlüssel erstellen**
3. Geben Sie einen beschreibenden Namen an (z. B. "Terraform Automation")
4. Wählen Sie entsprechende Berechtigungen
5. Kopieren Sie den generierten API-Schlüssel

### 2. Terraform initialisieren und anwenden

```bash
# Terraform initialisieren
terraform init

# Änderungen planen
terraform plan

# Konfiguration anwenden
terraform apply
```

## Versionskompatiblität

### Cloud-Kunden

Verwenden Sie die neueste Provider-Version:

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Immer neueste kompatible Version verwenden
    }
  }
}
```

### Selbst gehostete Kunden

**Kritisch**: Pinnen Sie die Provider-Version auf Ihre Cast Operations-Installation:

| Cast Operations-Version | Provider-Version | Konfiguration          |
| ----------------- | ---------------- | ---------------------- |
| 7.0.x             | 7.0.x            | `version = "~> 7.0.0"` |
| 7.1.x             | 7.1.x            | `version = "~> 7.1.0"` |

## Verfügbare Ressourcen

- `cast_operations_team` - Teams verwalten
- `cast_operations_monitor` - Monitore erstellen und verwalten
- `cast_operations_probe` - Überwachungs-Probes verwalten
- `cast_operations_on_call_duty_policy` - Bereitschaftspläne einrichten
- `cast_operations_status_page` - Status-Seiten erstellen
- `cast_operations_service_catalog` - Servicekatalogeinträge verwalten

## Best Practices

### 1. Versionsverwaltung

**Für Cloud-Kunden:**

- Semantische Versionierung mit `~>` verwenden
- Änderungsprotokoll vor größeren Versions-Upgrades prüfen

**Für selbst gehostete Kunden:**

- Immer auf genaue Version Ihrer Installation pinnen
- Provider-Version beim Cast Operations-Upgrade aktualisieren
- Zuerst in Nicht-Produktionsumgebung testen

### 2. Zustandsverwaltung

```hcl
terraform {
  backend "s3" {
    bucket = "my-terraform-state"
    key    = "cast-operations/terraform.tfstate"
    region = "us-west-2"
  }
}
```

### 3. Variablenverwaltung

```hcl
# variables.tf
variable "environment" {
  description = "Umgebungsname"
  type        = string
}
```

## Support und Ressourcen

- **Dokumentation**: [Cast Operations Docs](https://docs.latticeruntime.com)
- **Terraform Registry**: [Cast Operations Provider](https://registry.terraform.io/providers/autonomy-cloud/operations)
- **GitHub Issues**: [Cast Operations GitHub](https://github.com/autonomy-cloud/operations/issues)
