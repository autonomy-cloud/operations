# Autentisering

Cast Operations CLI stöder flera sätt att autentisera mot din Cast Operations-instans. Du kan använda namngivna kontexter, miljövariabler eller skicka autentiseringsuppgifter direkt som flaggor.

## Inloggning

Autentisera mot din Cast Operations-instans med en API-nyckel:

```bash
cast-operations login <api-key> <instance-url>
```

**Argument:**

| Argument         | Beskrivning                                                       |
| ---------------- | ----------------------------------------------------------------- |
| `<api-key>`      | Din Cast Operations API-nyckel (t.ex. `sk-your-api-key`)                |
| `<instance-url>` | URL:en till din Cast Operations-instans (t.ex. `https://latticeruntime.com`) |

**Alternativ:**

| Alternativ              | Beskrivning                                    |
| ----------------------- | ---------------------------------------------- |
| `--context-name <name>` | Namn för denna kontext (standard: `"default"`) |

**Exempel:**

```bash
# Logga in med standardkontext
cast-operations login sk-abc123 https://latticeruntime.com

# Logga in med en namngiven kontext
cast-operations login sk-abc123 https://latticeruntime.com --context-name production

# Konfigurera flera miljöer
cast-operations login sk-prod-key https://latticeruntime.com --context-name production
cast-operations login sk-staging-key https://staging.latticeruntime.com --context-name staging
```

## Kontexter

Kontexter gör det möjligt att spara och växla mellan flera Cast Operations-miljöer (t.ex. produktion, staging, utveckling).

### Lista kontexter

```bash
cast-operations context list
```

Visar alla konfigurerade kontexter. Den aktiva kontexten markeras med `*`.

### Byt kontext

```bash
cast-operations context use <name>
```

Byt till en annan namngiven kontext för alla efterföljande kommandon.

```bash
# Byt till staging
cast-operations context use staging

# Byt till produktion
cast-operations context use production
```

### Visa aktuell kontext

```bash
cast-operations context current
```

Visar den aktuellt aktiva kontexten, inklusive instans-URL:en och en maskerad API-nyckel.

### Ta bort en kontext

```bash
cast-operations context delete <name>
```

Ta bort en namngiven kontext. Om den borttagna kontexten är den aktiva växlar CLI automatiskt till den första kvarvarande kontexten.

## Lösning av autentiseringsuppgifter

Autentiseringsuppgifter löses i följande prioritetsordning:

1. **CLI-flaggor** (`--api-key` och `--url`)
2. **Miljövariabler** (`CAST_OPERATIONS_API_KEY` och `CAST_OPERATIONS_URL`)
3. **Namngiven kontext** (via `--context`-flaggan)
4. **Aktuell kontext** (från sparad konfiguration)

Du kan blanda källor – till exempel använda en miljövariabel för API-nyckeln och en sparad kontext för URL:en.

### Använda CLI-flaggor

```bash
cast-operations --api-key sk-abc123 --url https://latticeruntime.com incident list
```

### Använda miljövariabler

```bash
export CAST_OPERATIONS_API_KEY=sk-abc123
export CAST_OPERATIONS_URL=https://latticeruntime.com

cast-operations incident list
```

### Använda en specifik kontext

```bash
cast-operations --context production incident list
```

## Verifiera autentisering

Kontrollera din aktuella autentiseringsstatus:

```bash
cast-operations whoami
```

Detta visar:

- Instans-URL
- Maskerad API-nyckel
- Aktuellt kontextnamn (visas bara om en sparad kontext är aktiv)

Om du inte är autentiserad visar kommandot ett hjälpsamt meddelande som föreslår att du kör `cast-operations login`.

## Konfigurationsfil

Autentiseringsuppgifter lagras i `~/.cast-operations/config.json` med begränsade behörigheter (`0600`).

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
