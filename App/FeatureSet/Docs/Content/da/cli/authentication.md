# Autentificering

Cast Operations CLI understøtter flere måder at autentificere med din Cast Operations-instans på. Du kan bruge navngivne kontekster, miljøvariabler eller sende legitimationsoplysninger direkte som flag.

## Login

Autentificer med din Cast Operations-instans ved hjælp af en API-nøgle:

```bash
cast-operations login <api-key> <instance-url>
```

**Argumenter:**

| Argument         | Beskrivelse                                                       |
| ---------------- | ----------------------------------------------------------------- |
| `<api-key>`      | Din Cast Operations API-nøgle (f.eks. `sk-your-api-key`)                |
| `<instance-url>` | URL'en til din Cast Operations-instans (f.eks. `https://latticeruntime.com`) |

**Indstillinger:**

| Indstilling             | Beskrivelse                                     |
| ----------------------- | ----------------------------------------------- |
| `--context-name <name>` | Navn til denne kontekst (standard: `"default"`) |

**Eksempler:**

```bash
# Log ind med standardkontekst
cast-operations login sk-abc123 https://latticeruntime.com

# Log ind med en navngivet kontekst
cast-operations login sk-abc123 https://latticeruntime.com --context-name production

# Opsæt flere miljøer
cast-operations login sk-prod-key https://latticeruntime.com --context-name production
cast-operations login sk-staging-key https://staging.latticeruntime.com --context-name staging
```

## Kontekster

Kontekster giver dig mulighed for at gemme og skifte mellem flere Cast Operations-miljøer (f.eks. produktion, staging, udvikling).

### Liste over kontekster

```bash
cast-operations context list
```

Viser alle konfigurerede kontekster. Den aktuelle kontekst er markeret med `*`.

### Skift kontekst

```bash
cast-operations context use <name>
```

Skift til en anden navngivet kontekst for alle efterfølgende kommandoer.

```bash
# Skift til staging
cast-operations context use staging

# Skift til produktion
cast-operations context use production
```

### Vis aktuel kontekst

```bash
cast-operations context current
```

Viser den aktuelt aktive kontekst, herunder instans-URL og en maskeret API-nøgle.

### Slet en kontekst

```bash
cast-operations context delete <name>
```

Fjern en navngivet kontekst. Hvis den slettede kontekst er den aktuelle, skifter CLI automatisk til den første resterende kontekst.

## Løsning af legitimationsoplysninger

Legitimationsoplysninger løses i følgende prioritetsrækkefølge:

1. **CLI-flag** (`--api-key` og `--url`)
2. **Miljøvariabler** (`CAST_OPERATIONS_API_KEY` og `CAST_OPERATIONS_URL`)
3. **Navngivet kontekst** (via `--context`-flag)
4. **Aktuel kontekst** (fra gemt konfiguration)

Du kan blande kilder – brug f.eks. en miljøvariabel til API-nøglen og en gemt kontekst til URL'en.

### Brug af CLI-flag

```bash
cast-operations --api-key sk-abc123 --url https://latticeruntime.com incident list
```

### Brug af miljøvariabler

```bash
export CAST_OPERATIONS_API_KEY=sk-abc123
export CAST_OPERATIONS_URL=https://latticeruntime.com

cast-operations incident list
```

### Brug af en specifik kontekst

```bash
cast-operations --context production incident list
```

## Bekræft autentificering

Kontroller din aktuelle autentificeringsstatus:

```bash
cast-operations whoami
```

Dette viser:

- Instans-URL
- Maskeret API-nøgle
- Aktuel kontekstnavn (vises kun, hvis en gemt kontekst er aktiv)

Hvis ikke autentificeret, viser kommandoen en hjælpsom besked, der foreslår, at du kører `cast-operations login`.

## Konfigurationsfil

Legitimationsoplysninger gemmes i `~/.cast-operations/config.json` med begrænsede tilladelser (`0600`).

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
