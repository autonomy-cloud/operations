# Cast Operations Terraform Provider

Met de Cast Operations Terraform Provider kunt u Cast Operations-resources beheren via Infrastructure as Code (IaC). Deze provider stelt u in staat monitoring-, incidentbeheer-, statuspagina- en andere Cast Operations-functies te configureren via Terraform.

## Inhoudsopgave

- [Installatie](#installatie)
- [Providerconfiguratie](#providerconfiguratie)
- [Snel starten](#snel-starten)
- [Versiecompatibiliteit](#versiecompatibiliteit)
- [Beschikbare resources](#beschikbare-resources)
- [Voorbeelden](#voorbeelden)
- [Best practices](#best-practices)
- [Migratiegids](#migratiegids)

## Installatie

### Vanuit het Terraform Registry (aanbevolen)

De Cast Operations Terraform-provider is beschikbaar in het [Terraform Registry](https://registry.terraform.io/providers/autonomy-cloud/operations).

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Gebruik de nieuwste 7.x-versie
    }
  }
  required_version = ">= 1.0"
}
```

### Versie vastzetten voor zelf-gehoste installaties

⚠️ **Belangrijk voor zelf-gehoste klanten**: Zet de Terraform-providerversie altijd vast zodat deze overeenkomt met uw Cast Operations-installatieversie om API-compatibiliteit te garanderen.

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Zet vast op exacte versie die overeenkomt met uw Cast Operations-installatie
    }
  }
  required_version = ">= 1.0"
}
```

#### Uw Cast Operations-versie vinden

U kunt uw Cast Operations-versie op verschillende manieren vinden:

1. **Dashboard**: Ga naar Instellingen → Over in uw Cast Operations-dashboard
2. **API**: Roep het eindpunt `GET /api/status` aan
3. **Docker**: Controleer de image-tag die u gebruikt
4. **Helm**: Controleer uw Helm-chartversie

```bash
# Voorbeeld: Als Cast Operations 7.0.123 wordt uitgevoerd
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"
    }
  }
}
```

## Providerconfiguratie

### Basisconfiguratie

```hcl
provider "cast-operations" {
  cast_operations_url = "https://your-operations-instance.com"  # Of https://latticeruntime.com voor cloud
  api_key       = var.cast_operations_api_key
}
```

### Omgevingsvariabelen

U kunt de provider configureren met omgevingsvariabelen:

```bash
export CAST_OPERATIONS_URL="https://your-operations-instance.com"
export CAST_OPERATIONS_API_KEY="your-api-key-here"
```

Gebruik de provider vervolgens zonder expliciete configuratie:

```hcl
provider "cast-operations" {
  # Configuratie wordt gelezen uit omgevingsvariabelen
}
```

### Configuratie-opties

| Argument        | Omgevingsvariabele  | Beschrijving          | Vereist |
| --------------- | ------------------- | --------------------- | ------- |
| `cast_operations_url` | `CAST_OPERATIONS_URL`     | Cast Operations-URL         | Ja      |
| `api_key`       | `CAST_OPERATIONS_API_KEY` | Cast Operations API-sleutel | Ja      |

## Snel starten

### 1. API-sleutel aanmaken

Maak eerst een API-sleutel aan in uw Cast Operations-dashboard:

1. Ga naar **Instellingen** → **API-sleutels**
2. Klik op **API-sleutel aanmaken**
3. Geef het een beschrijvende naam (bijv. "Terraform-automatisering")
4. Selecteer de juiste machtigingen
5. Kopieer de gegenereerde API-sleutel

### 2. Basisconfiguratie voor Terraform

Maak een `main.tf`-bestand aan:

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
  cast_operations_url = "https://latticeruntime.com"  # Gebruik de URL van uw instantie
  api_key       = var.cast_operations_api_key
}

# Opmerking: Projecten moeten handmatig worden aangemaakt in het Cast Operations-dashboard
variable "project_id" {
  description = "Cast Operations project-ID"
  type        = string
}

# Een monitor aanmaken
resource "cast_operations_monitor" "website" {
  name        = "Website Monitor"
  description = "Monitor voor website-uptime"
  data        = jsonencode({
    url = "https://example.com"
    interval = "5m"
    timeout = "30s"
  })
}

# Een team aanmaken
resource "cast_operations_team" "platform" {
  name        = "Platform Team"
  description = "Platform engineering team"
}
    value = "alerts@example.com"
  }
}
```

### 3. Initialiseren en toepassen

```bash
# Terraform initialiseren
terraform init

# De wijzigingen plannen
terraform plan

# De configuratie toepassen
terraform apply
```

## Versiecompatibiliteit

### Cloudklanten

Gebruik voor Cast Operations Cloud-klanten de nieuwste providerversie:

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Gebruik altijd de nieuwste compatibele versie
    }
  }
}
```

### Zelf-gehoste klanten

**Kritiek**: Zelf-gehoste klanten moeten de providerversie vastzetten zodat deze overeenkomt met hun Cast Operations-installatie:

| Cast Operations-versie | Providerversie | Configuratie           |
| ---------------- | -------------- | ---------------------- |
| 7.0.x            | 7.0.x          | `version = "~> 7.0.0"` |
| 7.1.x            | 7.1.x          | `version = "~> 7.1.0"` |
| 7.2.x            | 7.2.x          | `version = "~> 7.2.0"` |

Voorbeeld voor Cast Operations 7.0.123:

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Exacte versieovereenkomst
    }
  }
}
```

## Beschikbare resources

De Cast Operations Terraform-provider ondersteunt de volgende resources:

### Kernresources

- `cast_operations_team` - Teams beheren

### Monitoring

- `cast_operations_monitor` - Monitors aanmaken en beheren
- `cast_operations_probe` - Monitoringprobes beheren

### Piketbeheer

- `cast_operations_on_call_duty_policy` - Piketschema's instellen

### Statuspagina's

- `cast_operations_status_page` - Statuspagina's aanmaken

### Servicecatalogus

- `cast_operations_service_catalog` - Servicecatalogusitems beheren

### Diensten

- `cast_operations_service` - Diensten definiëren
- `cast_operations_service_dependency` - Dienstafhankelijkheden in kaart brengen

### Gegevensbronnen

Opmerking: Gegevensbronnen zijn momenteel niet beschikbaar in de provider.

## Voorbeelden

### Volledige monitoringconfiguratie

```hcl
# Variabelen
variable "cast_operations_api_key" {
  description = "Cast Operations API-sleutel"
  type        = string
  sensitive   = true
}

