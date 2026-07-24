# Cast Operations Terraform Provider

Cast Operations Terraform Provider giver dig mulighed for at administrere Cast Operations-ressourcer ved hjælp af Infrastructure as Code (IaC). Denne provider giver dig mulighed for at konfigurere overvågning, incident management, statussider og andre Cast Operations-funktioner via Terraform.

## Indholdsfortegnelse

- [Installation](#installation)
- [Providerkonfiguration](#providerkonfiguration)
- [Hurtig start](#hurtig-start)
- [Versionskompatibilitet](#versionskompatibilitet)
- [Tilgængelige ressourcer](#tilgængelige-ressourcer)
- [Eksempler](#eksempler)
- [Bedste praksis](#bedste-praksis)
- [Migrationsvejledning](#migrationsvejledning)

## Installation

### Fra Terraform Registry (anbefalet)

Cast Operations Terraform-provideren er tilgængeligt på [Terraform Registry](https://registry.terraform.io/providers/autonomy-cloud/operations).

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Brug nyeste 7.x-version
    }
  }
  required_version = ">= 1.0"
}
```

### Versionsfastlåsning til selvhostede installationer

⚠️ **Vigtigt for selvhostede kunder**: Fastlås altid Terraform-providerversionen til at matche din Cast Operations-installationsversion for at sikre API-kompatibilitet.

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Fastlås til nøjagtig version, der matcher din Cast Operations-installation
    }
  }
  required_version = ">= 1.0"
}
```

#### Find din Cast Operations-version

Du kan finde din Cast Operations-version på flere måder:

1. **Dashboard**: Gå til Indstillinger → Om i dit Cast Operations-dashboard
2. **API**: Kald `GET /api/status`-endpointet
3. **Docker**: Kontroller det billedtag, du bruger
4. **Helm**: Kontroller din Helm-chartversion

```bash
# Eksempel: Hvis du kører Cast Operations 7.0.123
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"
    }
  }
}
```

## Providerkonfiguration

### Grundlæggende konfiguration

```hcl
provider "cast-operations" {
  cast_operations_url = "https://your-operations-instance.com"  # Eller https://latticeruntime.com til sky
  api_key       = var.cast_operations_api_key
}
```

### Miljøvariabler

Du kan konfigurere provideren ved hjælp af miljøvariabler:

```bash
export CAST_OPERATIONS_URL="https://your-operations-instance.com"
export CAST_OPERATIONS_API_KEY="your-api-key-here"
```

Brug derefter provideren uden eksplicit konfiguration:

```hcl
provider "cast-operations" {
  # Konfiguration læses fra miljøvariabler
}
```

### Konfigurationsmuligheder

| Argument        | Miljøvariabel       | Beskrivelse         | Påkrævet |
| --------------- | ------------------- | ------------------- | -------- |
| `cast_operations_url` | `CAST_OPERATIONS_URL`     | Cast Operations-URL       | Ja       |
| `api_key`       | `CAST_OPERATIONS_API_KEY` | Cast Operations API-nøgle | Ja       |

## Hurtig start

### 1. Opret API-nøgle

Opret først en API-nøgle i dit Cast Operations-dashboard:

1. Gå til **Indstillinger** → **API-nøgler**
2. Klik på **Opret API-nøgle**
3. Giv den et beskrivende navn (f.eks. "Terraform Automatisering")
4. Vælg passende tilladelser
5. Kopiér den genererede API-nøgle

### 2. Grundlæggende Terraform-konfiguration

Opret en `main.tf`-fil:

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://latticeruntime.com"  # Brug din instans-URL
  api_key       = var.cast_operations_api_key
}

# Bemærk: Projekter skal oprettes manuelt i Cast Operations-dashboardet
variable "project_id" {
  description = "Cast Operations projekt-ID"
  type        = string
}

# Opret en monitor
resource "cast_operations_monitor" "website" {
  name        = "Website Monitor"
  description = "Monitor til webstedets oppetid"
  data        = jsonencode({
    url = "https://example.com"
    interval = "5m"
    timeout = "30s"
  })
}

# Opret et team
resource "cast_operations_team" "platform" {
  name        = "Platform Team"
  description = "Platform ingeniørteam"
}
    value = "alerts@example.com"
  }
}
```

### 3. Initialisér og anvend

```bash
# Initialisér Terraform
terraform init

# Planlæg ændringerne
terraform plan

# Anvend konfigurationen
terraform apply
```

## Versionskompatibilitet

### Skykunder

Til Cast Operations Cloud-kunder skal du bruge den seneste providerversion:

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Brug altid seneste kompatible version
    }
  }
}
```

### Selvhostede kunder

**Kritisk**: Selvhostede kunder skal fastlåse providerversionen til at matche deres Cast Operations-installation nøjagtigt:

| Cast Operations-version | Providerversion | Konfiguration          |
| ----------------- | --------------- | ---------------------- |
| 7.0.x             | 7.0.x           | `version = "~> 7.0.0"` |
| 7.1.x             | 7.1.x           | `version = "~> 7.1.0"` |
| 7.2.x             | 7.2.x           | `version = "~> 7.2.0"` |

Eksempel til Cast Operations 7.0.123:

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Nøjagtig versionsmatch
    }
  }
}
```

## Tilgængelige ressourcer

Cast Operations Terraform-provideren understøtter følgende ressourcer:

### Kerneressourcer

- `cast_operations_team` – Administrer teams

### Overvågning

- `cast_operations_monitor` – Opret og administrer monitorer
- `cast_operations_probe` – Administrer overvågningsprober

### Vagtadministration

- `cast_operations_on_call_duty_policy` – Opsæt vagtplaner

### Statussider

- `cast_operations_status_page` – Opret statussider

### Tjenestekatalog

- `cast_operations_service_catalog` – Administrer tjenestekatalogposter

### Tjenestekatalog

- `cast_operations_service` – Definer tjenester
- `cast_operations_service_dependency` – Kortlæg tjenesteafhængigheder

### Datakilder

Bemærk: Datakilder er ikke i øjeblikket tilgængelige i provideren, da ingen datakilder er defineret i providerskemaet.

## Eksempler

### Komplet overvågningsopsætning

```hcl
# Variabler
variable "cast_operations_api_key" {
  description = "Cast Operations API-nøgle"
  type        = string
  sensitive   = true
}

