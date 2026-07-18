# Terraform Provider-dokumentation

Cast Operations Terraform Provider muliggør Infrastructure as Code (IaC)-administration af dine Cast Operations overvågnings-, advarsels- og observabilitetsressourcer.

## Dokumentationsafsnit

### [Kom i gang](./quick-start.md)

Hurtig opsætningsvejledning til at komme i gang med Cast Operations Terraform Provider på få minutter.

### [Komplet providervejledning](./README.md)

Omfattende dokumentation, der dækker installation, konfiguration, ressourcer og bedste praksis.

### [Selvhostet konfiguration](./self-hosted.md)

**Kritisk for selvhostede kunder**: Versionsfastlåsning, kompatibilitet og deployment-strategier.

### [Eksempler](./examples.md)

Eksempler fra virkeligheden og mønstre til almindelige Cast Operations Terraform-konfigurationer.

## Hurtige links

### Til Cast Operations Cloud-kunder

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

### Til selvhostede kunder

```hcl
terraform {
  required_providers {
    oneuptime = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Skal matche din Cast Operations-version
    }
  }
}

provider "oneuptime" {
  oneuptime_url = "https://operations.yourcompany.com"
  api_key       = var.oneuptime_api_key
}
```

## Vigtigt for selvhostede brugere

**Versionskompatibilitet er kritisk**: Fastlås altid Terraform-providerversionen til nøjagtigt at matche din Cast Operations-installationsversion. Uoverensstemmende versioner kan forårsage API-kompatibilitetsproblemer.

## Eksterne ressourcer

- **Terraform Registry**: [Cast Operations Provider](https://registry.terraform.io/providers/autonomy-cloud/operations)
- **GitHub Repository**: [Cast Operations Source Code](https://github.com/autonomy-cloud/operations)
- **Fællesskabssupport**: [Cast Operations Community](https://community.visca.ai)

## Tilgængelige ressourcer

Provideren understøtter omfattende Cast Operations-ressourceadministration:

- **Projekter og teams**: Organiser din overvågningsstruktur
- **Monitorer**: Website-, API-, port-, hjerteslag- og brugerdefinerede monitorer
- **Incident management**: Advarsels-politikker, vagtplaner, eskaleringer
- **Statussider**: Offentlige og private statussider med brugerdefineret branding
- **Tjenestekatalog**: Tjenestedefinitioner og afhængighedskortlægning
- **Arbejdsgange**: Automatiseret respons og afhjælpningsarbejdsgange

## Support

Til problemer, spørgsmål eller bidrag:

1. **Dokumentationsproblemer**: Opret et issue i [Cast Operations-repositoryet](https://github.com/autonomy-cloud/operations/issues)
2. **Providerfejl**: Rapportér i det primære Cast Operations-repository
3. **Funktionsanmodninger**: Diskuter i Cast Operations-fællesskabet
4. **Generelle spørgsmål**: Brug fællesskabsforummet

## Næste trin

1. **Nye brugere**: Start med [Hurtig start-vejledningen](./quick-start.md)
2. **Selvhostet**: Gennemgå [Selvhostet konfiguration](./self-hosted.md)
3. **Avancerede brugere**: Udforsk [Eksempler](./examples.md) til komplekse opsætninger
4. **Fuld reference**: Se [Komplet vejledning](./README.md) for alle funktioner
