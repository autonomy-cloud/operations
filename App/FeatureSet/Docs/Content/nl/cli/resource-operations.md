# Resourcebewerkingen

De Cast Operations CLI biedt volledige CRUD-bewerkingen (Aanmaken, Lezen, Bijwerken, Verwijderen) voor alle ondersteunde resources. Resources worden automatisch gedetecteerd van uw Cast Operations-instantie.

## Beschikbare resources

Voer de volgende opdracht uit om alle beschikbare resourcetypen te bekijken:

```bash
cast-operations resources
```

U kunt filteren op type:

```bash
# Alleen databaseresources weergeven
cast-operations resources --type database

# Alleen analyticsresources weergeven
cast-operations resources --type analytics
```

Veelgebruikte resources zijn:

| Resource                      | Opdracht                                |
| ----------------------------- | --------------------------------------- |
| Incident                      | `cast-operations incident`                    |
| Melding                       | `cast-operations alert`                       |
| Monitor                       | `cast-operations monitor`                     |
| Monitorstatus                 | `cast-operations monitor-status`              |
| Incidentstatus                | `cast-operations incident-state`              |
| Statuspagina                  | `cast-operations status-page`                 |
| Piketbeleid                   | `cast-operations on-call-policy`              |
| Team                          | `cast-operations team`                        |
| Gepland onderhoudsgebeurtenis | `cast-operations scheduled-maintenance-event` |

## Resources weergeven

Haal een lijst van resources op met optioneel filteren, paginering en sortering.

```bash
cast-operations <resource> list [options]
```

**Opties:**

| Optie                   | Beschrijving                   | Standaard |
| ----------------------- | ------------------------------ | --------- |
| `--query <json>`        | Filtercriteria als JSON        | Geen      |
| `--limit <n>`           | Maximum aantal resultaten      | `10`      |
| `--skip <n>`            | Aantal te overslaan resultaten | `0`       |
| `--sort <json>`         | Sorteervolgorde als JSON       | Geen      |
| `-o, --output <format>` | Uitvoerformaat                 | `table`   |

**Voorbeelden:**

```bash
# De 10 meest recente incidenten weergeven
cast-operations incident list

# Incidenten filteren op status-ID
cast-operations incident list --query '{"currentIncidentStateId":"<state-id>"}'

# Weergeven met paginering
cast-operations incident list --limit 20 --skip 40

# Sorteren op aanmaakdatum (aflopend)
cast-operations incident list --sort '{"createdAt":-1}'

# Uitvoer als JSON
cast-operations incident list -o json
```

## Een resource ophalen

Haal één resource op aan de hand van het ID.

```bash
cast-operations <resource> get <id>
```

**Argumenten:**

| Argument | Beschrijving           |
| -------- | ---------------------- |
| `<id>`   | Het resource-ID (UUID) |

**Voorbeelden:**

```bash
# Een specifiek incident ophalen
cast-operations incident get 550e8400-e29b-41d4-a716-446655440000

# Een monitor ophalen als JSON
cast-operations monitor get abc-123 -o json
```

## Een resource aanmaken

Maak een nieuwe resource aan vanuit inline JSON of een bestand.

```bash
cast-operations <resource> create [options]
```

**Opties:**

| Optie                   | Beschrijving                                   |
| ----------------------- | ---------------------------------------------- |
| `--data <json>`         | Resourcegegevens als JSON-object               |
| `--file <path>`         | Pad naar een JSON-bestand met resourcegegevens |
| `-o, --output <format>` | Uitvoerformaat                                 |

U moet `--data` of `--file` opgeven.

**Voorbeelden:**

```bash
# Een incident aanmaken met inline JSON
cast-operations incident create --data '{"title":"API Outage","currentIncidentStateId":"<state-id>","incidentSeverityId":"<severity-id>","declaredAt":"2025-01-15T10:30:00Z"}'

# Aanmaken vanuit een JSON-bestand
cast-operations incident create --file incident.json

# Aanmaken en uitvoer als JSON om het ID te vast te leggen
cast-operations monitor create --data '{"name":"API Health Check"}' -o json
```

## Een resource bijwerken

Werk een bestaande resource bij aan de hand van het ID.

```bash
cast-operations <resource> update <id> [options]
```

**Argumenten:**

| Argument | Beschrijving    |
| -------- | --------------- |
| `<id>`   | Het resource-ID |

**Opties:**

| Optie                   | Beschrijving                            |
| ----------------------- | --------------------------------------- |
| `--data <json>`         | Bij te werken velden als JSON (vereist) |
| `-o, --output <format>` | Uitvoerformaat                          |

**Voorbeelden:**

```bash
# Incidentstatus wijzigen (bijv. naar opgelost)
cast-operations incident update abc-123 --data '{"currentIncidentStateId":"<resolved-state-id>"}'

# Een monitor hernoemen
cast-operations monitor update abc-123 --data '{"name":"Updated Monitor Name"}'
```

## Een resource verwijderen

Verwijder een resource aan de hand van het ID.

```bash
cast-operations <resource> delete <id> [--force]
```

**Argumenten:**

| Argument | Beschrijving    |
| -------- | --------------- |
| `<id>`   | Het resource-ID |

**Opties:**

| Optie     | Beschrijving                 |
| --------- | ---------------------------- |
| `--force` | Bevestigingsprompt overslaan |

**Voorbeelden:**

```bash
cast-operations incident delete abc-123
cast-operations monitor delete 550e8400-e29b-41d4-a716-446655440000

# Bevestiging overslaan
cast-operations monitor delete 550e8400-e29b-41d4-a716-446655440000 --force
```

## Resources tellen

Tel resources die voldoen aan optionele filtercriteria.

```bash
cast-operations <resource> count [options]
```

**Opties:**

| Optie            | Beschrijving            |
| ---------------- | ----------------------- |
| `--query <json>` | Filtercriteria als JSON |

**Voorbeelden:**

```bash
# Alle incidenten tellen
cast-operations incident count

# Incidenten tellen op status
cast-operations incident count --query '{"currentIncidentStateId":"<state-id>"}'

# Monitors tellen
cast-operations monitor count
```

## Analyticsresources

Analyticsresources ondersteunen een beperkte set bewerkingen vergeleken met databaseresources:

| Bewerking | Ondersteund |
| --------- | ----------- |
| `list`    | Ja          |
| `create`  | Ja          |
| `count`   | Ja          |
| `get`     | Nee         |
| `update`  | Nee         |
| `delete`  | Nee         |

Gebruik `cast-operations resources --type analytics` om te zien welke analyticsresources beschikbaar zijn op uw instantie.