variable "project_id" {
  description = "Cast Operations projekt-ID (opret projekt manuelt i dashboardet)"
  type        = string
}

variable "cast_operations_url" {
  description = "Cast Operations-URL"
  type        = string
  default     = "https://latticeruntime.com"
}

# Providerkonfiguration
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"
    }
  }
}

provider "cast-operations" {
  cast_operations_url = var.cast_operations_url
  api_key       = var.cast_operations_api_key
}

# Team
resource "cast_operations_team" "platform" {
  name        = "Platform Team"
  description = "Platform ingeniørteam"
}

# Monitorer
resource "cast_operations_monitor" "api" {
  name        = "API Health Check"
  description = "Monitor til API-sundhedsendpoint"
  data        = jsonencode({
    url = "https://api.mycompany.com/health"
    method = "GET"
    interval = "1m"
    timeout = "30s"
  })
  }
}

resource "cast_operations_monitor" "database" {
  name       = "Database Connection"
  project_id = cast_operations_project.production.id

  monitor_type = "port"
  hostname     = "db.mycompany.com"
  port         = 5432
  interval     = "2m"

  tags = {
    service     = "database"
    environment = "production"
    criticality = "critical"
  }
}

# Vagtpolitik
resource "cast_operations_on_call_policy" "platform_oncall" {
  name       = "Platform On-Call"
  project_id = cast_operations_project.production.id
  team_id    = cast_operations_team.platform.id

  schedules {
    name      = "Business Hours"
    timezone  = "America/New_York"

    layers {
      name = "Primary"
      users = ["user1@mycompany.com", "user2@mycompany.com"]
      rotation_type = "weekly"
      start_time = "09:00"
      end_time = "17:00"
      days = ["monday", "tuesday", "wednesday", "thursday", "friday"]
    }
  }
}

# Advarsels-politik
resource "cast_operations_alert_policy" "critical_alerts" {
  name       = "Critical System Alerts"
  project_id = cast_operations_project.production.id

  conditions {
    monitor_id = cast_operations_monitor.api.id
    threshold  = "down"
  }

  conditions {
    monitor_id = cast_operations_monitor.database.id
    threshold  = "down"
  }

  actions {
    type = "webhook"
    url  = "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
  }

  actions {
    type           = "oncall_escalation"
    oncall_policy_id = cast_operations_on_call_policy.platform_oncall.id
  }
}

# Statusside
resource "cast_operations_status_page" "public" {
  name       = "MyCompany Status"
  project_id = cast_operations_project.production.id

  domain = "status.mycompany.com"

  components {
    name       = "API"
    monitor_id = cast_operations_monitor.api.id
  }

  components {
    name       = "Database"
    monitor_id = cast_operations_monitor.database.id
  }
}
```

### Eksempel på selvhostet konfiguration

```hcl
# Til selvhostet Cast Operations-instans version 7.0.123
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Skal matche din Cast Operations-version nøjagtigt
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  cast_operations_url = "https://operations.mycompany.com"  # Din selvhostede URL
  api_key       = var.cast_operations_api_key
}

