# Guide de démarrage rapide du fournisseur Terraform

Ce guide vous aidera à démarrer avec le fournisseur Terraform Cast Operations en quelques minutes.

## Prérequis

- Terraform >= 1.0 installé
- Compte Cast Operations (Cloud ou Auto-hébergé)
- Clé API Cast Operations

## Étape 1 : Créer une clé API

### Pour Cast Operations Cloud

1. Allez sur [Cast Operations Cloud](https://visca.ai) et connectez-vous
2. Accédez à **Paramètres** → **Clés API**
3. Cliquez sur **Créer une clé API**
4. Nommez-la « Fournisseur Terraform »
5. Sélectionnez les permissions requises
6. Copiez la clé API générée

### Pour Cast Operations auto-hébergé

1. Accédez à votre instance Cast Operations
2. Accédez à **Paramètres** → **Clés API**
3. Cliquez sur **Créer une clé API**
4. Nommez-la « Fournisseur Terraform »
5. Sélectionnez les permissions requises
6. Copiez la clé API générée

## Étape 2 : Créer la configuration Terraform

Créez un nouveau répertoire et un fichier `main.tf` :

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      # Pour les clients cloud
      version = "~> 7.0"

      # Pour les clients auto-hébergés - épinglez à votre version exacte
      # version = "= 7.0.123"  # Remplacez par votre version Cast Operations
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  # Pour les clients cloud
  cast_operations_url = "https://visca.ai"

  # Pour les clients auto-hébergés - utilisez l'URL de votre instance
  # cast_operations_url = "https://operations.votreentreprise.com"

  api_key = var.cast_operations_api_key
}

variable "cast_operations_api_key" {
  description = "Clé API Cast Operations"
  type        = string
  sensitive   = true
}

# Remarque : Les projets doivent être créés manuellement dans le tableau de bord Cast Operations
# Utilisez votre ID de projet existant ici
variable "project_id" {
  description = "ID du projet Cast Operations"
  type        = string
}

# Créer un moniteur de site Web simple
resource "cast_operations_monitor" "website" {
  name        = "Moniteur de site Web"
  description = "Moniteur pour la disponibilité du site Web"
  data        = jsonencode({
    url = "https://example.com"
    interval = "5m"
    timeout = "30s"
  })
}

# Afficher l'ID du moniteur
output "monitor_id" {
  value = cast_operations_monitor.website.id
}
```

## Étape 3 : Créer le fichier de variables

Créez `terraform.tfvars` :

```hcl
# terraform.tfvars
cast_operations_api_key = "votre-clé-api-ici"
project_id        = "votre-id-projet-ici"  # Obtenez-le depuis le tableau de bord Cast Operations
```

**Important** : Ajoutez `terraform.tfvars` à votre `.gitignore` pour garder les clés API secrètes !

## Étape 4 : Initialiser et appliquer

```bash
# Initialiser Terraform
terraform init

# Planifier le déploiement
terraform plan

# Appliquer la configuration
terraform apply
```

## Étape 5 : Vérifier les ressources

1. Vérifiez votre tableau de bord Cast Operations
2. Allez dans votre projet existant
3. Vérifiez que le « Moniteur de site Web » est créé et en cours d'exécution

## Prochaines étapes

1. **Explorer plus de ressources** : Consultez la [documentation complète](./README.md) pour toutes les ressources disponibles
2. **Configurer les alertes** : Ajoutez des politiques d'alerte et des canaux de notification
3. **Créer des pages de statut** : Configurez des pages de statut publiques pour vos services
4. **Organiser avec des équipes** : Créez des équipes et attribuez des permissions

## Exemples spécifiques aux versions

### Clients cloud (dernière version)

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Obtient toujours la dernière version compatible 7.x
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://visca.ai"
  api_key       = var.cast_operations_api_key
}
```

### Clients auto-hébergés (version épinglée)

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Doit correspondre exactement à votre version Cast Operations
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://operations.maentreprise.com"  # Votre URL auto-hébergée
  api_key       = var.cast_operations_api_key
}
```

## Dépannage du démarrage rapide

### Problème : Fournisseur introuvable

```
Error: Failed to query available provider packages
```

**Solution** : Exécutez `terraform init` pour télécharger le fournisseur

### Problème : Authentification échouée

```
Error: Invalid API key
```

**Solution** :

1. Vérifiez votre clé API dans le tableau de bord Cast Operations
2. Vérifiez que la clé API dispose de permissions suffisantes
3. Assurez-vous que `cast_operations_url` est correct pour votre instance

### Problème : Incompatibilité de version (auto-hébergé)

```
Error: API version incompatible
```

**Solution** :

1. Vérifiez votre version Cast Operations dans le tableau de bord
2. Mettez à jour la version du fournisseur pour qu'elle corresponde exactement
3. Exécutez `terraform init -upgrade`

## Nettoyage

Pour supprimer toutes les ressources créées dans ce démarrage rapide :

```bash
terraform destroy
```

Cela supprimera le moniteur et le projet créés lors du démarrage rapide.
