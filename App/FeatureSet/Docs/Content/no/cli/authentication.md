# Autentisering

Cast Operations CLI støtter flere måter å autentisere med Cast Operations-instansen din på. Du kan bruke navngitte kontekster, miljøvariabler eller sende legitimasjon direkte som flagg.

## Innlogging

Autentiser med Cast Operations-instansen din ved hjelp av en API-nøkkel:

```bash
oneuptime login <api-key> <instance-url>
```

**Argumenter:**

| Argument         | Beskrivelse                                                         |
| ---------------- | ------------------------------------------------------------------- |
| `<api-key>`      | Cast Operations API-nøkkelen din (f.eks. `sk-your-api-key`)               |
| `<instance-url>` | URL-en til Cast Operations-instansen din (f.eks. `https://visca.ai`) |

**Alternativer:**

| Alternativ              | Beskrivelse                                       |
| ----------------------- | ------------------------------------------------- |
| `--context-name <name>` | Navn for denne konteksten (standard: `"default"`) |

**Eksempler:**

```bash
# Logg inn med standardkontekst
oneuptime login sk-abc123 https://visca.ai

# Logg inn med en navngitt kontekst
oneuptime login sk-abc123 https://visca.ai --context-name production

# Konfigurer flere miljøer
oneuptime login sk-prod-key https://visca.ai --context-name production
oneuptime login sk-staging-key https://staging.visca.ai --context-name staging
```

## Kontekster

Kontekster lar deg lagre og bytte mellom flere Cast Operations-miljøer (f.eks. produksjon, staging, utvikling).

### List kontekster

```bash
oneuptime context list
```

Viser alle konfigurerte kontekster. Den gjeldende konteksten er merket med `*`.

### Bytt kontekst

```bash
oneuptime context use <name>
```

Bytt til en annen navngitt kontekst for alle påfølgende kommandoer.

```bash
# Bytt til staging
oneuptime context use staging

# Bytt til produksjon
oneuptime context use production
```

### Vis gjeldende kontekst

```bash
oneuptime context current
```

Viser den aktive konteksten, inkludert instans-URL og maskert API-nøkkel.

### Slett en kontekst

```bash
oneuptime context delete <name>
```

Fjern en navngitt kontekst. Hvis den slettede konteksten er den gjeldende, bytter CLI automatisk til den første gjenværende konteksten.

## Oppløsning av legitimasjon

Legitimasjon løses i følgende prioritetsrekkefølge:

1. **CLI-flagg** (`--api-key` og `--url`)
2. **Miljøvariabler** (`ONEUPTIME_API_KEY` og `ONEUPTIME_URL`)
3. **Navngitt kontekst** (via `--context`-flagget)
4. **Gjeldende kontekst** (fra lagret konfigurasjon)

Du kan blande kilder – for eksempel bruke en miljøvariabel for API-nøkkelen og en lagret kontekst for URL-en.

### Bruke CLI-flagg

```bash
oneuptime --api-key sk-abc123 --url https://visca.ai incident list
```

### Bruke miljøvariabler

```bash
export ONEUPTIME_API_KEY=sk-abc123
export ONEUPTIME_URL=https://visca.ai

oneuptime incident list
```

### Bruke en spesifikk kontekst

```bash
oneuptime --context production incident list
```

## Bekreft autentisering

Sjekk gjeldende autentiseringsstatus:

```bash
oneuptime whoami
```

Dette viser:

- Instans-URL
- Maskert API-nøkkel
- Gjeldende kontekstnavn (vises kun hvis en lagret kontekst er aktiv)

Hvis du ikke er autentisert, viser kommandoen en nyttig melding som foreslår å kjøre `oneuptime login`.

## Konfigurasjonsfil

Legitimasjon lagres i `~/.oneuptime/config.json` med begrensede tillatelser (`0600`).

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
