# Snabbstartsguide för Terraform-leverantör

Den här guiden hjälper dig att komma igång med Cast Operations Terraform-leverantören på bara några minuter.

## Förutsättningar

- Terraform >= 1.0 installerat
- Cast Operations-konto (moln eller egeninstallerat)
- Cast Operations API-nyckel

## Steg 1: Skapa API-nyckel

### För Cast Operations Cloud

1. Gå till [Cast Operations Cloud](https://latticeruntime.com) och logga in
2. Navigera till **Inställningar** → **API-nycklar**
3. Klicka på **Skapa API-nyckel**
4. Namnge den "Terraform-leverantör"
5. Välj obligatoriska behörigheter
6. Kopiera den genererade API-nyckeln

### För egeninstallerad Cast Operations

1. Gå till din Cast Operations-instans
2. Navigera till **Inställningar** → **API-nycklar**
3. Klicka på **Skapa API-nyckel**
4. Namnge den "Terraform-leverantör"
5. Välj obligatoriska behörigheter
6. Kopiera den genererade API-nyckeln

## Steg 2: Skapa Terraform-konfiguration

Skapa en ny katalog och `main.tf`-fil:

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      # For Cloud customers
      version = "~> 7.0"

      # For Self-Hosted customers - pin to your exact version
      # version = "= 7.0.123"  # Replace with your Cast Operations version
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  # For Cloud customers
  cast_operations_url = "https://latticeruntime.com"

  # For Self-Hosted customers - use your instance URL
  # cast_operations_url = "https://operations.yourcompany.com"

  api_key = var.cast_operations_api_key
}

variable "cast_operations_api_key" {
  description = "Cast Operations API Key"
  type        = string
  sensitive   = true
}

variable "project_id" {
  description = "Cast Operations project ID"
  type        = string
}

# Create a simple website monitor
resource "cast_operations_monitor" "website" {
  name        = "Website Monitor"
  description = "Monitor for website uptime"
  data        = jsonencode({
    url = "https://example.com"
    interval = "5m"
    timeout = "30s"
  })
}

# Output the monitor ID
output "monitor_id" {
  value = cast_operations_monitor.website.id
}
```

## Steg 3: Skapa variabelfil

Skapa `terraform.tfvars`:

```hcl
# terraform.tfvars
cast_operations_api_key = "your-api-key-here"
project_id        = "your-project-id-here"  # Get this from Cast Operations dashboard
```

**Viktigt**: Lägg till `terraform.tfvars` i din `.gitignore` för att hålla API-nycklar hemliga!

## Steg 4: Initiera och tillämpa

```bash
# Initialize Terraform
terraform init

# Plan the deployment
terraform plan

# Apply the configuration
terraform apply
```

## Steg 5: Verifiera resurser

1. Kontrollera din Cast Operations-instrumentpanel
2. Gå till ditt befintliga projekt
3. Verifiera att "Website Monitor" skapats och körs

## Nästa steg

1. **Utforska fler resurser**: Se [den fullständiga dokumentationen](./complete-guide.md) för alla tillgängliga resurser
2. **Konfigurera varningar**: Lägg till varningspolicyer och aviseringskanaler
3. **Skapa statussidor**: Konfigurera offentliga statussidor för dina tjänster
4. **Organisera med team**: Skapa team och tilldela behörigheter

## Versionspecifika exempel

### Molnkunder (senaste versionen)

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Always gets latest compatible 7.x version
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://latticeruntime.com"
  api_key       = var.cast_operations_api_key
}
```

### Egeninstallerade kunder (versionslåst)

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Must match your Cast Operations version exactly
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://operations.mycompany.com"  # Your self-hosted URL
  api_key       = var.cast_operations_api_key
}
```

## Felsökning av snabbstart

### Problem: Leverantören hittades inte

```
Error: Failed to query available provider packages
```

**Lösning**: Kör `terraform init` för att ladda ner leverantören

### Problem: Autentisering misslyckades

```
Error: Invalid API key
```

**Lösning**:

1. Verifiera din API-nyckel i Cast Operations-instrumentpanelen
2. Kontrollera att API-nyckeln har tillräckliga behörigheter
3. Se till att `cast_operations_url` är korrekt för din instans

### Problem: Versionsmismatch (egeninstallerad)

```
Error: API version incompatible
```

**Lösning**:

1. Kontrollera din Cast Operations-version i instrumentpanelen
2. Uppdatera leverantörens version för att matcha exakt
3. Kör `terraform init -upgrade`

## Rensning

För att ta bort alla resurser som skapades i den här snabbstarten:

```bash
terraform destroy
```

Detta tar bort monitorn och projektet som skapades under snabbstarten.