# Resten af din konfiguration...
```

## Bedste praksis

### 1. Versionsstyring

**Til skykunder:**

- Brug semantisk versionering med `~>` for at få kompatible opdateringer
- Gennemgå changelog inden større versionopgraderinger

**Til selvhostede kunder:**

- Fastlås altid til nøjagtig version, der matcher din installation
- Opdater providerversionen, når du opgraderer Cast Operations
- Test i ikke-produktionsmiljø først

### 2. Tilstandsstyring

```hcl
terraform {
  backend "s3" {
    bucket = "my-terraform-state"
    key    = "cast-operations/terraform.tfstate"
    region = "us-west-2"
  }
}
```

### 3. Miljøadskillelse

Brug arbejdsområder eller separate tilstandsfiler til forskellige miljøer:

```bash
# Brug af arbejdsområder
terraform workspace new production
terraform workspace new staging

# Brug af separate mapper
mkdir -p environments/{staging,production}
```

### 4. Variabelstyring

```hcl
# variables.tf
variable "environment" {
  description = "Miljønavn"
  type        = string
}

variable "monitors" {
  description = "Liste over monitorer der skal oprettes"
  type = list(object({
    name = string
    url  = string
    type = string
  }))
}

# terraform.tfvars
environment = "production"
monitors = [
  {
    name = "Website"
    url  = "https://example.com"
    type = "website"
  },
  {
    name = "API"
    url  = "https://api.example.com/health"
    type = "api"
  }
]
```

### 5. Ressourcenavngivning

Brug konsekvente navnekonventioner:

```hcl
resource "cast_operations_monitor" "website_production" {
  name = "${var.environment}-website-monitor"
  # ...
}

resource "cast_operations_alert_policy" "critical_production" {
  name = "${var.environment}-critical-alerts"
  # ...
}
```

## Migrationsvejledning

### Fra manuel konfiguration

1. **Gennemgå eksisterende ressourcer** i Cast Operations-dashboardet
2. **Opret Terraform-konfiguration** til eksisterende ressourcer
3. **Importér eksisterende ressourcer** til Terraform-tilstand
4. **Valider konfiguration** matcher aktuel tilstand
5. **Anvend ændringer** trinvist

Eksempel på import:

```bash
# Importér eksisterende monitor
terraform import cast_operations_monitor.website monitor-id-here

# Importér eksisterende projekt
terraform import cast_operations_project.main project-id-here
```

### Versionsopgraderinger

Når du opgraderer Cast Operations (selvhostet):

1. **Sikkerhedskopier din aktuelle tilstand**
2. **Kontroller providerkompatibilitet**
3. **Opdater providerversion** i konfigurationen
4. **Test i staging-miljø**
5. **Anvend i produktion**

```bash
# Sikkerhedskopier tilstand
terraform state pull > backup.tfstate

# Opdater providerversion
# Rediger terraform-blokken i din konfiguration

# Planlæg og anvend
terraform init -upgrade
terraform plan
terraform apply
```

## Support og ressourcer

- **Dokumentation**: [Cast Operations Docs](https://docs.latticeruntime.com)
- **Terraform Registry**: [Cast Operations Provider](https://registry.terraform.io/providers/autonomy-cloud/operations)
- **GitHub Issues**: [Cast Operations GitHub](https://github.com/autonomy-cloud/operations/issues)
- **Fællesskab**: [Cast Operations Community](https://community.latticeruntime.com)

## Fejlfinding

### Almindelige problemer

1. **Versionsmismatch (selvhostet)**

   ```
   Error: API version incompatible
   ```

   **Løsning**: Sørg for, at providerversionen matcher Cast Operations-installationen

2. **Autentificeringsproblemer**

   ```
   Error: Invalid API key
   ```

   **Løsning**: Bekræft API-nøgle og tilladelser

3. **Ressource ikke fundet**
   ```
   Error: Resource not found
   ```
   **Løsning**: Kontroller ressource-ID'er og sørg for, at ressourcen eksisterer

### Fejlsøgningstilstand

Aktiver detaljeret logning:

```bash
export TF_LOG=DEBUG
terraform apply
```

### Versionstjek

Bekræft din opsætning:

```bash
# Kontroller Terraform-version
terraform version

# Kontroller providerversion
terraform providers

# Valider konfiguration
terraform validate
```
