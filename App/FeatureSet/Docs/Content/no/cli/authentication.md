# Autentisering

Cast Operations CLI støtter flere måter å autentisere med Cast Operations-instansen din på. Du kan bruke navngitte kontekster, miljøvariabler eller sende legitimasjon direkte som flagg.

## Innlogging

Autentiser med Cast Operations-instansen din ved hjelp av en API-nøkkel:

```bash
cast-operations login <api-key> <instance-url>
```

**Argumenter:**

| Argument         | Beskrivelse                                                         |
| ---------------- | ------------------------------------------------------------------- |
| `<api-key>`      | Cast Operations API-nøkkelen din (f.eks. `sk-your-api-key`)               |
| `<instance-url>` | URL-en til Cast Operations-instansen din (f.eks. `https://latticeruntime.com`) |

**Alternativer:**

| Alternativ              | Beskrivelse                                       |
| ----------------------- | ------------------------------------------------- |
| `--context-name <name>` | Navn for denne konteksten (standard: `"default"`) |

**Eksempler:**

```bash
# Logg inn med standardkontekst
cast-operations login sk-abc123 https://latticeruntime.com

# Logg inn med en navngitt kontekst
cast-operations login sk-abc123 https://latticeruntime.com --context-name production

# Konfigurer flere miljøer
cast-operations login sk-prod-key https://latticeruntime.com --context-name production
cast-operations login sk-staging-key https://staging.latticeruntime.com --context-name staging
```

## Kontekster

Kontekster lar deg lagre og bytte mellom flere Cast Operations-miljøer (f.eks. produksjon, staging, utvikling).

### List kontekster

```bash
cast-operations context list
```

Viser alle konfigurerte kontekster. Den gjeldende konteksten er merket med `*`.

### Bytt kontekst

```bash
cast-operations context use <name>
```

Bytt til en annen navngitt kontekst for alle påfølgende kommandoer.

```bash
# Bytt til staging
cast-operations context use staging

# Bytt til produksjon
cast-operations context use production
```

### Vis gjeldende kontekst

```bash
cast-operations context current
```

Viser den aktive konteksten, inkludert instans-URL og maskert API-nøkkel.

### Slett en kontekst

```bash
cast-operations context delete <name>
```

Fjern en navngitt kontekst. Hvis den slettede konteksten er den gjeldende, bytter CLI automatisk til den første gjenværende konteksten.

## Oppløsning av legitimasjon

Legitimasjon løses i følgende prioritetsrekkefølge:

1. **CLI-flagg** (`--api-key` og `--url`)
2. **Miljøvariabler** (`CAST_OPERATIONS_API_KEY` og `CAST_OPERATIONS_URL`)
3. **Navngitt kontekst** (via `--context`-flagget)
4. **Gjeldende kontekst** (fra lagret konfigurasjon)

Du kan blande kilder – for eksempel bruke en miljøvariabel for API-nøkkelen og en lagret kontekst for URL-en.

### Bruke CLI-flagg

```bash
cast-operations --api-key sk-abc123 --url https://latticeruntime.com incident list
```

### Bruke miljøvariabler

```bash
export CAST_OPERATIONS_API_KEY=sk-abc123
export CAST_OPERATIONS_URL=https://latticeruntime.com

cast-operations incident list
```

### Bruke en spesifikk kontekst

```bash
cast-operations --context production incident list
```

## Bekreft autentisering

Sjekk gjeldende autentiseringsstatus:

```bash
cast-operations whoami
```

Dette viser:

- Instans-URL
- Maskert API-nøkkel
- Gjeldende kontekstnavn (vises kun hvis en lagret kontekst er aktiv)

Hvis du ikke er autentisert, viser kommandoen en nyttig melding som foreslår å kjøre `cast-operations login`.

## Konfigurasjonsfil

Legitimasjon lagres i `~/.cast-operations/config.json` med begrensede tillatelser (`0600`).

```json
{
  "currentContext": "production",
  "contexts": {
    "production": {
      "name": "production",
      "apiUrl": "https://latticeruntime.com",
      "apiKey": "sk-..."
    },
    "staging": {
      "name": "staging",
      "apiUrl": "https://staging.latticeruntime.com",
      "apiKey": "sk-..."
    }
  },
  "defaults": {
    "output": "table",
    "limit": 10
  }
}
```
