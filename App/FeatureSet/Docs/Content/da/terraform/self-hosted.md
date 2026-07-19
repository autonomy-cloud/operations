# Selvhostet Cast Operations Terraform-konfigurationsvejledning

Denne vejledning er specifikt til kunder, der kører selvhostede Cast Operations-instanser. Den dækker versionsstyring, konfiguration og bedste praksis for brug af Terraform-provideren med din egen Cast Operations-deployment.

## Vigtige noter

⚠️ **Projekter kan ikke oprettes via Terraform** – Projekter skal oprettes manuelt i Cast Operations-dashboardet først. Brug projekt-ID'et i dine Terraform-konfigurationer.

⚠️ **Den vigtigste regel for selvhostede kunder**: Fastlås altid din Terraform-providerversion til nøjagtigt at matche din Cast Operations-installationsversion.

## Ressourcestruktur

Alle Cast Operations Terraform-ressourcer følger en forenklet struktur:

- `name` (påkrævet) – Ressourcenavn
- `description` (valgfrit) – Ressourcebeskrivelse
- `data` (valgfrit) – Kompleks konfiguration som JSON

## Kritisk: Versionskompatibilitet

⚠️ **Den vigtigste regel for selvhostede kunder**: Fastlås altid din Terraform-providerversion til nøjagtigt at matche din Cast Operations-installationsversion.

### Hvorfor versionsfastlåsning er kritisk

- Terraform-provideren genereres automatisk fra Cast Operations API
- Hver Cast Operations-version kan have forskellige API-endpoints og skemaer
- Brug af en uoverensstemmende providerversion kan forårsage fejl eller uventet adfærd
- Versionsfastlåsning sikrer kompatibilitet og forudsigelig adfærd

## Find din Cast Operations-version

### Metode 1: Dashboard

1. Log ind på dit Cast Operations-dashboard
2. Gå til **Indstillinger** → **Om**
3. Se efter versionsnummeret (f.eks. "7.0.123")

### Metode 2: API-endpoint

```bash
curl https://your-operations-instance.com/api/status
```

### Metode 3: Docker-billeder

Hvis du kører Cast Operations med Docker:

```bash
docker images | grep cast-operations
# Se efter tagget, f.eks. cast-operations/dashboard:7.0.123
```

### Metode 4: Helm-chart

Hvis du bruger Helm:

```bash
helm list -n cast-operations
# Kontroller chartversionen
```

### Metode 5: Miljøvariabler

Kontroller dine konfigurationsfiler for versionsvariabler:

```bash
grep -r "APP_VERSION\|IMAGE_TAG" /path/to/your/cast-operations/config
```

## Providerkonfigurationsskabeloner

### Skabelon til version 7.0.x

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Erstat 123 med dit nøjagtige build-nummer
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  cast_operations_url = "https://operations.yourcompany.com"  # Din selvhostede URL
  api_key       = var.cast_operations_api_key
}
```

### Skabelon til version 7.1.x

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.1.45"  # Erstat med din nøjagtige version
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  cast_operations_url = "https://operations.yourcompany.com"
  api_key       = var.cast_operations_api_key
}
```

## Komplet selvhostet konfigurationseksempel

Her er et komplet eksempel til en selvhostet Cast Operations-instans:

