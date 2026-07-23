# Terraform Provider-documentatie

De Cast Operations Terraform Provider maakt Infrastructure as Code (IaC)-beheer mogelijk van uw Cast Operations-monitoring-, meldings- en observabiliteitsresources.

## Documentatiesecties

### [Aan de slag](./quick-start.md)

Snelle installatiegids om u binnen enkele minuten aan de slag te krijgen met de Cast Operations Terraform Provider.

### [Volledige providergids](./README.md)

Uitgebreide documentatie over installatie, configuratie, resources en best practices.

### [Zelf-gehoste configuratie](./self-hosted.md)

**Kritiek voor zelf-gehoste klanten**: Versie vastzetten, compatibiliteit en implementatiestrategieën.

### [Voorbeelden](./examples.md)

Praktijkvoorbeelden en -patronen voor veelgebruikte Cast Operations Terraform-configuraties.

## Snelkoppelingen

### Voor Cast Operations Cloud-klanten

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
  cast_operations_url = "https://latticeruntime.com"
  api_key       = var.cast_operations_api_key
}
```

### Voor zelf-gehoste klanten

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Moet overeenkomen met uw Cast Operations-versie
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://operations.yourcompany.com"
  api_key       = var.cast_operations_api_key
}
```

## Belangrijk voor zelf-gehoste gebruikers

**Versiecompatibiliteit is kritiek**: Zet de Terraform-providerversie altijd vast zodat deze exact overeenkomt met uw Cast Operations-installatieversie. Niet-overeenkomende versies kunnen API-compatibiliteitsproblemen veroorzaken.

## Externe resources

- **Terraform Registry**: [Cast Operations Provider](https://registry.terraform.io/providers/autonomy-cloud/operations)
- **GitHub Repository**: [Cast Operations Source Code](https://github.com/autonomy-cloud/operations)
- **Community-ondersteuning**: [Cast Operations Community](https://community.latticeruntime.com)

## Beschikbare resources

De provider ondersteunt uitgebreid Cast Operations-resourcebeheer:

- **Projecten en teams**: Organiseer uw monitoringstructuur
- **Monitors**: Website-, API-, poort-, heartbeat- en aangepaste monitors
- **Incidentbeheer**: Meldingsbeleid, piketschema's, escalaties
- **Statuspagina's**: Openbare en privéstatuspagina's met aangepaste branding
- **Servicecatalogus**: Servicedefinities en afhankelijkheidskaarten
- **Workflows**: Geautomatiseerde respons- en herstelworkflows

## Ondersteuning

Voor problemen, vragen of bijdragen:

1. **Documentatieproblemen**: Maak een issue aan in de [Cast Operations-repository](https://github.com/autonomy-cloud/operations/issues)
2. **Providerfouten**: Meld in de hoofd-Cast Operations-repository
3. **Functieverzoeken**: Bespreek in de Cast Operations-community
4. **Algemene vragen**: Gebruik de communityforums

## Volgende stappen

1. **Nieuwe gebruikers**: Begin met de [Snelstartgids](./quick-start.md)
2. **Zelf-gehost**: Bekijk de [Zelf-gehoste configuratie](./self-hosted.md)
3. **Gevorderde gebruikers**: Verken [Voorbeelden](./examples.md) voor complexe instellingen
4. **Volledige referentie**: Bekijk de [Volledige gids](./README.md) voor alle functies
