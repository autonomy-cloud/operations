# Terraform-leverandørdokumentasjon

Cast Operations Terraform-leverandøren muliggjør Infrastructure as Code (IaC)-administrasjon av Cast Operations-overvåkings-, varslings- og observerbarhetressurser.

## Dokumentasjonsseksjoner

### [Kom i gang](./quick-start.md)

Rask oppsettguide for å komme i gang med Cast Operations Terraform-leverandøren på noen minutter.

### [Komplett leverandørguide](./README.md)

Omfattende dokumentasjon som dekker installasjon, konfigurasjon, ressurser og beste praksis.

### [Selvhostet konfigurasjon](./self-hosted.md)

**Kritisk for selvhostede kunder**: Versjonsfesting, kompatibilitet og distribusjonsstrategier.

### [Eksempler](./examples.md)

Eksempler og mønstre fra den virkelige verden for vanlige Cast Operations Terraform-konfigurasjoner.

## Hurtiglenker

### For Cast Operations Cloud-kunder

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
  cast_operations_url = "https://visca.ai"
  api_key       = var.cast_operations_api_key
}
```

### For selvhostede kunder

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Må samsvare med din Cast Operations-versjon
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://operations.yourcompany.com"
  api_key       = var.cast_operations_api_key
}
```

## Viktig for selvhostede brukere

**Versjonskompatibilitet er kritisk**: Fest alltid Terraform-leverandørversjonen til å samsvare nøyaktig med din Cast Operations-installasjonsversjon. Uoverensstemmende versjoner kan forårsake API-kompatibilitetsproblemer.

## Eksterne ressurser

- **Terraform Registry**: [Cast Operations-leverandør](https://registry.terraform.io/providers/autonomy-cloud/operations)
- **GitHub Repository**: [Cast Operations kildekode](https://github.com/autonomy-cloud/operations)
- **Community Support**: [Cast Operations Community](https://community.visca.ai)

## Tilgjengelige ressurser

Leverandøren støtter omfattende Cast Operations-ressursadministrasjon:

- **Prosjekter og team**: Organiser overvåkingsstrukturen din
- **Monitorer**: Nettsted-, API-, port-, hjerteslag- og egendefinerte monitorer
- **Hendelseshåndtering**: Varselspolicyer, vaktplaner, eskaleringer
- **Statussider**: Offentlige og private statussider med egendefinert merkevarebygging
- **Tjenestekatalog**: Tjenestedefinisjoner og avhengighetskartlegging
- **Arbeidsflyter**: Automatiserte respons- og utbedringsarbeidsflyter

## Støtte

For problemer, spørsmål eller bidrag:

1. **Dokumentasjonsproblemer**: Opprett en sak i [Cast Operations-repositoriet](https://github.com/autonomy-cloud/operations/issues)
2. **Leverandørfeil**: Rapporter i det sentrale Cast Operations-repositoriet
3. **Funksjonsforespørsler**: Diskuter i Cast Operations-community
4. **Generelle spørsmål**: Bruk community-forumene

## Neste trinn

1. **Nye brukere**: Start med [hurtigstartguiden](./quick-start.md)
2. **Selvhostet**: Se gjennom [selvhostet konfigurasjon](./self-hosted.md)
3. **Avanserte brukere**: Utforsk [eksempler](./examples.md) for komplekse oppsett
4. **Fullstendig referanse**: Sjekk den [fullstendige guiden](./README.md) for alle funksjoner
