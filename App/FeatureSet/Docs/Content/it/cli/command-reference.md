# Riferimento Comandi

Riferimento completo per tutti i comandi della CLI di Cast Operations.

## Comandi di Autenticazione

### `cast-operations login`

Autentica con un'istanza Cast Operations.

```bash
cast-operations login <api-key> <instance-url> [--context-name <name>]
```

| Parametro        | Tipo      | Richiesto | Descrizione                                  |
| ---------------- | --------- | --------- | -------------------------------------------- |
| `<api-key>`      | argomento | Sì        | Chiave API per l'autenticazione              |
| `<instance-url>` | argomento | Sì        | URL dell'istanza Cast Operations                   |
| `--context-name` | opzione   | No        | Nome del contesto (predefinito: `"default"`) |

---

### `cast-operations context list`

Elenca tutti i contesti salvati.

```bash
cast-operations context list
```

---

### `cast-operations context use`

Passa a un contesto denominato.

```bash
cast-operations context use <name>
```

| Parametro | Tipo      | Richiesto | Descrizione                   |
| --------- | --------- | --------- | ----------------------------- |
| `<name>`  | argomento | Sì        | Nome del contesto da attivare |

---

### `cast-operations context current`

Mostra il contesto attivo con la chiave API mascherata.

```bash
cast-operations context current
```

---

### `cast-operations context delete`

Rimuove un contesto salvato.

```bash
cast-operations context delete <name>
```

| Parametro | Tipo      | Richiesto | Descrizione                    |
| --------- | --------- | --------- | ------------------------------ |
| `<name>`  | argomento | Sì        | Nome del contesto da eliminare |

---

## Comandi sulle Risorse

Tutti i comandi sulle risorse seguono lo stesso schema. Sostituisci `<resource>` con qualsiasi nome di risorsa supportato (es. `incident`, `monitor`, `alert`, `status-page`).

### `cast-operations <resource> list`

Elenca le risorse con filtraggio e paginazione.

```bash
cast-operations <resource> list [options]
```

| Opzione          | Tipo    | Predefinito | Descrizione                 |
| ---------------- | ------- | ----------- | --------------------------- |
| `--query <json>` | stringa | Nessuno     | Criteri di filtro come JSON |
| `--limit <n>`    | numero  | `10`        | Numero massimo di risultati |
| `--skip <n>`     | numero  | `0`         | Risultati da saltare        |
| `--sort <json>`  | stringa | Nessuno     | Ordinamento come JSON       |
| `-o, --output`   | stringa | `table`     | Formato di output           |

---

### `cast-operations <resource> get`

Ottieni una singola risorsa tramite ID.

```bash
cast-operations <resource> get <id> [-o <format>]
```

| Parametro      | Tipo      | Richiesto | Descrizione             |
| -------------- | --------- | --------- | ----------------------- |
| `<id>`         | argomento | Sì        | ID della risorsa (UUID) |
| `-o, --output` | opzione   | No        | Formato di output       |

---

### `cast-operations <resource> create`

Crea una nuova risorsa.

```bash
cast-operations <resource> create [--data <json> | --file <path>] [-o <format>]
```

| Opzione         | Tipo    | Richiesto                   | Descrizione                  |
| --------------- | ------- | --------------------------- | ---------------------------- |
| `--data <json>` | stringa | Uno tra `--data` o `--file` | Dati della risorsa come JSON |
| `--file <path>` | stringa | Uno tra `--data` o `--file` | Percorso al file JSON        |
| `-o, --output`  | stringa | No                          | Formato di output            |

---

### `cast-operations <resource> update`

Aggiorna una risorsa esistente.

```bash
cast-operations <resource> update <id> --data <json> [-o <format>]
```

| Parametro       | Tipo      | Richiesto | Descrizione                   |
| --------------- | --------- | --------- | ----------------------------- |
| `<id>`          | argomento | Sì        | ID della risorsa              |
| `--data <json>` | opzione   | Sì        | Campi da aggiornare come JSON |
| `-o, --output`  | opzione   | No        | Formato di output             |

---

### `cast-operations <resource> delete`

Elimina una risorsa.

```bash
cast-operations <resource> delete <id> [--force]
```

| Parametro | Tipo      | Richiesto | Descrizione                    |
| --------- | --------- | --------- | ------------------------------ |
| `<id>`    | argomento | Sì        | ID della risorsa               |
| `--force` | opzione   | No        | Salta la richiesta di conferma |

---

### `cast-operations <resource> count`

Conta le risorse che corrispondono a un filtro.

```bash
cast-operations <resource> count [--query <json>]
```

| Opzione          | Tipo    | Predefinito | Descrizione                 |
| ---------------- | ------- | ----------- | --------------------------- |
| `--query <json>` | stringa | Nessuno     | Criteri di filtro come JSON |

---

## Comandi di Utilità

### `cast-operations version`

Mostra la versione della CLI.

```bash
cast-operations version
```

---

### `cast-operations whoami`

Mostra i dettagli di autenticazione correnti.

```bash
cast-operations whoami
```

Mostra l'URL dell'istanza e la chiave API mascherata. Se è attivo un contesto salvato, viene mostrato anche il nome del contesto.

---

### `cast-operations resources`

Elenca tutti i tipi di risorse disponibili.

```bash
cast-operations resources [--type <type>]
```

| Opzione         | Tipo    | Predefinito | Descrizione                         |
| --------------- | ------- | ----------- | ----------------------------------- |
| `--type <type>` | stringa | Nessuno     | Filtra per `database` o `analytics` |

---

## Opzioni Globali

Questi flag sono disponibili su tutti i comandi:

| Opzione                 | Descrizione                                |
| ----------------------- | ------------------------------------------ |
| `--api-key <key>`       | Sostituisce la chiave API                  |
| `--url <url>`           | Sostituisce l'URL dell'istanza             |
| `--context <name>`      | Usa un contesto specifico                  |
| `-o, --output <format>` | Formato di output: `json`, `table`, `wide` |
| `--no-color`            | Disabilita l'output colorato               |
| `--help`                | Mostra la guida                            |
| `--version`             | Mostra la versione                         |

## Route API

Per riferimento, la CLI mappa i comandi a questi endpoint API:

| Comando  | Metodo | Endpoint                        |
| -------- | ------ | ------------------------------- |
| `list`   | POST   | `/api/<resource>/get-list`      |
| `get`    | POST   | `/api/<resource>/<id>/get-item` |
| `create` | POST   | `/api/<resource>`               |
| `update` | PUT    | `/api/<resource>/<id>/`         |
| `delete` | DELETE | `/api/<resource>/<id>/`         |
| `count`  | POST   | `/api/<resource>/count`         |

Tutte le richieste includono l'header `APIKey` per l'autenticazione.
