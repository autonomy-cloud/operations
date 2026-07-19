# Authentifizierung

Die Cast Operations CLI unterstützt mehrere Möglichkeiten zur Authentifizierung mit Ihrer Cast Operations-Instanz. Sie können benannte Kontexte, Umgebungsvariablen oder Anmeldedaten direkt als Flags übergeben.

## Anmelden

Authentifizieren Sie sich mit Ihrer Cast Operations-Instanz mithilfe eines API-Schlüssels:

```bash
cast-operations login <api-key> <instance-url>
```

**Argumente:**

| Argument         | Beschreibung                                               |
| ---------------- | ---------------------------------------------------------- |
| `<api-key>`      | Ihr Cast Operations-API-Schlüssel (z. B. `sk-your-api-key`)      |
| `<instance-url>` | Ihre Cast Operations-Instanz-URL (z. B. `https://visca.ai`) |

**Optionen:**

| Option                  | Beschreibung                                    |
| ----------------------- | ----------------------------------------------- |
| `--context-name <name>` | Name für diesen Kontext (Standard: `"default"`) |

**Beispiele:**

```bash
# Mit Standard-Kontext anmelden
cast-operations login sk-abc123 https://visca.ai

# Mit benanntem Kontext anmelden
cast-operations login sk-abc123 https://visca.ai --context-name production

# Mehrere Umgebungen einrichten
cast-operations login sk-prod-key https://visca.ai --context-name production
cast-operations login sk-staging-key https://staging.visca.ai --context-name staging
```

## Kontexte

Kontexte ermöglichen Ihnen das Speichern und Wechseln zwischen mehreren Cast Operations-Umgebungen (z. B. Produktion, Staging, Entwicklung).

### Kontexte auflisten

```bash
cast-operations context list
```

Zeigt alle konfigurierten Kontexte an. Der aktuelle Kontext ist mit `*` markiert.

### Kontext wechseln

```bash
cast-operations context use <name>
```

Wechselt zu einem anderen benannten Kontext für alle nachfolgenden Befehle.

```bash
# Zu Staging wechseln
cast-operations context use staging

# Zu Produktion wechseln
cast-operations context use production
```

### Aktuellen Kontext anzeigen

```bash
cast-operations context current
```

Zeigt den aktuell aktiven Kontext an, einschließlich der Instanz-URL und eines maskierten API-Schlüssels.

### Einen Kontext löschen

```bash
cast-operations context delete <name>
```

Entfernt einen benannten Kontext. Wenn der gelöschte Kontext der aktuelle ist, wechselt die CLI automatisch zum ersten verbleibenden Kontext.

## Auflösung von Anmeldedaten

Anmeldedaten werden in der folgenden Prioritätsreihenfolge aufgelöst:

1. **CLI-Flags** (`--api-key` und `--url`)
2. **Umgebungsvariablen** (`CAST_OPERATIONS_API_KEY` und `CAST_OPERATIONS_URL`)
3. **Benannter Kontext** (über `--context`-Flag)
4. **Aktueller Kontext** (aus gespeicherter Konfiguration)

Sie können Quellen mischen – verwenden Sie beispielsweise eine Umgebungsvariable für den API-Schlüssel und einen gespeicherten Kontext für die URL.

### CLI-Flags verwenden

```bash
cast-operations --api-key sk-abc123 --url https://visca.ai incident list
```

### Umgebungsvariablen verwenden

```bash
export CAST_OPERATIONS_API_KEY=sk-abc123
export CAST_OPERATIONS_URL=https://visca.ai

cast-operations incident list
```

### Einen spezifischen Kontext verwenden

```bash
cast-operations --context production incident list
```

## Authentifizierung verifizieren

Prüfen Sie Ihren aktuellen Authentifizierungsstatus:

```bash
cast-operations whoami
```

Dies zeigt:

- Instanz-URL
- Maskierter API-Schlüssel
- Aktueller Kontextname (nur angezeigt, wenn ein gespeicherter Kontext aktiv ist)

Falls nicht authentifiziert, zeigt der Befehl eine hilfreiche Meldung mit dem Vorschlag, `cast-operations login` auszuführen.

## Konfigurationsdatei

Anmeldedaten werden in `~/.cast-operations/config.json` mit eingeschränkten Berechtigungen (`0600`) gespeichert.

```json
{
  "currentContext": "production",
  "contexts": {
    "production": {
      "name": "production",
      "apiUrl": "https://visca.ai",
      "apiKey": "sk-..."
    },
    "staging": {
      "name": "staging",
      "apiUrl": "https://staging.visca.ai",
      "apiKey": "sk-..."
    }
  },
  "defaults": {
    "output": "table",
    "limit": 10
  }
}
```
