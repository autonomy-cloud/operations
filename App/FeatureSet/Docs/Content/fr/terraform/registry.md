# Guide d'installation et d'utilisation du fournisseur Terraform

## Installation depuis le registre Terraform

Le fournisseur Terraform Cast Operations est disponible sur le [Registre Terraform](https://registry.terraform.io/providers/autonomy-cloud/operations) officiel.

### Pour les utilisateurs Cast Operations Cloud

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Utiliser la dernière version compatible
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  cast_operations_url = "https://latticeruntime.com"
  api_key       = var.cast_operations_api_key
}
```

### Pour les utilisateurs Cast Operations auto-hébergés

⚠️ **Critique** : Les clients auto-hébergés doivent épingler la version du fournisseur pour qu'elle corresponde exactement à leur installation Cast Operations.

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Remplacez par votre version exacte Cast Operations
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  cast_operations_url = "https://operations.votreentreprise.com"  # Votre URL auto-hébergée
  api_key       = var.cast_operations_api_key
}
```

## Pourquoi l'épinglage de version pour l'auto-hébergé ?

Le fournisseur Terraform Cast Operations est généré automatiquement à partir de la spécification API Cast Operations. Chaque version Cast Operations peut avoir :

- Des points d'accès API différents
- Des schémas de ressources mis à jour
- Des fonctionnalités nouvelles ou supprimées
- Des règles de validation modifiées

L'utilisation d'une version de fournisseur qui ne correspond pas à votre installation Cast Operations peut entraîner :

- Des erreurs de compatibilité API
- Des échecs de création/mise à jour de ressources
- Un comportement inattendu
- Une dérive d'état des ressources

## Trouver votre version Cast Operations

### Méthode 1 : Tableau de bord

1. Connectez-vous à votre tableau de bord Cast Operations
2. Allez dans **Paramètres** → **À propos**
3. Notez le numéro de version (ex. : « 7.0.123 »)

### Méthode 2 : API

```bash
curl https://votre-instance-latticeruntime.com/api/version | jq '.version'
```

### Méthode 3 : Docker

```bash
docker images | grep cast-operations
# Recherchez le tag, ex. : cast-operations/dashboard:7.0.123
```

## Informations sur le registre du fournisseur

- **URL du registre** : https://registry.terraform.io/providers/autonomy-cloud/operations
- **Dépôt source** : https://github.com/autonomy-cloud/operations
- **Documentation** : https://registry.terraform.io/providers/autonomy-cloud/operations/latest/docs
- **Versions** : https://github.com/autonomy-cloud/operations

## Matrice de compatibilité des versions

| Version Cast Operations | Version du fournisseur | Configuration Terraform |
| ----------------- | ---------------------- | ----------------------- |
| 7.0.x             | 7.0.x                  | `version = "~> 7.0.0"`  |
| 7.1.x             | 7.1.x                  | `version = "~> 7.1.0"`  |
| Cloud (dernière)  | Dernier fournisseur    | `version = "~> 7.0"`    |

## Exemple de démarrage rapide

```hcl
# Configurer le fournisseur
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # À ajuster pour l'auto-hébergé
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://latticeruntime.com"  # À ajuster pour l'auto-hébergé
  api_key       = var.cast_operations_api_key
}

# Créer un projet
resource "cast_operations_project" "example" {
  name        = "Exemple Terraform"
  description = "Créé avec Terraform"
}

# Créer un moniteur de site Web
resource "cast_operations_monitor" "website" {
  name       = "Moniteur de site Web"
  project_id = cast_operations_project.example.id

  monitor_type = "website"
  url          = "https://example.com"
  interval     = "5m"

  tags = {
    managed_by = "terraform"
  }
}
```

## Étapes d'installation

1. **Créez votre configuration Terraform** avec le bloc fournisseur
2. **Initialisez Terraform** : `terraform init`
3. **Définissez votre clé API** : Créez `terraform.tfvars` avec votre clé API
4. **Planifiez votre déploiement** : `terraform plan`
5. **Appliquez votre configuration** : `terraform apply`

## Obtenir de l'aide

- **Documentation complète** : Consultez la [documentation Terraform complète](./README.md)
- **Guide auto-hébergé** : Consultez le [guide de configuration auto-hébergée](./self-hosted.md)
- **Exemples** : Parcourez les [exemples de configuration](./examples.md)
- **Démarrage rapide** : Suivez le [guide de démarrage rapide](./quick-start.md)

## Mises à jour du registre

Le fournisseur est automatiquement publié dans le registre Terraform lorsque de nouvelles versions Cast Operations sont publiées. Les clients cloud peuvent utiliser la gestion sémantique des versions (`~> 7.0`) pour obtenir automatiquement des mises à jour compatibles, tandis que les clients auto-hébergés doivent épingler à des versions exactes.
