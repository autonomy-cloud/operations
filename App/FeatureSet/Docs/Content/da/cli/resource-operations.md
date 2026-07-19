# Ressourceoperationer

Cast Operations CLI leverer fulde CRUD-operationer (Opret, Læs, Opdater, Slet) for alle understøttede ressourcer. Ressourcer opdages automatisk fra din Cast Operations-instans.

## Tilgængelige ressourcer

Kør følgende kommando for at se alle tilgængelige ressourcetyper:

```bash
cast-operations resources
```

Du kan filtrere efter type:

```bash
# Vis kun databaseressourcer
cast-operations resources --type database

# Vis kun analyticsressourcer
cast-operations resources --type analytics
```

Almindelige ressourcer inkluderer:

| Ressource                   | Kommando                                |
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

## List ressourcer

Hent en liste over ressourcer med valgfri filtrering, paginering og sortering.

```bash
cast-operations <resource> list [options]
```

**Indstillinger:**

| Indstilling             | Beskrivelse                        | Standard |
| ----------------------- | ---------------------------------- | -------- |
| `--query <json>`        | Filterkriterier som JSON           | Ingen    |
| `--limit <n>`           | Maks. antal resultater             | `10`     |
| `--skip <n>`            | Antal resultater der springes over | `0`      |
| `--sort <json>`         | Sorteringsrækkefølge som JSON      | Ingen    |
| `-o, --output <format>` | Outputformat                       | `table`  |

**Eksempler:**

```bash
# List de 10 seneste incidents
cast-operations incident list

# Filtrer incidents efter tilstands-ID
cast-operations incident list --query '{"currentIncidentStateId":"<state-id>"}'

# List med paginering
cast-operations incident list --limit 20 --skip 40

# Sortér efter oprettelsesdato (faldende)
cast-operations incident list --sort '{"createdAt":-1}'

# Output som JSON
cast-operations incident list -o json
```

## Hent en ressource

Hent en enkelt ressource efter dens ID.

```bash
cast-operations <resource> get <id>
```

**Argumenter:**

| Argument | Beskrivelse            |
| -------- | ---------------------- |
| `<id>`   | Ressource-ID'et (UUID) |

**Eksempler:**

```bash
# Hent et specifikt incident
cast-operations incident get 550e8400-e29b-41d4-a716-446655440000

# Hent en monitor som JSON
cast-operations monitor get abc-123 -o json
```

## Opret en ressource

Opret en ny ressource fra inline JSON eller en fil.

```bash
cast-operations <resource> create [options]
```

**Indstillinger:**

| Indstilling             | Beskrivelse                           |
| ----------------------- | ------------------------------------- |
| `--data <json>`         | Ressourcedata som et JSON-objekt      |
| `--file <path>`         | Sti til en JSON-fil med ressourcedata |
| `-o, --output <format>` | Outputformat                          |

Du skal angive enten `--data` eller `--file`.

**Eksempler:**

```bash
# Opret et incident med inline JSON
cast-operations incident create --data '{"title":"API Outage","currentIncidentStateId":"<state-id>","incidentSeverityId":"<severity-id>","declaredAt":"2025-01-15T10:30:00Z"}'

# Opret fra en JSON-fil
cast-operations incident create --file incident.json

# Opret og output som JSON for at fange ID'et
cast-operations monitor create --data '{"name":"API Health Check"}' -o json
```

## Opdater en ressource

Opdater en eksisterende ressource efter ID.

```bash
cast-operations <resource> update <id> [options]
```

**Argumenter:**

| Argument | Beskrivelse     |
| -------- | --------------- |
| `<id>`   | Ressource-ID'et |

**Indstillinger:**

| Indstilling             | Beskrivelse                                   |
| ----------------------- | --------------------------------------------- |
| `--data <json>`         | Felter der skal opdateres som JSON (påkrævet) |
| `-o, --output <format>` | Outputformat                                  |

**Eksempler:**

```bash
# Skift incidenttilstand (f.eks. til løst)
cast-operations incident update abc-123 --data '{"currentIncidentStateId":"<resolved-state-id>"}'

# Omdøb en monitor
cast-operations monitor update abc-123 --data '{"name":"Updated Monitor Name"}'
```

## Slet en ressource

Slet en ressource efter ID.

```bash
cast-operations <resource> delete <id> [--force]
```

**Argumenter:**

| Argument | Beskrivelse     |
| -------- | --------------- |
| `<id>`   | Ressource-ID'et |

**Indstillinger:**

| Indstilling | Beskrivelse                    |
| ----------- | ------------------------------ |
| `--force`   | Spring bekræftelsesprompt over |

**Eksempler:**

```bash
cast-operations incident delete abc-123
cast-operations monitor delete 550e8400-e29b-41d4-a716-446655440000

# Spring bekræftelse over
cast-operations monitor delete 550e8400-e29b-41d4-a716-446655440000 --force
```

## Tæl ressourcer

Tæl ressourcer, der matcher valgfrie filterkriterier.

```bash
cast-operations <resource> count [options]
```

**Indstillinger:**

| Indstilling      | Beskrivelse              |
| ---------------- | ------------------------ |
| `--query <json>` | Filterkriterier som JSON |

**Eksempler:**

```bash
# Tæl alle incidents
cast-operations incident count

# Tæl incidents efter tilstand
cast-operations incident count --query '{"currentIncidentStateId":"<state-id>"}'

# Tæl monitorer
cast-operations monitor count
```

## Analytics-ressourcer

Analytics-ressourcer understøtter et begrænset sæt af operationer sammenlignet med databaseressourcer:

| Operation | Understøttet |
| --------- | ------------ |
| `list`    | Ja           |
| `create`  | Ja           |
| `count`   | Ja           |
| `get`     | Nej          |
| `update`  | Nej          |
| `delete`  | Nej          |

Brug `cast-operations resources --type analytics` for at se, hvilke analytics-ressourcer der er tilgængelige på din instans.