```hcl
# versions.tf
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Skal matche din Cast Operations-version
    }
  }
  required_version = ">= 1.0"

  # Valgfrit: Brug fjernlager til teamsamarbejde
  backend "s3" {
    bucket = "your-terraform-state-bucket"
    key    = "cast-operations/terraform.tfstate"
    region = "us-west-2"
  }
}

# variables.tf
variable "cast_operations_url" {
  description = "Cast Operations-instans-URL"
  type        = string
  default     = "https://operations.yourcompany.com"
}

variable "cast_operations_api_key" {
  description = "Cast Operations API-nøgle"
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "Miljønavn"
  type        = string
  default     = "production"
}

# providers.tf
provider "cast-operations" {
  cast_operations_url = var.cast_operations_url
  api_key       = var.cast_operations_api_key
}

# variables.tf
variable "project_id" {
  description = "Cast Operations projekt-ID (opret manuelt i dashboardet)"
  type        = string
}

# main.tf
# Opret teams
resource "cast_operations_team" "infrastructure" {
  name        = "Infrastructure Team"
  description = "Infrastruktur- og driftsteam"
}

resource "cast_operations_team" "development" {
  name        = "Development Team"
  description = "Applikationsudviklingsteam"
  project_id = cast_operations_project.main.id
}

# Infrastrukturmonitorer
resource "cast_operations_monitor" "database" {
  name       = "${var.environment}-database"
  project_id = cast_operations_project.main.id

  monitor_type = "port"
  hostname     = "db.internal.yourcompany.com"
  port         = 5432
  interval     = "2m"
  timeout      = "10s"

  tags = {
    team        = "infrastructure"
    service     = "database"
    environment = var.environment
    criticality = "critical"
  }
}

resource "cast_operations_monitor" "application" {
  name       = "${var.environment}-application"
  project_id = cast_operations_project.main.id

  monitor_type = "website"
  url          = "https://app.yourcompany.com/health"
  interval     = "1m"
  timeout      = "30s"

  expected_status_codes = [200]

  tags = {
    team        = "development"
    service     = "application"
    environment = var.environment
    criticality = "high"
  }
}

# Vagtpolitikker
resource "cast_operations_on_call_policy" "infrastructure_oncall" {
  name       = "Infrastructure On-Call"
  project_id = cast_operations_project.main.id
  team_id    = cast_operations_team.infrastructure.id

  schedules {
    name     = "24x7 Infrastructure"
    timezone = "America/New_York"

    layers {
      name          = "Primary"
      users         = ["infra1@yourcompany.com", "infra2@yourcompany.com"]
      rotation_type = "weekly"
      start_time    = "00:00"
      end_time      = "23:59"
      days          = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    }
  }
}

# Advarsels-politikker
resource "cast_operations_alert_policy" "critical_infrastructure" {
  name       = "Critical Infrastructure Alerts"
  project_id = cast_operations_project.main.id

  conditions {
    monitor_id = cast_operations_monitor.database.id
    threshold  = "down"
  }

  actions {
    type = "email"
    recipients = ["infrastructure@yourcompany.com"]
  }

  actions {
    type             = "oncall_escalation"
    oncall_policy_id = cast_operations_on_call_policy.infrastructure_oncall.id
  }
}

# Intern statusside
resource "cast_operations_status_page" "internal" {
  name       = "Internal Services Status"
  project_id = cast_operations_project.main.id

  domain = "status.internal.yourcompany.com"

  components {
    name       = "Database"
    monitor_id = cast_operations_monitor.database.id
  }

  components {
    name       = "Application"
    monitor_id = cast_operations_monitor.application.id
  }
}

# outputs.tf
output "project_id" {
  description = "Projekt-ID"
  value       = cast_operations_project.main.id
}

output "status_page_url" {
  description = "Statusside-URL"
  value       = "https://${cast_operations_status_page.internal.domain}"
}
```

## Miljøspecifik konfiguration

### Udviklingsmiljø

```hcl
# dev.tfvars
cast_operations_url = "https://operations-dev.yourcompany.com"
environment = "development"
```

### Staging-miljø

```hcl
# staging.tfvars
cast_operations_url = "https://operations-staging.yourcompany.com"
environment = "staging"
```

### Produktionsmiljø

```hcl
# prod.tfvars
cast_operations_url = "https://operations.yourcompany.com"
environment = "production"
```

## Opgraderingsproces til selvhostet

Når du opgraderer din Cast Operations-instans:

### 1. Tjekliste før opgradering

```bash
# Sikkerhedskopier nuværende Terraform-tilstand
terraform state pull > backup-$(date +%Y%m%d).tfstate

# Notér aktuel Cast Operations-version
curl https://operations.yourcompany.com/api/status | jq '.version'

# Notér aktuel providerversion
terraform providers | grep cast-operations
```

### 2. Opgrader Cast Operations-instansen

Følg din standardopgraderingsproces til Cast Operations (Docker, Helm osv.)

### 3. Opdater Terraform-provideren

```hcl
# Opdater version i terraform-blokken
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.124"  # Ny version efter opgradering
    }
  }
}
```

### 4. Test og anvend

```bash
# Opdater provideren
terraform init -upgrade

# Planlæg for at se eventuelle ændringer
terraform plan

# Anvend, hvis alt ser godt ud
terraform apply
```

