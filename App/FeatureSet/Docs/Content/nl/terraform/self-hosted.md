# Zelf-gehoste Cast Operations Terraform-configuratiegids

Deze gids is specifiek bedoeld voor klanten die zelf-gehoste Cast Operations-instanties uitvoeren. Het behandelt versiebeheer, configuratie en best practices voor het gebruik van de Terraform-provider met uw eigen Cast Operations-implementatie.

## Belangrijke opmerkingen

⚠️ **Projecten kunnen niet via Terraform worden aangemaakt** — Projecten moeten eerst handmatig worden aangemaakt in het Cast Operations-dashboard. Gebruik het project-ID in uw Terraform-configuraties.

⚠️ **De belangrijkste regel voor zelf-gehoste klanten**: Zet uw Terraform-providerversie altijd vast zodat deze exact overeenkomt met uw Cast Operations-installatieversie.

## Resourcestructuur

Alle Cast Operations Terraform-resources volgen een vereenvoudigde structuur:

- `name` (vereist) - Resourcenaam
- `description` (optioneel) - Resourcebeschrijving
- `data` (optioneel) - Complexe configuratie als JSON

## Kritiek: Versiecompatibiliteit

⚠️ **De belangrijkste regel voor zelf-gehoste klanten**: Zet uw Terraform-providerversie altijd vast zodat deze exact overeenkomt met uw Cast Operations-installatieversie.

### Waarom versie vastzetten kritiek is

- De Terraform-provider wordt automatisch gegenereerd vanuit de Cast Operations API
- Elke Cast Operations-versie kan verschillende API-eindpunten en schema's hebben
- Het gebruik van een niet-overeenkomende providerversie kan fouten of onverwacht gedrag veroorzaken
- Versie vastzetten garandeert compatibiliteit en voorspelbaar gedrag

## Uw Cast Operations-versie vinden

### Methode 1: Dashboard

1. Log in op uw Cast Operations-dashboard
2. Ga naar **Instellingen** → **Over**
3. Zoek het versienummer (bijv. "7.0.123")

### Methode 2: API-eindpunt

```bash
curl https://your-operations-instance.com/api/status
```

### Methode 3: Docker-images

Als u Cast Operations met Docker uitvoert:

```bash
docker images | grep cast-operations
# Zoek naar de tag, bijv. cast-operations/dashboard:7.0.123
```

### Methode 4: Helm-chart

Als u Helm gebruikt:

```bash
helm list -n cast-operations
# Controleer de chartversie
```

### Methode 5: Omgevingsvariabelen

Controleer uw configuratiebestanden op versievariabelen:

```bash
grep -r "APP_VERSION\|IMAGE_TAG" /path/to/your/cast-operations/config
```

## Providerconfiguratie-sjablonen

### Sjabloon voor versie 7.0.x

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Vervang 123 door uw exacte buildnummer
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  cast_operations_url = "https://operations.yourcompany.com"  # Uw zelf-gehoste URL
  api_key       = var.cast_operations_api_key
}
```

### Sjabloon voor versie 7.1.x

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.1.45"  # Vervang door uw exacte versie
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  cast_operations_url = "https://operations.yourcompany.com"
  api_key       = var.cast_operations_api_key
}
```

## Volledig voorbeeld van zelf-gehoste configuratie

Hier is een volledig voorbeeld voor een zelf-gehoste Cast Operations-instantie:

```hcl
# versions.tf
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Moet overeenkomen met uw Cast Operations-versie
    }
  }
  required_version = ">= 1.0"

  # Optioneel: Gebruik externe status voor teamsamenwerking
  backend "s3" {
    bucket = "your-terraform-state-bucket"
    key    = "cast-operations/terraform.tfstate"
    region = "us-west-2"
  }
}

# variables.tf
variable "cast_operations_url" {
  description = "Cast Operations-instantie-URL"
  type        = string
  default     = "https://operations.yourcompany.com"
}

variable "cast_operations_api_key" {
  description = "Cast Operations API-sleutel"
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "Omgevingsnaam"
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
  description = "Cast Operations project-ID (handmatig aanmaken in dashboard)"
  type        = string
}

# main.tf
# Teams aanmaken
resource "cast_operations_team" "infrastructure" {
  name        = "Infrastructuurteam"
  description = "Infrastructuur- en operatieteam"
}

resource "cast_operations_team" "development" {
  name        = "Ontwikkelingsteam"
  description = "Applicatieontwikkelingsteam"
  project_id = cast_operations_project.main.id
}

# Infrastructuurmonitors
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
```

