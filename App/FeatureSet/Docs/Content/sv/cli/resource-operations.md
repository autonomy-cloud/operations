# Resursoperationer

Cast Operations CLI erbjuder fullständiga CRUD-operationer (Skapa, Läs, Uppdatera, Ta bort) för alla resurser som stöds. Resurser identifieras automatiskt från din Cast Operations-instans.

## Tillgängliga resurser

Kör följande kommando för att se alla tillgängliga resurstyper:

```bash
cast-operations resources
```

Du kan filtrera efter typ:

```bash
# Visa bara databasresurser
cast-operations resources --type database

# Visa bara analysresurser
cast-operations resources --type analytics
```

Vanliga resurser inkluderar:

| Resurs                   | Kommando                                |
| ------------------------ | --------------------------------------- |
| Incident                 | `cast-operations incident`                    |
| Varning                  | `cast-operations alert`                       |
| Monitor                  | `cast-operations monitor`                     |
| Monitorstatus            | `cast-operations monitor-status`              |
| Incidenttillstånd        | `cast-operations incident-state`              |
| Statussida               | `cast-operations status-page`                 |
| Jour-policy              | `cast-operations on-call-policy`              |
| Team                     | `cast-operations team`                        |
| Planerat underhållsevent | `cast-operations scheduled-maintenance-event` |

## Lista resurser

Hämta en lista med resurser med valfri filtrering, sidnumrering och sortering.

```bash
cast-operations <resource> list [options]
```

**Alternativ:**

| Alternativ              | Beskrivning                   | Standard |
| ----------------------- | ----------------------------- | -------- |
| `--query <json>`        | Filterkriterier som JSON      | Inget    |
| `--limit <n>`           | Maximalt antal resultat       | `10`     |
| `--skip <n>`            | Antal resultat att hoppa över | `0`      |
| `--sort <json>`         | Sorteringsordning som JSON    | Inget    |
| `-o, --output <format>` | Utdataformat                  | `table`  |

**Exempel:**

```bash
# Lista de 10 senaste incidenterna
cast-operations incident list

# Filtrera incidenter efter tillstånds-ID
cast-operations incident list --query '{"currentIncidentStateId":"<state-id>"}'

# Lista med sidnumrering
cast-operations incident list --limit 20 --skip 40

# Sortera efter skapandedatum (fallande)
cast-operations incident list --sort '{"createdAt":-1}'

# Utdata som JSON
cast-operations incident list -o json
```

## Hämta en resurs

Hämta en enskild resurs med dess ID.

```bash
cast-operations <resource> get <id>
```

**Argument:**

| Argument | Beskrivning        |
| -------- | ------------------ |
| `<id>`   | Resurs-ID:t (UUID) |

**Exempel:**

```bash
# Hämta en specifik incident
cast-operations incident get 550e8400-e29b-41d4-a716-446655440000

# Hämta en monitor som JSON
cast-operations monitor get abc-123 -o json
```

## Skapa en resurs

Skapa en ny resurs från inline-JSON eller en fil.

```bash
cast-operations <resource> create [options]
```

**Alternativ:**

| Alternativ              | Beskrivning                                       |
| ----------------------- | ------------------------------------------------- |
| `--data <json>`         | Resursdata som ett JSON-objekt                    |
| `--file <path>`         | Sökväg till en JSON-fil som innehåller resursdata |
| `-o, --output <format>` | Utdataformat                                      |

Du måste ange antingen `--data` eller `--file`.

**Exempel:**

```bash
# Skapa en incident med inline-JSON
cast-operations incident create --data '{"title":"API Outage","currentIncidentStateId":"<state-id>","incidentSeverityId":"<severity-id>","declaredAt":"2025-01-15T10:30:00Z"}'

# Skapa från en JSON-fil
cast-operations incident create --file incident.json

# Skapa och utdata som JSON för att fånga ID:t
cast-operations monitor create --data '{"name":"API Health Check"}' -o json
```

## Uppdatera en resurs

Uppdatera en befintlig resurs med ID.

```bash
cast-operations <resource> update <id> [options]
```

**Argument:**

| Argument | Beskrivning |
| -------- | ----------- |
| `<id>`   | Resurs-ID:t |

**Alternativ:**

| Alternativ              | Beskrivning                                |
| ----------------------- | ------------------------------------------ |
| `--data <json>`         | Fält att uppdatera som JSON (obligatorisk) |
| `-o, --output <format>` | Utdataformat                               |

**Exempel:**

```bash
# Ändra incidenttillstånd (t.ex. till löst)
cast-operations incident update abc-123 --data '{"currentIncidentStateId":"<resolved-state-id>"}'

# Byt namn på en monitor
cast-operations monitor update abc-123 --data '{"name":"Updated Monitor Name"}'
```

## Ta bort en resurs

Ta bort en resurs med ID.

```bash
cast-operations <resource> delete <id> [--force]
```

**Argument:**

| Argument | Beskrivning |
| -------- | ----------- |
| `<id>`   | Resurs-ID:t |

**Alternativ:**

| Alternativ | Beskrivning                  |
| ---------- | ---------------------------- |
| `--force`  | Hoppa över bekräftelseprompt |

**Exempel:**

```bash
cast-operations incident delete abc-123
cast-operations monitor delete 550e8400-e29b-41d4-a716-446655440000

# Hoppa över bekräftelse
cast-operations monitor delete 550e8400-e29b-41d4-a716-446655440000 --force
```

## Räkna resurser

Räkna resurser som matchar valfria filterkriterier.

```bash
cast-operations <resource> count [options]
```

**Alternativ:**

| Alternativ       | Beskrivning              |
| ---------------- | ------------------------ |
| `--query <json>` | Filterkriterier som JSON |

**Exempel:**

```bash
# Räkna alla incidenter
cast-operations incident count

# Räkna incidenter efter tillstånd
cast-operations incident count --query '{"currentIncidentStateId":"<state-id>"}'

# Räkna monitorer
cast-operations monitor count
```

## Analysresurser

Analysresurser stöder en begränsad uppsättning operationer jämfört med databasresurser:

| Operation | Stöds |
| --------- | ----- |
| `list`    | Ja    |
| `create`  | Ja    |
| `count`   | Ja    |
| `get`     | Nej   |
| `update`  | Nej   |
| `delete`  | Nej   |

Använd `cast-operations resources --type analytics` för att se vilka analysresurser som är tillgängliga i din instans.