variable "project_id" {
  description = "Cast Operations project-ID (maak het project handmatig aan in het dashboard)"
  type        = string
}

variable "cast_operations_url" {
  description = "Cast Operations-URL"
  type        = string
  default     = "https://latticeruntime.com"
}

# Providerconfiguratie
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
  description = "Platform engineering team"
}

# Monitors
resource "cast_operations_monitor" "api" {
  name        = "API Health Check"
  description = "Monitor voor het health-eindpunt van de API"
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

# Piketbeleid
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

# Waarschuwingsbeleid
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

# Statuspagina
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

### Voorbeeld van zelf-gehoste configuratie

```hcl
# Voor zelf-gehoste Cast Operations-instantie versie 7.0.123
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Moet exact overeenkomen met uw Cast Operations-versie
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  cast_operations_url = "https://operations.mycompany.com"  # Uw zelf-gehoste URL
  api_key       = var.cast_operations_api_key
}

# Rest van uw configuratie...
```

## Best practices

### 1. Versiebeheer

**Voor cloudklanten:**

- Gebruik semantisch versiebeheer met `~>` om compatibele updates te ontvangen
- Bekijk het wijzigingenlogboek voor grote versie-upgrades

**Voor zelf-gehoste klanten:**

- Zet altijd vast op de exacte versie die overeenkomt met uw installatie
- Werk de providerversie bij wanneer u Cast Operations upgradet
- Test eerst in een niet-productieomgeving

### 2. Statusbeheer

```hcl
terraform {
  backend "s3" {
    bucket = "my-terraform-state"
    key    = "cast-operations/terraform.tfstate"
    region = "us-west-2"
  }
}
```

### 3. Omgevingsscheiding

Gebruik werkruimten of afzonderlijke statusbestanden voor verschillende omgevingen:

```bash
# Met werkruimten
terraform workspace new production
terraform workspace new staging

# Met afzonderlijke mappen
mkdir -p environments/{staging,production}
```

### 4. Variabelenbeheer

```hcl
# variables.tf
variable "environment" {
  description = "Omgevingsnaam"
  type        = string
}

variable "monitors" {
  description = "Lijst van aan te maken monitors"
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

### 5. Resource-naamgeving

Gebruik consistente naamgevingsconventies:

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

## Migratiegids

### Vanuit handmatige configuratie

1. **Bestaande resources controleren** in het Cast Operations-dashboard
2. **Terraform-configuratie aanmaken** voor bestaande resources
3. **Bestaande resources importeren** in de Terraform-status
4. **Configuratie valideren** ten opzichte van de huidige status
5. **Wijzigingen incrementeel toepassen**

Voorbeeld van importeren:

```bash
# Bestaande monitor importeren
terraform import cast_operations_monitor.website monitor-id-here

# Bestaand project importeren
terraform import cast_operations_project.main project-id-here
```

### Versie-upgrades

Bij het upgraden van Cast Operations (zelf-gehost):

1. **Maak een back-up van de huidige status**
2. **Controleer providercompatibiliteit**
3. **Werk de providerversie bij** in de configuratie
4. **Test in een stagingomgeving**
5. **Toepassen op productie**

```bash
# Back-up van status
terraform state pull > backup.tfstate

# Providerversie bijwerken
# Bewerk het terraform-blok in uw configuratie

# Plannen en toepassen
terraform init -upgrade
terraform plan
terraform apply
```

## Ondersteuning en resources

- **Documentatie**: [Cast Operations Docs](https://docs.latticeruntime.com)
- **Terraform Registry**: [Cast Operations Provider](https://registry.terraform.io/providers/autonomy-cloud/operations)
- **GitHub Issues**: [Cast Operations GitHub](https://github.com/autonomy-cloud/operations/issues)
- **Community**: [Cast Operations Community](https://community.latticeruntime.com)

## Probleemoplossing

### Veelgebruikte problemen

1. **Versie-mismatch (zelf-gehost)**

   ```
   Error: API version incompatible
   ```

   **Oplossing**: Zorg dat de providerversie overeenkomt met de Cast Operations-installatie

2. **Authenticatieproblemen**

   ```
   Error: Invalid API key
   ```

   **Oplossing**: Verifieer de API-sleutel en machtigingen

3. **Resource niet gevonden**
   ```
   Error: Resource not found
   ```
   **Oplossing**: Controleer resource-ID's en zorg dat de resource bestaat

### Foutopsporingsmodus

Schakel gedetailleerde logboekregistratie in:

```bash
export TF_LOG=DEBUG
terraform apply
```

### Versiecontrole

Verifieer uw instelling:

```bash
# Terraform-versie controleren
terraform version

# Providerversie controleren
terraform providers

# Configuratie valideren
terraform validate
```
