# Exemples du fournisseur Terraform

Ce document fournit des exemples complets pour les configurations Terraform Cast Operations courantes.

## Exemples de base

### Projet simple

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Utilisez "= 7.0.123" pour l'auto-hébergé
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://visca.ai"  # Modifiez pour l'auto-hébergé
  api_key       = var.cast_operations_api_key
}

```

### Moniteur de base

```hcl
resource "cast_operations_monitor" "manual_monitor" {
  name        = "Moniteur de la page d'accueil"
  description = "Moniteur pour la page d'accueil principale du site Web"
  monitor_type = "Manual"
}
```

### Pages de statut

```hcl
# Page de statut publique
resource "cast_operations_status_page" "public" {
  name        = "Page de statut publique"
  description = "Page de statut publique pour les services orientés clients"
}
```
