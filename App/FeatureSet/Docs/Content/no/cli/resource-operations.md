# Ressursoperasjoner

Cast Operations CLI tilbyr full CRUD (Opprett, Les, Oppdater, Slett) for alle støttede ressurser. Ressurser oppdages automatisk fra Cast Operations-instansen din.

## Tilgjengelige ressurser

Kjør følgende kommando for å se alle tilgjengelige ressurstyper:

```bash
cast-operations resources
```

Du kan filtrere etter type:

```bash
# Vis kun databaseressurser
cast-operations resources --type database

# Vis kun analyseressurser
cast-operations resources --type analytics
```

Vanlige ressurser inkluderer:

| Ressurs                     | Kommando                                |
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

## List ressurser

Hent en liste over ressurser med valgfri filtrering, paginering og sortering.

```bash
cast-operations <resource> list [options]
```

**Alternativer:**

| Alternativ              | Beskrivelse                            | Standard |
| ----------------------- | -------------------------------------- | -------- |
| `--query <json>`        | Filterkriterier som JSON               | Ingen    |
| `--limit <n>`           | Maksimalt antall resultater            | `10`     |
| `--skip <n>`            | Antall resultater som skal hoppes over | `0`      |
| `--sort <json>`         | Sorteringsrekkefølge som JSON          | Ingen    |
| `-o, --output <format>` | Utdataformat                           | `table`  |

**Eksempler:**

```bash
# List de 10 siste hendelsene
cast-operations incident list

# Filtrer hendelser etter tilstands-ID
cast-operations incident list --query '{"currentIncidentStateId":"<state-id>"}'

# List med paginering
cast-operations incident list --limit 20 --skip 40

# Sorter etter opprettelsesdato (synkende)
cast-operations incident list --sort '{"createdAt":-1}'

# Utdata som JSON
cast-operations incident list -o json
```

## Hent en ressurs

Hent en enkelt ressurs etter ID.

```bash
cast-operations <resource> get <id>
```

**Argumenter:**

| Argument | Beskrivelse          |
| -------- | -------------------- |
| `<id>`   | Ressurs-ID-en (UUID) |

**Eksempler:**

```bash
# Hent en spesifikk hendelse
cast-operations incident get 550e8400-e29b-41d4-a716-446655440000

# Hent en monitor som JSON
cast-operations monitor get abc-123 -o json
```

## Opprett en ressurs

Opprett en ny ressurs fra innebygd JSON eller en fil.

```bash
cast-operations <resource> create [options]
```

**Alternativer:**

| Alternativ              | Beskrivelse                         |
| ----------------------- | ----------------------------------- |
| `--data <json>`         | Ressursdata som et JSON-objekt      |
| `--file <path>`         | Sti til en JSON-fil med ressursdata |
| `-o, --output <format>` | Utdataformat                        |

Du må oppgi enten `--data` eller `--file`.

**Eksempler:**

```bash
# Opprett en hendelse med innebygd JSON
cast-operations incident create --data '{"title":"API Outage","currentIncidentStateId":"<state-id>","incidentSeverityId":"<severity-id>","declaredAt":"2025-01-15T10:30:00Z"}'

# Opprett fra en JSON-fil
cast-operations incident create --file incident.json

# Opprett og skriv ut som JSON for å fange ID-en
cast-operations monitor create --data '{"name":"API Health Check"}' -o json
```

## Oppdater en ressurs

Oppdater en eksisterende ressurs etter ID.

```bash
cast-operations <resource> update <id> [options]
```

**Argumenter:**

| Argument | Beskrivelse   |
| -------- | ------------- |
| `<id>`   | Ressurs-ID-en |

**Alternativer:**

| Alternativ              | Beskrivelse                                 |
| ----------------------- | ------------------------------------------- |
| `--data <json>`         | Felt som skal oppdateres som JSON (påkrevd) |
| `-o, --output <format>` | Utdataformat                                |

**Eksempler:**

```bash
# Endre hendelsestilstand (f.eks. til løst)
cast-operations incident update abc-123 --data '{"currentIncidentStateId":"<resolved-state-id>"}'

# Endre navn på en monitor
cast-operations monitor update abc-123 --data '{"name":"Updated Monitor Name"}'
```

## Slett en ressurs

Slett en ressurs etter ID.

```bash
cast-operations <resource> delete <id> [--force]
```

**Argumenter:**

| Argument | Beskrivelse   |
| -------- | ------------- |
| `<id>`   | Ressurs-ID-en |

**Alternativer:**

| Alternativ | Beskrivelse                    |
| ---------- | ------------------------------ |
| `--force`  | Hopp over bekreftelsesprompten |

**Eksempler:**

```bash
cast-operations incident delete abc-123
cast-operations monitor delete 550e8400-e29b-41d4-a716-446655440000

# Hopp over bekreftelse
cast-operations monitor delete 550e8400-e29b-41d4-a716-446655440000 --force
```

## Tell ressurser

Tell ressurser som matcher valgfrie filterkriterier.

```bash
cast-operations <resource> count [options]
```

**Alternativer:**

| Alternativ       | Beskrivelse              |
| ---------------- | ------------------------ |
| `--query <json>` | Filterkriterier som JSON |

**Eksempler:**

```bash
# Tell alle hendelser
cast-operations incident count

# Tell hendelser etter tilstand
cast-operations incident count --query '{"currentIncidentStateId":"<state-id>"}'

# Tell monitorer
cast-operations monitor count
```

## Analyseressurser

Analyseressurser støtter et begrenset sett med operasjoner sammenlignet med databaseressurser:

| Operasjon | Støttet |
| --------- | ------- |
| `list`    | Ja      |
| `create`  | Ja      |
| `count`   | Ja      |
| `get`     | Nei     |
| `update`  | Nei     |
| `delete`  | Nei     |

Bruk `cast-operations resources --type analytics` for å se hvilke analyseressurser som er tilgjengelige på instansen din.