## Netværkskonfiguration

### Firewallregler

Sørg for, at din Terraform-runner kan tilgå:

- Cast Operations API-endpoint (normalt port 443/HTTPS)
- Eventuelle interne ressourcer der overvåges

### VPN/Private netværk

Hvis Cast Operations er på et privat netværk:

```hcl
provider "cast-operations" {
  cast_operations_url = "https://10.0.1.100:443"  # Intern IP
  api_key       = var.cast_operations_api_key
}
```

## Bedste sikkerhedspraksis

### 1. API-nøglestyring

```bash
# Brug miljøvariabler
export CAST_OPERATIONS_API_KEY="your-api-key"

# Eller brug et hemmeligheds-styringssystem
export CAST_OPERATIONS_API_KEY=$(vault kv get -field=api_key secret/cast-operations)
```

### 2. API-nøgler med mindste privilegium

Opret API-nøgler med minimale påkrævede tilladelser:

- Monitoradministration
- Advarsels-politikadministration
- Teamadministration (hvis nødvendigt)

### 3. Netværkssikkerhed

```hcl
# Eksempel med TLS-verifikation
provider "cast-operations" {
  cast_operations_url = "https://operations.yourcompany.com"
  api_key       = var.cast_operations_api_key

  # Yderligere sikkerhedsmuligheder, hvis understøttet
  verify_ssl = true
  timeout    = "30s"
}
```

## Overvågning af din Terraform-automatisering

Opret monitorer til din Terraform-automatisering:

```hcl
resource "cast_operations_monitor" "terraform_runner" {
  name       = "Terraform Runner Health"
  project_id = cast_operations_project.main.id

  monitor_type = "heartbeat"
  interval     = "15m"

  tags = {
    automation = "terraform"
    criticality = "medium"
  }
}
```

## Fejlfinding af selvhostede problemer

### Problem: Forbindelsen nægtet

```
Error: connection refused
```

**Løsninger**:

1. Kontroller, at Cast Operations-instansen kører
2. Bekræft, at API-URL'en er korrekt
3. Kontroller firewall-/netværksforbindelsen
4. Bekræft, at TLS-certifikater er gyldige

### Problem: API-versionsmismatch

```
Error: API version incompatible
```

**Løsninger**:

1. Kontroller Cast Operations-version: `curl https://your-instance/api/status`
2. Opdater providerversion til at matche
3. Kør `terraform init -upgrade`

### Problem: Selvsignerede certifikater

Hvis du bruger selvsignerede certifikater:

```bash
# Spring TLS-verifikation over midlertidigt (ikke anbefalet til produktion)
export CAST_OPERATIONS_SKIP_TLS_VERIFY=true
```

Bedre løsning: Tilføj dit CA-certifikat til systemets tillidslagring.

## Sikkerhedskopiering og gendannelse

### Tilstandssikkerhedskopiering

```bash
# Regelmæssige tilstandssikkerhedskopier
terraform state pull > backup-$(date +%Y%m%d-%H%M%S).tfstate

# Automatiseret sikkerhedskopieringsscript
#!/bin/bash
DATE=$(date +%Y%m%d-%H%M%S)
terraform state pull > "backups/terraform-state-${DATE}.tfstate"
find backups/ -name "terraform-state-*.tfstate" -mtime +30 -delete
```

### Konfigurationssikkerhedskopiering

```bash
# Sikkerhedskopier Terraform-konfiguration
tar -czf terraform-config-$(date +%Y%m%d).tar.gz *.tf *.tfvars
```

## Multi-miljøadministration

### Brug af arbejdsområder

```bash
# Opret miljøer
terraform workspace new dev
terraform workspace new staging
terraform workspace new prod

# Skift mellem miljøer
terraform workspace select prod
terraform apply -var-file="prod.tfvars"
```

### Brug af separate mapper

```
terraform/
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   └── terraform.tfvars
│   ├── staging/
│   │   ├── main.tf
│   │   └── terraform.tfvars
│   └── prod/
│       ├── main.tf
│       └── terraform.tfvars
└── modules/
    └── cast-operations/
        ├── main.tf
        ├── variables.tf
        └── outputs.tf
```

Denne tilgang giver bedre isolation og nemmere versionsstyring pr. miljø.
