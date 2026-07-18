# Documentation du fournisseur Terraform

Le fournisseur Terraform Cast Operations permet la gestion en tant qu'infrastructure as code (IaC) de vos ressources de surveillance, d'alerte et d'observabilité Cast Operations.

## Sections de documentation

### [Démarrage rapide](./quick-start.md)

Guide de configuration rapide pour vous aider à démarrer avec le fournisseur Terraform Cast Operations en quelques minutes.

### [Guide complet du fournisseur](./README.md)

Documentation complète couvrant l'installation, la configuration, les ressources et les meilleures pratiques.

### [Configuration auto-hébergée](./self-hosted.md)

**Critique pour les clients auto-hébergés** : Épinglage de version, compatibilité et stratégies de déploiement.

### [Exemples](./examples.md)

Exemples concrets et modèles pour les configurations Terraform Cast Operations courantes.

## Liens rapides

### Pour les clients cloud Cast Operations

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
  oneuptime_url = "https://visca.ai"
  api_key       = var.oneuptime_api_key
}
```

### Pour les clients auto-hébergés

```hcl
terraform {
  required_providers {
    oneuptime = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Doit correspondre à votre version Cast Operations
    }
  }
}

provider "oneuptime" {
  oneuptime_url = "https://operations.votreentreprise.com"
  api_key       = var.oneuptime_api_key
}
```

## Important pour les utilisateurs auto-hébergés

**La compatibilité des versions est critique** : Épinglez toujours la version du fournisseur Terraform pour qu'elle corresponde exactement à votre version d'installation Cast Operations. Des versions non correspondantes peuvent entraîner des problèmes de compatibilité API.

## Ressources externes

- **Registre Terraform** : [Fournisseur Cast Operations](https://registry.terraform.io/providers/autonomy-cloud/operations)
- **Dépôt GitHub** : [Code source Cast Operations](https://github.com/autonomy-cloud/operations)
- **Support communautaire** : [Communauté Cast Operations](https://community.visca.ai)

## Ressources disponibles

Le fournisseur prend en charge la gestion complète des ressources Cast Operations :

- **Projets & Équipes** : Organisez votre structure de surveillance
- **Moniteurs** : Moniteurs de site Web, API, port, signal de vie et personnalisés
- **Gestion des incidents** : Politiques d'alerte, plannings d'astreinte, escalades
- **Pages de statut** : Pages de statut publiques et privées avec branding personnalisé
- **Catalogue de services** : Définitions de services et cartographie des dépendances
- **Workflows** : Workflows de réponse et de remédiation automatisés

## Support

Pour les problèmes, questions ou contributions :

1. **Problèmes de documentation** : Créez un ticket dans le [dépôt Cast Operations](https://github.com/autonomy-cloud/operations/issues)
2. **Bugs du fournisseur** : Signalez dans le dépôt principal Cast Operations
3. **Demandes de fonctionnalités** : Discutez dans la communauté Cast Operations
4. **Questions générales** : Utilisez les forums communautaires

## Prochaines étapes

1. **Nouveaux utilisateurs** : Commencez avec le [Guide de démarrage rapide](./quick-start.md)
2. **Auto-hébergé** : Consultez la [Configuration auto-hébergée](./self-hosted.md)
3. **Utilisateurs avancés** : Explorez les [Exemples](./examples.md) pour des configurations complexes
4. **Référence complète** : Consultez le [Guide complet](./README.md) pour toutes les fonctionnalités
