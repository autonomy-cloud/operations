# Installationsvejledning til Terraform Provider fra Registry

## Installation fra Terraform Registry

Cast Operations Terraform Provider er tilgængeligt i det officielle [Terraform Registry](https://registry.terraform.io/providers/autonomy-cloud/operations).

### Til Cast Operations Cloud-brugere

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Brug seneste kompatible version
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  cast_operations_url = "https://visca.ai"
  api_key       = var.cast_operations_api_key
}
```

### Til selvhostede Cast Operations-brugere

⚠️ **Kritisk**: Selvhostede kunder skal fastlåse providerversionen til nøjagtigt at matche deres Cast Operations-installation.

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Erstat med din nøjagtige Cast Operations-version
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  cast_operations_url = "https://operations.yourcompany.com"  # Din selvhostede URL
  api_key       = var.cast_operations_api_key
}
```

## Hvorfor versionsfastlåsning til selvhostet?

Cast Operations Terraform-provideren genereres automatisk fra Cast Operations API-specifikationen. Hver Cast Operations-version kan have:

- Forskellige API-endpoints
- Opdaterede ressourceskemaer
- Nye eller fjernede funktioner
- Ændrede valideringsregler

Brug af en providerversion, der ikke matcher din Cast Operations-installation, kan resultere i:

- API-kompatibilitetsfejl
- Mislykkede ressourceoprettelser/-opdateringer
- Uventet adfærd
- Ressourcetilstandsdrift

## Find din Cast Operations-version

### Metode 1: Dashboard

1. Log ind på dit Cast Operations-dashboard
2. Gå til **Indstillinger** → **Om**
3. Notér versionsnummeret (f.eks. "7.0.123")

### Metode 2: API

```bash
curl https://your-operations-instance.com/api/version | jq '.version'
```

### Metode 3: Docker

```bash
docker images | grep cast-operations
# Se efter tagget, f.eks. cast-operations/dashboard:7.0.123
```

## Registry-oplysninger

- **Registry-URL**: https://registry.terraform.io/providers/autonomy-cloud/operations
- **Kilderepository**: https://github.com/autonomy-cloud/operations
- **Dokumentation**: https://registry.terraform.io/providers/autonomy-cloud/operations/latest/docs
- **Udgivelser**: https://github.com/autonomy-cloud/operations

## Versionskompatibilitetsmatrix

| Cast Operations-version | Providerversion  | Terraform-konfiguration |
| ----------------- | ---------------- | ----------------------- |
| 7.0.x             | 7.0.x            | `version = "~> 7.0.0"`  |
| 7.1.x             | 7.1.x            | `version = "~> 7.1.0"`  |
| Seneste Sky       | Seneste Provider | `version = "~> 7.0"`    |

## Hurtig start-eksempel

```hcl
# Konfigurer provideren
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Juster til selvhostet
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://visca.ai"  # Juster til selvhostet
  api_key       = var.cast_operations_api_key
}

# Opret et projekt
resource "cast_operations_project" "example" {
  name        = "Terraform Example"
  description = "Oprettet med Terraform"
}

# Opret en website-monitor
resource "cast_operations_monitor" "website" {
  name       = "Website Monitor"
  project_id = cast_operations_project.example.id

  monitor_type = "website"
  url          = "https://example.com"
  interval     = "5m"

  tags = {
    managed_by = "terraform"
  }
}
```

## Installationstrin

1. **Opret din Terraform-konfiguration** med providerblokken
2. **Initialisér Terraform**: `terraform init`
3. **Indstil din API-nøgle**: Opret `terraform.tfvars` med din API-nøgle
4. **Planlæg dit deployment**: `terraform plan`
5. **Anvend din konfiguration**: `terraform apply`

## Få hjælp

- **Fuld dokumentation**: Se [den komplette Terraform-dokumentation](./README.md)
- **Selvhostet vejledning**: Se [den selvhostede konfigurationsvejledning](./self-hosted.md)
- **Eksempler**: Gennemse [konfigurationseksempler](./examples.md)
- **Hurtig start**: Følg [hurtig start-vejledningen](./quick-start.md)

## Registry-opdateringer

Provideren publiceres automatisk til Terraform Registry, når nye Cast Operations-versioner udgives. Skykunder kan bruge semantisk versionering (`~> 7.0`) til automatisk at få kompatible opdateringer, mens selvhostede brugere bør fastlåse til nøjagtige versioner.
