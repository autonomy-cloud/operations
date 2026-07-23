# Installasjons- og bruksguide for Terraform-leverandør

## Installasjon fra Terraform Registry

Cast Operations Terraform-leverandøren er tilgjengelig på det offisielle [Terraform Registry](https://registry.terraform.io/providers/autonomy-cloud/operations).

### For Cast Operations Cloud-brukere

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Bruk siste kompatible versjon
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  cast_operations_url = "https://latticeruntime.com"
  api_key       = var.cast_operations_api_key
}
```

### For selvhostede Cast Operations-brukere

**Kritisk**: Selvhostede kunder må feste leverandørversjonen til å samsvare nøyaktig med Cast Operations-installasjonen.

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Erstatt med din eksakte Cast Operations-versjon
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  cast_operations_url = "https://operations.yourcompany.com"  # Din selvhostede URL
  api_key       = var.cast_operations_api_key
}
```

## Hvorfor versjonsfesting for selvhostede?

Cast Operations Terraform-leverandøren genereres automatisk fra Cast Operations API-spesifikasjonen. Hver Cast Operations-versjon kan ha:

- Ulike API-endepunkter
- Oppdaterte ressursskjemaer
- Nye eller fjernede funksjoner
- Endrede valideringsregler

Bruk av en leverandørversjon som ikke samsvarer med Cast Operations-installasjonen kan resultere i:

- API-kompatibilitetsfeil
- Mislykkede ressursoppretting/-oppdateringer
- Uventet atferd
- Ressursstatusavvik

## Finne din Cast Operations-versjon

### Metode 1: Dashbord

1. Logg inn på Cast Operations-dashbordet ditt
2. Gå til **Settings** → **About**
3. Noter versjonsnummeret (f.eks. "7.0.123")

### Metode 2: API

```bash
curl https://your-operations-instance.com/api/version | jq '.version'
```

### Metode 3: Docker

```bash
docker images | grep cast-operations
# Se etter taggen, f.eks. cast-operations/dashboard:7.0.123
```

## Leverandørregistreringsinformasjon

- **Registry-URL**: https://registry.terraform.io/providers/autonomy-cloud/operations
- **Kilderepositorium**: https://github.com/autonomy-cloud/operations
- **Dokumentasjon**: https://registry.terraform.io/providers/autonomy-cloud/operations/latest/docs
- **Utgivelser**: https://github.com/autonomy-cloud/operations

## Versjonkompatibilitetsmatrise

| Cast Operations-versjon | Leverandørversjon | Terraform-konfigurasjon |
| ----------------- | ----------------- | ----------------------- |
| 7.0.x             | 7.0.x             | `version = "~> 7.0.0"`  |
| 7.1.x             | 7.1.x             | `version = "~> 7.1.0"`  |
| Siste sky         | Siste leverandør  | `version = "~> 7.0"`    |

## Hurtigstarteksempel

```hcl
# Konfigurer leverandøren
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Juster for selvhostet
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://latticeruntime.com"  # Juster for selvhostet
  api_key       = var.cast_operations_api_key
}

# Opprett et prosjekt
resource "cast_operations_project" "example" {
  name        = "Terraform-eksempel"
  description = "Opprettet med Terraform"
}

# Opprett en nettstedmonitor
resource "cast_operations_monitor" "website" {
  name       = "Nettstedmonitor"
  project_id = cast_operations_project.example.id

  monitor_type = "website"
  url          = "https://example.com"
  interval     = "5m"

  tags = {
    managed_by = "terraform"
  }
}
```

## Installasjonstrinn

1. **Opprett Terraform-konfigurasjonen** med leverandørblokken
2. **Initialiser Terraform**: `terraform init`
3. **Sett API-nøkkelen din**: Opprett `terraform.tfvars` med API-nøkkelen
4. **Planlegg distribusjonen**: `terraform plan`
5. **Bruk konfigurasjonen**: `terraform apply`

## Få hjelp

- **Fullstendig dokumentasjon**: Se [fullstendig Terraform-dokumentasjon](./README.md)
- **Selvhostet guide**: Sjekk [selvhostet konfigurasjonsguide](./self-hosted.md)
- **Eksempler**: Bla gjennom [konfigurasjonseksempler](./examples.md)
- **Hurtigstart**: Følg [hurtigstartguiden](./quick-start.md)

## Registry-oppdateringer

Leverandøren publiseres automatisk til Terraform Registry når nye Cast Operations-versjoner slippes. Sky-brukere kan bruke semantisk versjonering (`~> 7.0`) for automatisk å få kompatible oppdateringer, mens selvhostede brukere bør feste til eksakte versjoner.
