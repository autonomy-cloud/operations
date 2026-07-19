# Opdrachtenoverzicht

Volledig overzicht van alle Cast Operations CLI-opdrachten.

## Authenticatieopdrachten

### `cast-operations login`

Authenticeer bij een Cast Operations-instantie.

```bash
cast-operations login <api-key> <instance-url> [--context-name <name>]
```

| Parameter        | Type     | Vereist | Beschrijving                         |
| ---------------- | -------- | ------- | ------------------------------------ |
| `<api-key>`      | argument | Ja      | API-sleutel voor authenticatie       |
| `<instance-url>` | argument | Ja      | Cast Operations instantie-URL              |
| `--context-name` | optie    | Nee     | Contextnaam (standaard: `"default"`) |

---

### `cast-operations context list`

Alle opgeslagen contexten weergeven.

```bash
cast-operations context list
```

---

### `cast-operations context use`

Overschakelen naar een benoemde context.

```bash
cast-operations context use <name>
```

| Parameter | Type     | Vereist | Beschrijving             |
| --------- | -------- | ------- | ------------------------ |
| `<name>`  | argument | Ja      | Te activeren contextnaam |

---

### `cast-operations context current`

De actieve context weergeven met gemaskeerde API-sleutel.

```bash
cast-operations context current
```

---

### `cast-operations context delete`

Een opgeslagen context verwijderen.

```bash
cast-operations context delete <name>
```

| Parameter | Type     | Vereist | Beschrijving               |
| --------- | -------- | ------- | -------------------------- |
| `<name>`  | argument | Ja      | Te verwijderen contextnaam |

---

## Resourceopdrachten

Alle resourceopdrachten volgen hetzelfde patroon. Vervang `<resource>` door een ondersteunde resourcenaam (bijv. `incident`, `monitor`, `alert`, `status-page`).

### `cast-operations <resource> list`

Resources weergeven met filteren en paginering.

```bash
cast-operations <resource> list [options]
```

| Optie            | Type   | Standaard | Beschrijving              |
| ---------------- | ------ | --------- | ------------------------- |
| `--query <json>` | string | Geen      | Filtercriteria als JSON   |
| `--limit <n>`    | number | `10`      | Maximum aantal resultaten |
| `--skip <n>`     | number | `0`       | Te overslaan resultaten   |
| `--sort <json>`  | string | Geen      | Sorteervolgorde als JSON  |
| `-o, --output`   | string | `table`   | Uitvoerformaat            |

---

### `cast-operations <resource> get`

Eén resource ophalen op ID.

```bash
cast-operations <resource> get <id> [-o <format>]
```

| Parameter      | Type     | Vereist | Beschrijving       |
| -------------- | -------- | ------- | ------------------ |
| `<id>`         | argument | Ja      | Resource-ID (UUID) |
| `-o, --output` | optie    | Nee     | Uitvoerformaat     |

---

### `cast-operations <resource> create`

Een nieuwe resource aanmaken.

```bash
cast-operations <resource> create [--data <json> | --file <path>] [-o <format>]
```

| Optie           | Type   | Vereist                      | Beschrijving              |
| --------------- | ------ | ---------------------------- | ------------------------- |
| `--data <json>` | string | Een van `--data` of `--file` | Resourcegegevens als JSON |
| `--file <path>` | string | Een van `--data` of `--file` | Pad naar JSON-bestand     |
| `-o, --output`  | string | Nee                          | Uitvoerformaat            |

---

### `cast-operations <resource> update`

Een bestaande resource bijwerken.

```bash
cast-operations <resource> update <id> --data <json> [-o <format>]
```

| Parameter       | Type     | Vereist | Beschrijving                  |
| --------------- | -------- | ------- | ----------------------------- |
| `<id>`          | argument | Ja      | Resource-ID                   |
| `--data <json>` | optie    | Ja      | Bij te werken velden als JSON |
| `-o, --output`  | optie    | Nee     | Uitvoerformaat                |

---

### `cast-operations <resource> delete`

Een resource verwijderen.

```bash
cast-operations <resource> delete <id> [--force]
```

| Parameter | Type     | Vereist | Beschrijving                 |
| --------- | -------- | ------- | ---------------------------- |
| `<id>`    | argument | Ja      | Resource-ID                  |
| `--force` | optie    | Nee     | Bevestigingsprompt overslaan |

---

### `cast-operations <resource> count`

Resources tellen die overeenkomen met een filter.

```bash
cast-operations <resource> count [--query <json>]
```

| Optie            | Type   | Standaard | Beschrijving            |
| ---------------- | ------ | --------- | ----------------------- |
| `--query <json>` | string | Geen      | Filtercriteria als JSON |

---

## Hulpprogramma-opdrachten

### `cast-operations version`

De CLI-versie weergeven.

```bash
cast-operations version
```

---

### `cast-operations whoami`

Huidige authenticatiegegevens weergeven.

```bash
cast-operations whoami
```

Geeft de instantie-URL en gemaskeerde API-sleutel weer. Als een opgeslagen context actief is, wordt ook de contextnaam getoond.

---

### `cast-operations resources`

Alle beschikbare resourcetypen weergeven.

```bash
cast-operations resources [--type <type>]
```

| Optie           | Type   | Standaard | Beschrijving                          |
| --------------- | ------ | --------- | ------------------------------------- |
| `--type <type>` | string | Geen      | Filteren op `database` of `analytics` |

---

## Globale opties

Deze vlaggen zijn beschikbaar voor alle opdrachten:

| Optie                   | Beschrijving                            |
| ----------------------- | --------------------------------------- |
| `--api-key <key>`       | API-sleutel overschrijven               |
| `--url <url>`           | Instantie-URL overschrijven             |
| `--context <name>`      | Een specifieke context gebruiken        |
| `-o, --output <format>` | Uitvoerformaat: `json`, `table`, `wide` |
| `--no-color`            | Gekleurde uitvoer uitschakelen          |
| `--help`                | Hulp weergeven                          |
| `--version`             | Versie weergeven                        |

## API-routes

Ter referentie: de CLI mapt opdrachten naar deze API-eindpunten:

| Opdracht | Methode | Eindpunt                        |
| -------- | ------- | ------------------------------- |
| `list`   | POST    | `/api/<resource>/get-list`      |
| `get`    | POST    | `/api/<resource>/<id>/get-item` |
| `create` | POST    | `/api/<resource>`               |
| `update` | PUT     | `/api/<resource>/<id>/`         |
| `delete` | DELETE  | `/api/<resource>/<id>/`         |
| `count`  | POST    | `/api/<resource>/count`         |

Alle verzoeken bevatten de `APIKey`-header voor authenticatie.
