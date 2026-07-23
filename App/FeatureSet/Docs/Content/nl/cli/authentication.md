# Authenticatie

De Cast Operations CLI ondersteunt meerdere manieren om te authenticeren bij uw Cast Operations-instantie. U kunt gebruik maken van benoemde contexten, omgevingsvariabelen of inloggegevens rechtstreeks als vlaggen opgeven.

## Inloggen

Authenticeer bij uw Cast Operations-instantie met een API-sleutel:

```bash
cast-operations login <api-key> <instance-url>
```

**Argumenten:**

| Argument         | Beschrijving                                                      |
| ---------------- | ----------------------------------------------------------------- |
| `<api-key>`      | Uw Cast Operations API-sleutel (bijv. `sk-your-api-key`)                |
| `<instance-url>` | De URL van uw Cast Operations-instantie (bijv. `https://latticeruntime.com`) |

**Opties:**

| Optie                   | Beschrijving                                    |
| ----------------------- | ----------------------------------------------- |
| `--context-name <name>` | Naam voor deze context (standaard: `"default"`) |

**Voorbeelden:**

```bash
# Inloggen met standaardcontext
cast-operations login sk-abc123 https://latticeruntime.com

# Inloggen met een benoemde context
cast-operations login sk-abc123 https://latticeruntime.com --context-name production

# Meerdere omgevingen instellen
cast-operations login sk-prod-key https://latticeruntime.com --context-name production
cast-operations login sk-staging-key https://staging.latticeruntime.com --context-name staging
```

## Contexten

Met contexten kunt u meerdere Cast Operations-omgevingen opslaan en ertussen schakelen (bijv. productie, staging, ontwikkeling).

### Contexten weergeven

```bash
cast-operations context list
```

Geeft alle geconfigureerde contexten weer. De huidige context is gemarkeerd met `*`.

### Schakelen van context

```bash
cast-operations context use <name>
```

Schakel over naar een andere benoemde context voor alle volgende opdrachten.

```bash
# Overschakelen naar staging
cast-operations context use staging

# Overschakelen naar productie
cast-operations context use production
```

### Huidige context bekijken

```bash
cast-operations context current
```

Geeft de momenteel actieve context weer, inclusief de instantie-URL en een gemaskeerde API-sleutel.

### Een context verwijderen

```bash
cast-operations context delete <name>
```

Verwijder een benoemde context. Als de verwijderde context de huidige is, schakelt de CLI automatisch over naar de eerste resterende context.

## Inloggegevensresolutie

Inloggegevens worden opgelost in de volgende prioriteitsvolgorde:

1. **CLI-vlaggen** (`--api-key` en `--url`)
2. **Omgevingsvariabelen** (`CAST_OPERATIONS_API_KEY` en `CAST_OPERATIONS_URL`)
3. **Benoemde context** (via `--context`-vlag)
4. **Huidige context** (uit opgeslagen configuratie)

U kunt bronnen combineren — gebruik bijvoorbeeld een omgevingsvariabele voor de API-sleutel en een opgeslagen context voor de URL.

### CLI-vlaggen gebruiken

```bash
cast-operations --api-key sk-abc123 --url https://latticeruntime.com incident list
```

### Omgevingsvariabelen gebruiken

```bash
export CAST_OPERATIONS_API_KEY=sk-abc123
export CAST_OPERATIONS_URL=https://latticeruntime.com

cast-operations incident list
```

### Een specifieke context gebruiken

```bash
cast-operations --context production incident list
```

## Authenticatie verifiëren

Controleer uw huidige authenticatiestatus:

```bash
cast-operations whoami
```

Dit geeft het volgende weer:

- Instantie-URL
- Gemaskeerde API-sleutel
- Naam van de huidige context (alleen weergegeven als een opgeslagen context actief is)

Als u niet bent geauthenticeerd, toont de opdracht een behulpzaam bericht met de suggestie `cast-operations login` uit te voeren.

## Configuratiebestand

Inloggegevens worden opgeslagen in `~/.cast-operations/config.json` met beperkte rechten (`0600`).

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
