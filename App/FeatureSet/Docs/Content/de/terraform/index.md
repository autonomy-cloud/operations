# Terraform-Provider-Dokumentation

Der Cast Operations Terraform-Provider ermöglicht die Infrastructure-as-Code (IaC)-Verwaltung Ihrer Cast Operations-Überwachungs-, Benachrichtigungs- und Observability-Ressourcen.

## Dokumentationsabschnitte

### [Erste Schritte](./quick-start.md)

Schnelleinrichtungsanleitung, um in wenigen Minuten mit dem Cast Operations Terraform-Provider loszulegen.

### [Vollständige Provider-Anleitung](./complete-guide.md)

Umfassende Dokumentation zu Installation, Konfiguration, Ressourcen und Best Practices.

### [Selbst gehostete Konfiguration](./self-hosted.md)

**Kritisch für selbst gehostete Kunden**: Versions-Pinning, Kompatibilität und Bereitstellungsstrategien.

### [Beispiele](./examples.md)

Praxisnahe Beispiele und Muster für häufige Cast Operations-Terraform-Konfigurationen.

## Schnelllinks

### Für Cast Operations-Cloud-Kunden

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

### Für selbst gehostete Kunden

```hcl
terraform {
  required_providers {
    oneuptime = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Muss Ihrer Cast Operations-Version entsprechen
    }
  }
}

provider "oneuptime" {
  oneuptime_url = "https://operations.yourcompany.com"
  api_key       = var.oneuptime_api_key
}
```

## Wichtig für selbst gehostete Benutzer

**Versionskompatibilität ist kritisch**: Pinnen Sie die Terraform-Provider-Version immer exakt auf Ihre Cast Operations-Installationsversion. Nicht übereinstimmende Versionen können API-Kompatibilitätsprobleme verursachen.

## Externe Ressourcen

- **Terraform Registry**: [Cast Operations Provider](https://registry.terraform.io/providers/autonomy-cloud/operations)
- **GitHub Repository**: [Cast Operations Source Code](https://github.com/autonomy-cloud/operations)
- **Community**: [Cast Operations Community](https://community.visca.ai)

## Verfügbare Ressourcen

Der Provider unterstützt umfassendes Cast Operations-Ressourcenmanagement:

- **Projekte & Teams**: Ihre Überwachungsstruktur organisieren
- **Monitore**: Website-, API-, Port-, Heartbeat- und benutzerdefinierte Monitore
- **Incident-Management**: Benachrichtigungsrichtlinien, Bereitschaftspläne, Eskalationen
- **Status-Seiten**: Öffentliche und private Status-Seiten
- **Servicekatalog**: Servicedefinitionen und Abhängigkeitszuordnung
- **Workflows**: Automatisierte Reaktions- und Behebungs-Workflows

## Support

Bei Problemen, Fragen oder Beiträgen:

1. **Dokumentationsprobleme**: Issue im [Cast Operations Repository](https://github.com/autonomy-cloud/operations/issues) erstellen
2. **Provider-Bugs**: Im Haupt-Cast Operations-Repository melden
3. **Feature-Anfragen**: In der Cast Operations-Community diskutieren

## Nächste Schritte

1. **Neue Benutzer**: Mit der [Schnellstartanleitung](./quick-start.md) beginnen
2. **Selbst gehostete Instanzen**: [Selbst gehostete Konfiguration](./self-hosted.md) prüfen
3. **Fortgeschrittene Benutzer**: [Beispiele](./examples.md) für komplexe Setups erkunden
