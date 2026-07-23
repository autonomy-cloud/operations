# Terraform-leverantörsdokumentation

Cast Operations Terraform-leverantören möjliggör Infrastructure as Code (IaC)-hantering av dina Cast Operations-övervaknings-, varnings- och observabilitetsresurser.

## Dokumentationsavsnitt

### [Kom igång](./quick-start.md)

Snabbinstallationsguide för att komma igång med Cast Operations Terraform-leverantören på några minuter.

### [Fullständig leverantörsguide](./complete-guide.md)

Heltäckande dokumentation om installation, konfiguration, resurser och bästa praxis.

### [Konfiguration för egeninstallation](./self-hosted.md)

**Kritiskt för egeninstallerade kunder**: Versionsinlåsning, kompatibilitet och driftsättningsstrategier.

### [Exempel](./examples.md)

Verkliga exempel och mönster för vanliga Cast Operations Terraform-konfigurationer.

## Snabblänkar

### För Cast Operations Cloud-kunder

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

### För egeninstallerade kunder

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Must match your Cast Operations version
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://operations.yourcompany.com"
  api_key       = var.cast_operations_api_key
}
```

## Viktigt för egeninstallerade användare

**Versionskompatibilitet är kritisk**: Lås alltid Terraform-leverantörens version till att exakt matcha din Cast Operations-installationsversion. Felmatchade versioner kan orsaka API-kompatibilitetsproblem.

## Externa resurser

- **Terraform Registry**: [Cast Operations-leverantör](https://registry.terraform.io/providers/autonomy-cloud/operations)
- **GitHub-repositorie**: [Cast Operations källkod](https://github.com/autonomy-cloud/operations)

## Tillgängliga resurser

Leverantören stöder heltäckande Cast Operations-resurshantering:

- **Projekt och team**: Organisera din övervakningsstruktur
- **Monitorer**: Webbplats, API, port, hjärtslag och anpassade monitorer
- **Incidenthantering**: Varningspolicyer, jourschemat, eskaleringar
- **Statussidor**: Offentliga och privata statussidor med anpassad märkning
- **Tjänstkatalog**: Tjänstedefinitioner och beroendemappning
- **Arbetsflöden**: Automatiserat svar och saneringsarbetsflöden

## Support

För problem, frågor eller bidrag:

1. **Dokumentationsproblem**: Skapa ett ärende i [Cast Operations-repositoriet](https://github.com/autonomy-cloud/operations/issues)
2. **Leverantörsfel**: Rapportera i Cast Operations-repositoriet
3. **Funktionsförfrågningar**: Diskutera i Cast Operations-communityt

## Nästa steg

1. **Nya användare**: Börja med [snabbstartsguiden](./quick-start.md)
2. **Egeninstallerade**: Granska [konfiguration för egeninstallation](./self-hosted.md)
3. **Avancerade användare**: Utforska [exempel](./examples.md) för komplexa konfigurationer
4. **Fullständig referens**: Se [den fullständiga guiden](./complete-guide.md) för alla funktioner
