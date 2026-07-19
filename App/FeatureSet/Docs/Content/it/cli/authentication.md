# Autenticazione

La CLI di Cast Operations supporta più modalità di autenticazione con la tua istanza Cast Operations. Puoi utilizzare contesti denominati, variabili d'ambiente o passare le credenziali direttamente come flag.

## Login

Autentica con la tua istanza Cast Operations usando una chiave API:

```bash
cast-operations login <api-key> <instance-url>
```

**Argomenti:**

| Argomento        | Descrizione                                                     |
| ---------------- | --------------------------------------------------------------- |
| `<api-key>`      | La tua chiave API Cast Operations (es. `sk-your-api-key`)             |
| `<instance-url>` | L'URL della tua istanza Cast Operations (es. `https://visca.ai`) |

**Opzioni:**

| Opzione                 | Descrizione                                         |
| ----------------------- | --------------------------------------------------- |
| `--context-name <name>` | Nome per questo contesto (predefinito: `"default"`) |

**Esempi:**

```bash
# Login con contesto predefinito
cast-operations login sk-abc123 https://visca.ai

# Login con un contesto denominato
cast-operations login sk-abc123 https://visca.ai --context-name production

# Configurazione di più ambienti
cast-operations login sk-prod-key https://visca.ai --context-name production
cast-operations login sk-staging-key https://staging.visca.ai --context-name staging
```

## Contesti

I contesti ti consentono di salvare e passare tra più ambienti Cast Operations (es. produzione, staging, sviluppo).

### Elenca i Contesti

```bash
cast-operations context list
```

Mostra tutti i contesti configurati. Il contesto corrente è contrassegnato con `*`.

### Cambia Contesto

```bash
cast-operations context use <name>
```

Passa a un contesto denominato diverso per tutti i comandi successivi.

```bash
# Passa a staging
cast-operations context use staging

# Passa a produzione
cast-operations context use production
```

### Visualizza il Contesto Corrente

```bash
cast-operations context current
```

Mostra il contesto attualmente attivo, incluso l'URL dell'istanza e una chiave API mascherata.

### Elimina un Contesto

```bash
cast-operations context delete <name>
```

Rimuove un contesto denominato. Se il contesto eliminato è quello corrente, la CLI passa automaticamente al primo contesto rimanente.

## Risoluzione delle Credenziali

Le credenziali vengono risolte nel seguente ordine di priorità:

1. **Flag CLI** (`--api-key` e `--url`)
2. **Variabili d'ambiente** (`CAST_OPERATIONS_API_KEY` e `CAST_OPERATIONS_URL`)
3. **Contesto denominato** (tramite flag `--context`)
4. **Contesto corrente** (dalla configurazione salvata)

Puoi combinare le fonti -- per esempio, usa una variabile d'ambiente per la chiave API e un contesto salvato per l'URL.

### Uso dei Flag CLI

```bash
cast-operations --api-key sk-abc123 --url https://visca.ai incident list
```

### Uso delle Variabili d'Ambiente

```bash
export CAST_OPERATIONS_API_KEY=sk-abc123
export CAST_OPERATIONS_URL=https://visca.ai

cast-operations incident list
```

### Uso di un Contesto Specifico

```bash
cast-operations --context production incident list
```

## Verifica dell'Autenticazione

Controlla lo stato di autenticazione corrente:

```bash
cast-operations whoami
```

Questo visualizza:

- URL dell'istanza
- Chiave API mascherata
- Nome del contesto corrente (mostrato solo se è attivo un contesto salvato)

Se non autenticato, il comando mostra un messaggio utile che suggerisce di eseguire `cast-operations login`.

## File di Configurazione

Le credenziali sono archiviate in `~/.cast-operations/config.json` con autorizzazioni limitate (`0600`).

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
