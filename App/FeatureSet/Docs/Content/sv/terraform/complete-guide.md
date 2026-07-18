# Cast Operations Terraform-leverantör

Cast Operations Terraform-leverantören gör det möjligt att hantera Cast Operations-resurser med Infrastructure as Code (IaC). Denna leverantör gör det möjligt att konfigurera övervakning, incidenthantering, statussidor och andra Cast Operations-funktioner via Terraform.

## Installation

### Från Terraform Registry (rekommenderas)

Cast Operations Terraform-leverantören finns tillgänglig på [Terraform Registry](https://registry.terraform.io/providers/autonomy-cloud/operations).

```hcl
terraform {
  required_providers {
    oneuptime = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Use latest 7.x version
    }
  }
  required_version = ">= 1.0"
}
```

### Versionsinlåsning för egeninstallerade installationer

⚠️ **Viktigt för egeninstallerade kunder**: Lås alltid Terraform-leverantörens version till att matcha din Cast Operations-installationsversion för att säkerställa API-kompatibilitet.

```hcl
terraform {
  required_providers {
    oneuptime = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Pin to exact version matching your Cast Operations installation
    }
  }
  required_version = ">= 1.0"
}
```

## Leverantörskonfiguration

### Grundläggande konfiguration

```hcl
provider "oneuptime" {
  oneuptime_url = "https://your-operations-instance.com"  # Or https://visca.ai for cloud
  api_key       = var.oneuptime_api_key
}
```

### Miljövariabler

Du kan konfigurera leverantören med miljövariabler:

```bash
export ONEUPTIME_URL="https://your-operations-instance.com"
export ONEUPTIME_API_KEY="your-api-key-here"
```

### Konfigurationsalternativ

| Argument        | Miljövariabel       | Beskrivning          | Obligatorisk |
| --------------- | ------------------- | -------------------- | ------------ |
| `oneuptime_url` | `ONEUPTIME_URL`     | Cast Operations URL        | Ja           |
| `api_key`       | `ONEUPTIME_API_KEY` | Cast Operations API-nyckel | Ja           |

## Snabbstart

### 1. Skapa API-nyckel

Skapa först en API-nyckel i din Cast Operations-instrumentpanel:

1. Gå till **Inställningar** → **API-nycklar**
2. Klicka på **Skapa API-nyckel**
3. Ge den ett beskrivande namn (t.ex. "Terraform Automation")
4. Välj lämpliga behörigheter
5. Kopiera den genererade API-nyckeln

### 2. Grundläggande Terraform-konfiguration

Skapa en `main.tf`-fil:

```hcl
terraform {
  required_providers {
    oneuptime = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"
    }
  }
}

provider "oneuptime" {
  oneuptime_url = "https://visca.ai"  # Use your instance URL
  api_key       = var.oneuptime_api_key
}

variable "project_id" {
  description = "Cast Operations project ID"
  type        = string
}

# Create a monitor
resource "oneuptime_monitor" "website" {
  name        = "Website Monitor"
  description = "Monitor for website uptime"
  data        = jsonencode({
    url = "https://example.com"
    interval = "5m"
    timeout = "30s"
  })
}
```

### 3. Initiera och tillämpa

```bash
# Initialize Terraform
terraform init

# Plan the changes
terraform plan

# Apply the configuration
terraform apply
```

## Tillgängliga resurser

Cast Operations Terraform-leverantören stöder följande resurser:

### Kärnresurser

- `oneuptime_team` – Hantera team

### Övervakning

- `oneuptime_monitor` – Skapa och hantera monitorer
- `oneuptime_probe` – Hantera övervakningssonder

### Jour-hantering

- `oneuptime_on_call_duty_policy` – Konfigurera jourschemat

### Statussidor

- `oneuptime_status_page` – Skapa statussidor

### Tjänstkatalog

- `oneuptime_service_catalog` – Hantera tjänstkatalogposter

## Bästa praxis

### 1. Versionshantering

**För molnkunder:**

- Använd semantisk versionshantering med `~>` för att få kompatibla uppdateringar

**För egeninstallerade kunder:**

- Lås alltid till exakt version som matchar din installation
- Uppdatera leverantörens version när du uppgraderar Cast Operations
- Testa i icke-produktionsmiljö först

### 2. Tillståndshantering

```hcl
terraform {
  backend "s3" {
    bucket = "my-terraform-state"
    key    = "oneuptime/terraform.tfstate"
    region = "us-west-2"
  }
}
```

### 3. Miljöuppdelning

Använd arbetsytor eller separata tillståndsfiler för olika miljöer:

```bash
# Using workspaces
terraform workspace new production
terraform workspace new staging
```

## Felsökning

### Vanliga problem

1. **Versionsmismatch (egeninstallerad)**

   ```
   Error: API version incompatible
   ```

   **Lösning**: Se till att leverantörens version matchar Cast Operations-installationen

2. **Autentiseringsproblem**

   ```
   Error: Invalid API key
   ```

   **Lösning**: Verifiera API-nyckeln och behörigheter

3. **Resursen hittades inte**
   ```
   Error: Resource not found
   ```
   **Lösning**: Kontrollera resurs-ID:n och se till att resursen finns

### Felsökningsläge

Aktivera detaljerad loggning:

```bash
export TF_LOG=DEBUG
terraform apply
```