## Omgevingsspecifieke configuratie

### Ontwikkelomgeving

```hcl
# dev.tfvars
cast_operations_url = "https://operations-dev.yourcompany.com"
environment = "development"
```

### Stagingomgeving

```hcl
# staging.tfvars
cast_operations_url = "https://operations-staging.yourcompany.com"
environment = "staging"
```

### Productieomgeving

```hcl
# prod.tfvars
cast_operations_url = "https://operations.yourcompany.com"
environment = "production"
```

## Upgradeproces voor zelf-gehost

Bij het upgraden van uw Cast Operations-instantie:

### 1. Controlelijst voor upgrade

```bash
# Back-up van huidige Terraform-status
terraform state pull > backup-$(date +%Y%m%d).tfstate

# Huidige Cast Operations-versie noteren
curl https://operations.yourcompany.com/api/status | jq '.version'

# Huidige providerversie noteren
terraform providers | grep cast-operations
```

### 2. Cast Operations-instantie upgraden

Volg uw standaard Cast Operations-upgradeproces (Docker, Helm, enz.)

### 3. Terraform-provider bijwerken

```hcl
# Versie bijwerken in terraform-blok
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.124"  # Nieuwe versie na upgrade
    }
  }
}
```

### 4. Testen en toepassen

```bash
# Provider bijwerken
terraform init -upgrade

# Plannen om eventuele wijzigingen te zien
terraform plan

# Toepassen als alles er goed uitziet
terraform apply
```

## Netwerkconfiguratie

### Firewallregels

Zorg dat uw Terraform-runner toegang heeft tot:

- Cast Operations API-eindpunt (doorgaans poort 443/HTTPS)
- Interne resources die worden bewaakt

### VPN/Privénetwerken

Als Cast Operations op een privénetwerk staat:

```hcl
provider "cast-operations" {
  cast_operations_url = "https://10.0.1.100:443"  # Intern IP
  api_key       = var.cast_operations_api_key
}
```

## Beveiligingsbest practices

### 1. API-sleutelbeheer

```bash
# Omgevingsvariabelen gebruiken
export CAST_OPERATIONS_API_KEY="your-api-key"

# Of gebruik een geheimbeheersysteem
export CAST_OPERATIONS_API_KEY=$(vault kv get -field=api_key secret/cast-operations)
```

### 2. Principe van minimale bevoegdheden voor API-sleutels

Maak API-sleutels aan met minimale vereiste machtigingen:

- Monitorbeheer
- Meldingsbeleidbeheer
- Teambeheer (indien nodig)

## Back-up en herstel na rampen

### Status back-up

```bash
# Regelmatige statusback-ups
terraform state pull > backup-$(date +%Y%m%d-%H%M%S).tfstate

# Geautomatiseerd back-upscript
#!/bin/bash
DATE=$(date +%Y%m%d-%H%M%S)
terraform state pull > "backups/terraform-state-${DATE}.tfstate"
find backups/ -name "terraform-state-*.tfstate" -mtime +30 -delete
```

## Beheer van meerdere omgevingen

### Werkruimten gebruiken

```bash
# Omgevingen aanmaken
terraform workspace new dev
terraform workspace new staging
terraform workspace new prod

# Schakelen tussen omgevingen
terraform workspace select prod
terraform apply -var-file="prod.tfvars"
```

### Afzonderlijke mappen gebruiken

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

Deze aanpak biedt betere isolatie en eenvoudiger versiebeheer per omgeving.

## Probleemoplossing voor zelf-gehoste problemen

### Probleem: Verbinding geweigerd

```
Error: connection refused
```

**Oplossingen**:

1. Controleer of de Cast Operations-instantie actief is
2. Verifieer of de API-URL correct is
3. Controleer firewall-/netwerkconnectiviteit
4. Verifieer of TLS-certificaten geldig zijn

### Probleem: API-versie-mismatch

```
Error: API version incompatible
```

**Oplossingen**:

1. Controleer de Cast Operations-versie: `curl https://your-instance/api/status`
2. Werk de providerversie bij zodat deze overeenkomt
3. Voer `terraform init -upgrade` uit

### Probleem: Zelfondertekende certificaten

Als u zelfondertekende certificaten gebruikt:

```bash
# TLS-verificatie tijdelijk overslaan (niet aanbevolen voor productie)
export CAST_OPERATIONS_SKIP_TLS_VERIFY=true
```

Betere oplossing: Voeg uw CA-certificaat toe aan de systeemvertrouwensopslag.
