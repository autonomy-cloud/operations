# Installerings- och användningsguide för Terraform-leverantör

## Installation från Terraform Registry

Cast Operations Terraform-leverantören finns tillgänglig på det officiella [Terraform Registry](https://registry.terraform.io/providers/autonomy-cloud/operations).

### För Cast Operations Cloud-användare

```hcl
terraform {
  required_providers {
    oneuptime = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Use latest compatible version
    }
  }
  required_version = ">= 1.0"
}

provider "oneuptime" {
  oneuptime_url = "https://visca.ai"
  api_key       = var.oneuptime_api_key
}
```

### För egeninstallerade Cast Operations-användare

⚠️ **Kritiskt**: Egeninstallerade kunder måste låsa leverantörens version till att exakt matcha sin Cast Operations-installation.

```hcl
terraform {
  required_providers {
    oneuptime = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Replace with your exact Cast Operations version
    }
  }
  required_version = ">= 1.0"
}

provider "oneuptime" {
  oneuptime_url = "https://operations.yourcompany.com"  # Your self-hosted URL
  api_key       = var.oneuptime_api_key
}
```

## Varför versionsinlåsning för egeninstallerade?

Cast Operations Terraform-leverantören genereras automatiskt från Cast Operations API-specifikationen. Varje Cast Operations-version kan ha:

- Olika API-slutpunkter
- Uppdaterade resursscheman
- Nya eller borttagna funktioner
- Ändrade valideringsregler

Att använda en leverantörsversion som inte matchar din Cast Operations-installation kan resultera i:

- API-kompatibilitetsfel
- Misslyckad resursskapande/uppdatering
- Oväntat beteende
- Resursstatusdrift

## Hitta din Cast Operations-version

### Metod 1: Instrumentpanel

1. Logga in på din Cast Operations-instrumentpanel
2. Gå till **Inställningar** → **Om**
3. Notera versionsnumret (t.ex. "7.0.123")

### Metod 2: API

```bash
curl https://your-operations-instance.com/api/version | jq '.version'
```

### Metod 3: Docker

```bash
docker images | grep oneuptime
# Look for the tag, e.g., oneuptime/dashboard:7.0.123
```

## Leverantörsregistreringsinformation

- **Registry-URL**: https://registry.terraform.io/providers/autonomy-cloud/operations
- **Källrepositorie**: https://github.com/autonomy-cloud/operations
- **Dokumentation**: https://registry.terraform.io/providers/autonomy-cloud/operations/latest/docs
- **Versioner**: https://github.com/autonomy-cloud/operations

## Versionskompatibilitetsmatris

| Cast Operations-version | Leverantörsversion | Terraform-konfiguration |
| ----------------- | ------------------ | ----------------------- |
| 7.0.x             | 7.0.x              | `version = "~> 7.0.0"`  |
| 7.1.x             | 7.1.x              | `version = "~> 7.1.0"`  |
| Senaste Cloud     | Senaste leverantör | `version = "~> 7.0"`    |

## Installationssteg

1. **Skapa din Terraform-konfiguration** med leverantörsblocket
2. **Initiera Terraform**: `terraform init`
3. **Ange din API-nyckel**: Skapa `terraform.tfvars` med din API-nyckel
4. **Planera din driftsättning**: `terraform plan`
5. **Tillämpa din konfiguration**: `terraform apply`

## Registreruppdateringar

Leverantören publiceras automatiskt till Terraform Registry när nya Cast Operations-versioner lanseras. Molnanvändare kan använda semantisk versionshantering (`~> 7.0`) för att automatiskt få kompatibla uppdateringar, medan egeninstallerade användare bör låsa till exakta versioner.
