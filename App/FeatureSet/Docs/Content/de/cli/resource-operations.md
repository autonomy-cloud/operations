# Ressourcenvorgänge

Die Cast Operations CLI bietet vollständige CRUD-Vorgänge (Erstellen, Lesen, Aktualisieren, Löschen) für alle unterstützten Ressourcen. Ressourcen werden automatisch aus Ihrer Cast Operations-Instanz erkannt.

## Verfügbare Ressourcen

Führen Sie den folgenden Befehl aus, um alle verfügbaren Ressourcentypen anzuzeigen:

```bash
cast-operations resources
```

Sie können nach Typ filtern:

```bash
# Nur Datenbankressourcen anzeigen
cast-operations resources --type database

# Nur Analyseressourcen anzeigen
cast-operations resources --type analytics
```

Gängige Ressourcen umfassen:

| Ressource                   | Befehl                                  |
| --------------------------- | --------------------------------------- |
| Incident                    | `cast-operations incident`                    |
| Alert                       | `cast-operations alert`                       |
| Monitor                     | `cast-operations monitor`                     |
| Monitor Status              | `cast-operations monitor-status`              |
| Incident State              | `cast-operations incident-state`              |
| Status Page                 | `cast-operations status-page`                 |
| On-Call Policy              | `cast-operations on-call-policy`              |
| Team                        | `cast-operations team`                        |
| Scheduled Maintenance Event | `cast-operations scheduled-maintenance-event` |

## Ressourcen auflisten

Rufen Sie eine Liste von Ressourcen mit optionaler Filterung, Paginierung und Sortierung ab.

```bash
cast-operations <resource> list [options]
```

**Optionen:**

| Option                  | Beschreibung                         | Standard |
| ----------------------- | ------------------------------------ | -------- |
| `--query <json>`        | Filterkriterien als JSON             | Keiner   |
| `--limit <n>`           | Maximale Anzahl von Ergebnissen      | `10`     |
| `--skip <n>`            | Anzahl zu überspringender Ergebnisse | `0`      |
| `--sort <json>`         | Sortierreihenfolge als JSON          | Keiner   |
| `-o, --output <format>` | Ausgabeformat                        | `table`  |

**Beispiele:**

```bash
# Die 10 neuesten Incidents auflisten
cast-operations incident list

# Incidents nach Status-ID filtern
cast-operations incident list --query '{"currentIncidentStateId":"<state-id>"}'

# Mit Paginierung auflisten
cast-operations incident list --limit 20 --skip 40

# Nach Erstellungsdatum sortieren (absteigend)
cast-operations incident list --sort '{"createdAt":-1}'

# Als JSON ausgeben
cast-operations incident list -o json
```

## Eine Ressource abrufen

Eine einzelne Ressource nach ihrer ID abrufen.

```bash
cast-operations <resource> get <id>
```

**Argumente:**

| Argument | Beschreibung             |
| -------- | ------------------------ |
| `<id>`   | Die Ressourcen-ID (UUID) |

**Beispiele:**

```bash
# Einen bestimmten Incident abrufen
cast-operations incident get 550e8400-e29b-41d4-a716-446655440000

# Einen Monitor als JSON abrufen
cast-operations monitor get abc-123 -o json
```

## Eine Ressource erstellen

Eine neue Ressource aus eingebettetem JSON oder einer Datei erstellen.

```bash
cast-operations <resource> create [options]
```

**Optionen:**

| Option                  | Beschreibung                                 |
| ----------------------- | -------------------------------------------- |
| `--data <json>`         | Ressourcendaten als JSON-Objekt              |
| `--file <path>`         | Pfad zu einer JSON-Datei mit Ressourcendaten |
| `-o, --output <format>` | Ausgabeformat                                |

Sie müssen entweder `--data` oder `--file` angeben.

**Beispiele:**

```bash
# Einen Incident mit eingebettetem JSON erstellen
cast-operations incident create --data '{"title":"API Outage","currentIncidentStateId":"<state-id>","incidentSeverityId":"<severity-id>","declaredAt":"2025-01-15T10:30:00Z"}'

# Aus einer JSON-Datei erstellen
cast-operations incident create --file incident.json

# Erstellen und als JSON ausgeben, um die ID zu erfassen
cast-operations monitor create --data '{"name":"API Health Check"}' -o json
```

## Eine Ressource aktualisieren

Eine vorhandene Ressource nach ID aktualisieren.

```bash
cast-operations <resource> update <id> [options]
```

**Argumente:**

| Argument | Beschreibung      |
| -------- | ----------------- |
| `<id>`   | Die Ressourcen-ID |

**Optionen:**

| Option                  | Beschreibung                                      |
| ----------------------- | ------------------------------------------------- |
| `--data <json>`         | Zu aktualisierende Felder als JSON (erforderlich) |
| `-o, --output <format>` | Ausgabeformat                                     |

**Beispiele:**

```bash
# Incident-Status ändern (z. B. auf gelöst)
cast-operations incident update abc-123 --data '{"currentIncidentStateId":"<resolved-state-id>"}'

# Einen Monitor umbenennen
cast-operations monitor update abc-123 --data '{"name":"Updated Monitor Name"}'
```

## Eine Ressource löschen

Eine Ressource nach ID löschen.

```bash
cast-operations <resource> delete <id> [--force]
```

**Argumente:**

| Argument | Beschreibung      |
| -------- | ----------------- |
| `<id>`   | Die Ressourcen-ID |

**Optionen:**

| Option    | Beschreibung                          |
| --------- | ------------------------------------- |
| `--force` | Bestätigungsaufforderung überspringen |

**Beispiele:**

```bash
cast-operations incident delete abc-123
cast-operations monitor delete 550e8400-e29b-41d4-a716-446655440000

# Bestätigung überspringen
cast-operations monitor delete 550e8400-e29b-41d4-a716-446655440000 --force
```

## Ressourcen zählen

Ressourcen zählen, die optionalen Filterkriterien entsprechen.

```bash
cast-operations <resource> count [options]
```

**Optionen:**

| Option           | Beschreibung             |
| ---------------- | ------------------------ |
| `--query <json>` | Filterkriterien als JSON |

**Beispiele:**

```bash
# Alle Incidents zählen
cast-operations incident count

# Incidents nach Status zählen
cast-operations incident count --query '{"currentIncidentStateId":"<state-id>"}'

# Monitore zählen
cast-operations monitor count
```

## Analyseressourcen

Analyseressourcen unterstützen im Vergleich zu Datenbankressourcen einen eingeschränkten Satz von Vorgängen:

| Vorgang  | Unterstützt |
| -------- | ----------- |
| `list`   | Ja          |
| `create` | Ja          |
| `count`  | Ja          |
| `get`    | Nein        |
| `update` | Nein        |
| `delete` | Nein        |

Verwenden Sie `cast-operations resources --type analytics`, um zu sehen, welche Analyseressourcen auf Ihrer Instanz verfügbar sind.
