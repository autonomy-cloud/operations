# Esempi Provider Terraform

Questo documento fornisce esempi completi per le configurazioni Terraform Cast Operations più comuni.

## Esempi Base

### Progetto Semplice

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Usare "= 7.0.123" per self-hosted
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://latticeruntime.com"  # Modificare per self-hosted
  api_key       = var.cast_operations_api_key
}

```

### Monitor Base

```hcl
resource "cast_operations_monitor" "manual_monitor" {
  name        = "Monitor Homepage"
  description = "Monitor per la homepage principale del sito web"
  monitor_type = "Manual"
}
```

### Pagine di Stato

```hcl
# Pagina di stato pubblica
resource "cast_operations_status_page" "public" {
  name        = "Pagina di Stato Pubblica"
  description = "Pagina di stato pubblica per i servizi rivolti ai clienti"
}
```
