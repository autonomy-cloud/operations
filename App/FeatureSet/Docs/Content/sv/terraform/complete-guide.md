# Cast Operations Terraform-leverantör

Cast Operations Terraform-leverantören gör det möjligt att hantera Cast Operations-resurser med Infrastructure as Code (IaC). Denna leverantör gör det möjligt att konfigurera övervakning, incidenthantering, statussidor och andra Cast Operations-funktioner via Terraform.

## Installation

### Från Terraform Registry (rekommenderas)

Cast Operations Terraform-leverantören finns tillgänglig på [Terraform Registry](https://registry.terraform.io/providers/autonomy-cloud/operations).

```hcl
terraform {
  required_providers {
    cast-operations = {
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
    cast-operations = {
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
provider "cast-operations" {
  cast_operations_url = "https://your-operations-instance.com"  # Or https://visca.ai for cloud
  api_key       = var.cast_operations_api_key
}
```

### Miljövariabler

Du kan konfigurera leverantören med miljövariabler:

```bash
export CAST_OPERATIONS_URL="https://your-operations-instance.com"
export CAST_OPERATIONS_API_KEY="your-api-key-here"
```

### Konfigurationsalternativ

| Argument        | Miljövariabel       | Beskrivning          | Obligatorisk |
| --------------- | ------------------- | -------------------- | ------------ |
| `cast_operations_url` | `CAST_OPERATIONS_URL`     | Cast Operations URL        | Ja           |
| `api_key`       | `CAST_OPERATIONS_API_KEY` | Cast Operations API-nyckel | Ja           |

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
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://visca.ai"  # Use your instance URL
  api_key       = var.cast_operations_api_key
}

variable "project_id" {
  description = "Cast Operations project ID"
  type        = string
}

# Create a monitor
resource "cast_operations_monitor" "website" {
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

- `cast_operations_team` – Hantera team

### Övervakning

- `cast_operations_monitor` – Skapa och hantera monitorer
- `cast_operations_probe` – Hantera övervakningssonder

### Jour-hantering

- `cast_operations_on_call_duty_policy` – Konfigurera jourschemat

### Statussidor

- `cast_operations_status_page` – Skapa statussidor

### Tjänstkatalog

- `cast_operations_service_catalog` – Hantera tjänstkatalogposter

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
    key    = "cast-operations/terraform.tfstate"
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
