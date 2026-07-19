# Schnellstartanleitung für den Terraform-Provider

Diese Anleitung hilft Ihnen, in wenigen Minuten mit dem Cast Operations Terraform-Provider loszulegen.

## Voraussetzungen

- Terraform >= 1.0 installiert
- Cast Operations-Konto (Cloud oder selbst gehostet)
- Cast Operations-API-Schlüssel

## Schritt 1: API-Schlüssel erstellen

### Für Cast Operations Cloud

1. Gehen Sie zu [Cast Operations Cloud](https://visca.ai) und melden Sie sich an
2. Navigieren Sie zu **Einstellungen** → **API-Schlüssel**
3. Klicken Sie auf **API-Schlüssel erstellen**
4. Nennen Sie ihn "Terraform Provider"
5. Wählen Sie erforderliche Berechtigungen
6. Kopieren Sie den generierten API-Schlüssel

## Schritt 2: Terraform-Konfiguration erstellen

Erstellen Sie ein neues Verzeichnis und eine `main.tf`-Datei:

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      # Für Cloud-Kunden
      version = "~> 7.0"

      # Für selbst gehostete Kunden - auf genaue Version pinnen
      # version = "= 7.0.123"  # Durch Ihre Cast Operations-Version ersetzen
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  # Für Cloud-Kunden
  cast_operations_url = "https://visca.ai"

  # Für selbst gehostete Kunden - verwenden Sie Ihre Instanz-URL
  # cast_operations_url = "https://operations.yourcompany.com"

  api_key = var.cast_operations_api_key
}

variable "cast_operations_api_key" {
  description = "Cast Operations API Key"
  type        = string
  sensitive   = true
}

# Hinweis: Projekte müssen manuell im Cast Operations-Dashboard erstellt werden
variable "project_id" {
  description = "Cast Operations-Projekt-ID"
  type        = string
}

# Einfachen Website-Monitor erstellen
resource "cast_operations_monitor" "website" {
  name        = "Website Monitor"
  description = "Monitor für Website-Verfügbarkeit"
  data        = jsonencode({
    url = "https://example.com"
    interval = "5m"
    timeout = "30s"
  })
}

# Monitor-ID ausgeben
output "monitor_id" {
  value = cast_operations_monitor.website.id
}
```

## Schritt 3: Variablendatei erstellen

Erstellen Sie `terraform.tfvars`:

```hcl
# terraform.tfvars
cast_operations_api_key = "your-api-key-here"
project_id        = "your-project-id-here"  # Aus Cast Operations-Dashboard erhalten
```

**Wichtig**: Fügen Sie `terraform.tfvars` zu Ihrer `.gitignore`-Datei hinzu, um API-Schlüssel geheim zu halten!

## Schritt 4: Initialisieren und anwenden

```bash
# Terraform initialisieren
terraform init

# Bereitstellung planen
terraform plan

# Konfiguration anwenden
terraform apply
```

## Schritt 5: Ressourcen verifizieren

1. Prüfen Sie Ihr Cast Operations-Dashboard
2. Gehen Sie zu Ihrem vorhandenen Projekt
3. Überprüfen Sie, ob der „Website Monitor" erstellt wurde und läuft

## Nächste Schritte

1. **Weitere Ressourcen erkunden**: Prüfen Sie die [vollständige Dokumentation](./complete-guide.md)
2. **Benachrichtigungen einrichten**: Benachrichtigungsrichtlinien hinzufügen
3. **Status-Seiten erstellen**: Öffentliche Status-Seiten einrichten
4. **Mit Teams organisieren**: Teams erstellen und Berechtigungen zuweisen

## Fehlerbehebung beim Schnellstart

### Problem: Provider nicht gefunden

**Lösung**: `terraform init` ausführen, um den Provider herunterzuladen

### Problem: Authentifizierung fehlgeschlagen

**Lösung**:

1. API-Schlüssel im Cast Operations-Dashboard überprüfen
2. Prüfen ob der API-Schlüssel ausreichende Berechtigungen hat
3. Sicherstellen, dass `cast_operations_url` korrekt ist

### Problem: Versions-Mismatch (selbst gehostet)

**Lösung**:

1. Cast Operations-Version im Dashboard prüfen
2. Provider-Version entsprechend aktualisieren
3. `terraform init -upgrade` ausführen

## Bereinigung

Um alle in diesem Schnellstart erstellten Ressourcen zu entfernen:

```bash
terraform destroy
```
