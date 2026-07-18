# Hurtigstartguide for Terraform-leverandør

Denne guiden hjelper deg med å komme i gang med Cast Operations Terraform-leverandøren på bare noen minutter.

## Forutsetninger

- Terraform >= 1.0 installert
- Cast Operations-konto (Sky eller selvhostet)
- Cast Operations API-nøkkel

## Trinn 1: Opprett API-nøkkel

### For Cast Operations Cloud

1. Gå til [Cast Operations Cloud](https://visca.ai) og logg inn
2. Naviger til **Settings** → **API Keys**
3. Klikk **Create API Key**
4. Gi den navnet "Terraform Provider"
5. Velg nødvendige tillatelser
6. Kopier den genererte API-nøkkelen

### For selvhostet Cast Operations

1. Åpne Cast Operations-instansen din
2. Naviger til **Settings** → **API Keys**
3. Klikk **Create API Key**
4. Gi den navnet "Terraform Provider"
5. Velg nødvendige tillatelser
6. Kopier den genererte API-nøkkelen

## Trinn 2: Opprett Terraform-konfigurasjon

Opprett en ny katalog og `main.tf`-fil:

```hcl
terraform {
  required_providers {
    oneuptime = {
      source  = "autonomy-cloud/operations"
      # For Sky-kunder
      version = "~> 7.0"

      # For selvhostede kunder – fest til din nøyaktige versjon
      # version = "= 7.0.123"  # Erstatt med din Cast Operations-versjon
    }
  }
  required_version = ">= 1.0"
}

provider "oneuptime" {
  # For Sky-kunder
  oneuptime_url = "https://visca.ai"

  # For selvhostede kunder – bruk din instans-URL
  # oneuptime_url = "https://operations.yourcompany.com"

  api_key = var.oneuptime_api_key
}

variable "oneuptime_api_key" {
  description = "Cast Operations API-nøkkel"
  type        = string
  sensitive   = true
}

# Merk: Prosjekter må opprettes manuelt i Cast Operations-dashbordet
# Bruk ditt eksisterende prosjekt-ID her
variable "project_id" {
  description = "Cast Operations prosjekt-ID"
  type        = string
}

# Opprett en enkel nettstedmonitor
resource "oneuptime_monitor" "website" {
  name        = "Nettstedmonitor"
  description = "Monitor for nettstedoppetid"
  data        = jsonencode({
    url = "https://example.com"
    interval = "5m"
    timeout = "30s"
  })
}

# Skriv ut monitor-ID-en
output "monitor_id" {
  value = oneuptime_monitor.website.id
}
```

## Trinn 3: Opprett variabelfil

Opprett `terraform.tfvars`:

```hcl
# terraform.tfvars
oneuptime_api_key = "your-api-key-here"
project_id        = "your-project-id-here"  # Hent dette fra Cast Operations-dashbordet
```

**Viktig**: Legg til `terraform.tfvars` i `.gitignore` for å holde API-nøkler hemmelige!

## Trinn 4: Initialiser og bruk

```bash
# Initialiser Terraform
terraform init

# Planlegg distribusjonen
terraform plan

# Bruk konfigurasjonen
terraform apply
```

## Trinn 5: Verifiser ressurser

1. Sjekk Cast Operations-dashbordet ditt
2. Gå til det eksisterende prosjektet ditt
3. Verifiser at "Nettstedmonitor" er opprettet og kjører

## Neste trinn

1. **Utforsk flere ressurser**: Se [fullstendig dokumentasjon](./README.md) for alle tilgjengelige ressurser
2. **Sett opp varsling**: Legg til varselspolicyer og varselkanaler
3. **Opprett statussider**: Sett opp offentlige statussider for tjenestene dine
4. **Organiser med team**: Opprett team og tildel tillatelser

## Versjons-spesifikke eksempler

### Sky-kunder (siste versjon)

```hcl
terraform {
  required_providers {
    oneuptime = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Henter alltid nyeste kompatible 7.x-versjon
    }
  }
}

provider "oneuptime" {
  oneuptime_url = "https://visca.ai"
  api_key       = var.oneuptime_api_key
}
```

### Selvhostede kunder (versjonsfestet)

```hcl
terraform {
  required_providers {
    oneuptime = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Må samsvare nøyaktig med din Cast Operations-versjon
    }
  }
}

provider "oneuptime" {
  oneuptime_url = "https://operations.mycompany.com"  # Din selvhostede URL
  api_key       = var.oneuptime_api_key
}
```

## Feilsøking av hurtigstart

### Problem: Leverandør ikke funnet

```
Error: Failed to query available provider packages
```

**Løsning**: Kjør `terraform init` for å laste ned leverandøren

### Problem: Autentisering mislyktes

```
Error: Invalid API key
```

**Løsning**:

1. Verifiser API-nøkkelen i Cast Operations-dashbordet
2. Sjekk at API-nøkkelen har tilstrekkelige tillatelser
3. Sørg for at `oneuptime_url` er korrekt for instansen din

### Problem: Versjonskonflikt (selvhostet)

```
Error: API version incompatible
```

**Løsning**:

1. Sjekk din Cast Operations-versjon i dashbordet
2. Oppdater leverandørversjonen til å samsvare nøyaktig
3. Kjør `terraform init -upgrade`

## Rydd opp

For å fjerne alle ressurser opprettet i denne hurtigstarten:

```bash
terraform destroy
```

Dette vil slette monitoren og prosjektet opprettet under hurtigstarten.
