# Operazioni sulle Risorse

La CLI di Cast Operations fornisce operazioni CRUD (Create, Read, Update, Delete) complete per tutte le risorse supportate. Le risorse vengono auto-individuate dalla tua istanza Cast Operations.

## Risorse Disponibili

Esegui il seguente comando per vedere tutti i tipi di risorse disponibili:

```bash
cast-operations resources
```

Puoi filtrare per tipo:

```bash
# Mostra solo le risorse di database
cast-operations resources --type database

# Mostra solo le risorse di analytics
cast-operations resources --type analytics
```

Le risorse comuni includono:

| Risorsa                     | Comando                                 |
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

## Elenca le Risorse

Recupera un elenco di risorse con filtraggio, paginazione e ordinamento opzionali.

```bash
cast-operations <resource> list [options]
```

**Opzioni:**

| Opzione                 | Descrizione                    | Predefinito |
| ----------------------- | ------------------------------ | ----------- |
| `--query <json>`        | Criteri di filtro come JSON    | Nessuno     |
| `--limit <n>`           | Numero massimo di risultati    | `10`        |
| `--skip <n>`            | Numero di risultati da saltare | `0`         |
| `--sort <json>`         | Ordinamento come JSON          | Nessuno     |
| `-o, --output <format>` | Formato di output              | `table`     |

**Esempi:**

```bash
# Elenca i 10 incidenti più recenti
cast-operations incident list

# Filtra gli incidenti per ID di stato
cast-operations incident list --query '{"currentIncidentStateId":"<state-id>"}'

# Elenca con paginazione
cast-operations incident list --limit 20 --skip 40

# Ordina per data di creazione (decrescente)
cast-operations incident list --sort '{"createdAt":-1}'

# Output come JSON
cast-operations incident list -o json
```

## Ottieni una Risorsa

Recupera una singola risorsa tramite il suo ID.

```bash
cast-operations <resource> get <id>
```

**Argomenti:**

| Argomento | Descrizione               |
| --------- | ------------------------- |
| `<id>`    | L'ID della risorsa (UUID) |

**Esempi:**

```bash
# Ottieni un incidente specifico
cast-operations incident get 550e8400-e29b-41d4-a716-446655440000

# Ottieni un monitor come JSON
cast-operations monitor get abc-123 -o json
```

## Crea una Risorsa

Crea una nuova risorsa da JSON inline o da un file.

```bash
cast-operations <resource> create [options]
```

**Opzioni:**

| Opzione                 | Descrizione                                             |
| ----------------------- | ------------------------------------------------------- |
| `--data <json>`         | Dati della risorsa come oggetto JSON                    |
| `--file <path>`         | Percorso a un file JSON contenente i dati della risorsa |
| `-o, --output <format>` | Formato di output                                       |

Devi fornire `--data` o `--file`.

**Esempi:**

```bash
# Crea un incidente con JSON inline
cast-operations incident create --data '{"title":"API Outage","currentIncidentStateId":"<state-id>","incidentSeverityId":"<severity-id>","declaredAt":"2025-01-15T10:30:00Z"}'

# Crea da un file JSON
cast-operations incident create --file incident.json

# Crea e output come JSON per catturare l'ID
cast-operations monitor create --data '{"name":"API Health Check"}' -o json
```

## Aggiorna una Risorsa

Aggiorna una risorsa esistente tramite ID.

```bash
cast-operations <resource> update <id> [options]
```

**Argomenti:**

| Argomento | Descrizione        |
| --------- | ------------------ |
| `<id>`    | L'ID della risorsa |

**Opzioni:**

| Opzione                 | Descrizione                                  |
| ----------------------- | -------------------------------------------- |
| `--data <json>`         | Campi da aggiornare come JSON (obbligatorio) |
| `-o, --output <format>` | Formato di output                            |

**Esempi:**

```bash
# Cambia lo stato dell'incidente (es. a risolto)
cast-operations incident update abc-123 --data '{"currentIncidentStateId":"<resolved-state-id>"}'

# Rinomina un monitor
cast-operations monitor update abc-123 --data '{"name":"Updated Monitor Name"}'
```

## Elimina una Risorsa

Elimina una risorsa tramite ID.

```bash
cast-operations <resource> delete <id> [--force]
```

**Argomenti:**

| Argomento | Descrizione        |
| --------- | ------------------ |
| `<id>`    | L'ID della risorsa |

**Opzioni:**

| Opzione   | Descrizione                    |
| --------- | ------------------------------ |
| `--force` | Salta la richiesta di conferma |

**Esempi:**

```bash
cast-operations incident delete abc-123
cast-operations monitor delete 550e8400-e29b-41d4-a716-446655440000

# Salta la conferma
cast-operations monitor delete 550e8400-e29b-41d4-a716-446655440000 --force
```

## Conta le Risorse

Conta le risorse che corrispondono a criteri di filtro opzionali.

```bash
cast-operations <resource> count [options]
```

**Opzioni:**

| Opzione          | Descrizione                 |
| ---------------- | --------------------------- |
| `--query <json>` | Criteri di filtro come JSON |

**Esempi:**

```bash
# Conta tutti gli incidenti
cast-operations incident count

# Conta gli incidenti per stato
cast-operations incident count --query '{"currentIncidentStateId":"<state-id>"}'

# Conta i monitor
cast-operations monitor count
```

## Risorse di Analytics

Le risorse di analytics supportano un insieme limitato di operazioni rispetto alle risorse di database:

| Operazione | Supportata |
| ---------- | ---------- |
| `list`     | Sì         |
| `create`   | Sì         |
| `count`    | Sì         |
| `get`      | No         |
| `update`   | No         |
| `delete`   | No         |

Usa `cast-operations resources --type analytics` per vedere quali risorse di analytics sono disponibili sulla tua istanza.
