# Kommandoreference

Komplet reference til alle Cast Operations CLI-kommandoer.

## Autentificeringskommandoer

### `cast-operations login`

Autentificer med en Cast Operations-instans.

```bash
cast-operations login <api-key> <instance-url> [--context-name <name>]
```

| Parameter        | Type        | Påkrævet | Beskrivelse                          |
| ---------------- | ----------- | -------- | ------------------------------------ |
| `<api-key>`      | argument    | Ja       | API-nøgle til autentificering        |
| `<instance-url>` | argument    | Ja       | Cast Operations-instans-URL                |
| `--context-name` | indstilling | Nej      | Kontekstnavn (standard: `"default"`) |

---

### `cast-operations context list`

List alle gemte kontekster.

```bash
cast-operations context list
```

---

### `cast-operations context use`

Skift til en navngivet kontekst.

```bash
cast-operations context use <name>
```

| Parameter | Type     | Påkrævet | Beskrivelse                     |
| --------- | -------- | -------- | ------------------------------- |
| `<name>`  | argument | Ja       | Kontekstnavn der skal aktiveres |

---

### `cast-operations context current`

Vis den aktive kontekst med maskeret API-nøgle.

```bash
cast-operations context current
```

---

### `cast-operations context delete`

Fjern en gemt kontekst.

```bash
cast-operations context delete <name>
```

| Parameter | Type     | Påkrævet | Beskrivelse                   |
| --------- | -------- | -------- | ----------------------------- |
| `<name>`  | argument | Ja       | Kontekstnavn der skal slettes |

---

## Ressourcekommandoer

Alle ressourcekommandoer følger det samme mønster. Erstat `<resource>` med et understøttet ressourcenavn (f.eks. `incident`, `monitor`, `alert`, `status-page`).

### `cast-operations <resource> list`

List ressourcer med filtrering og paginering.

```bash
cast-operations <resource> list [options]
```

| Indstilling      | Type   | Standard | Beskrivelse                       |
| ---------------- | ------ | -------- | --------------------------------- |
| `--query <json>` | streng | Ingen    | Filterkriterier som JSON          |
| `--limit <n>`    | tal    | `10`     | Maks. antal resultater            |
| `--skip <n>`     | tal    | `0`      | Resultater der skal springes over |
| `--sort <json>`  | streng | Ingen    | Sorteringsrækkefølge som JSON     |
| `-o, --output`   | streng | `table`  | Outputformat                      |

---

### `cast-operations <resource> get`

Hent en enkelt ressource efter ID.

```bash
cast-operations <resource> get <id> [-o <format>]
```

| Parameter      | Type        | Påkrævet | Beskrivelse         |
| -------------- | ----------- | -------- | ------------------- |
| `<id>`         | argument    | Ja       | Ressource-ID (UUID) |
| `-o, --output` | indstilling | Nej      | Outputformat        |

---

### `cast-operations <resource> create`

Opret en ny ressource.

```bash
cast-operations <resource> create [--data <json> | --file <path>] [-o <format>]
```

| Indstilling     | Type   | Påkrævet                      | Beskrivelse            |
| --------------- | ------ | ----------------------------- | ---------------------- |
| `--data <json>` | streng | En af `--data` eller `--file` | Ressourcedata som JSON |
| `--file <path>` | streng | En af `--data` eller `--file` | Sti til JSON-fil       |
| `-o, --output`  | streng | Nej                           | Outputformat           |

---

### `cast-operations <resource> update`

Opdater en eksisterende ressource.

```bash
cast-operations <resource> update <id> --data <json> [-o <format>]
```

| Parameter       | Type        | Påkrævet | Beskrivelse                        |
| --------------- | ----------- | -------- | ---------------------------------- |
| `<id>`          | argument    | Ja       | Ressource-ID                       |
| `--data <json>` | indstilling | Ja       | Felter der skal opdateres som JSON |
| `-o, --output`  | indstilling | Nej      | Outputformat                       |

---

### `cast-operations <resource> delete`

Slet en ressource.

```bash
cast-operations <resource> delete <id> [--force]
```

| Parameter | Type        | Påkrævet | Beskrivelse                    |
| --------- | ----------- | -------- | ------------------------------ |
| `<id>`    | argument    | Ja       | Ressource-ID                   |
| `--force` | indstilling | Nej      | Spring bekræftelsesprompt over |

---

### `cast-operations <resource> count`

Tæl ressourcer, der matcher et filter.

```bash
cast-operations <resource> count [--query <json>]
```

| Indstilling      | Type   | Standard | Beskrivelse              |
| ---------------- | ------ | -------- | ------------------------ |
| `--query <json>` | streng | Ingen    | Filterkriterier som JSON |

---

## Hjælpekommandoer

### `cast-operations version`

Vis CLI-versionen.

```bash
cast-operations version
```

---

### `cast-operations whoami`

Vis aktuelle autentificeringsdetaljer.

```bash
cast-operations whoami
```

Viser instans-URL og maskeret API-nøgle. Hvis en gemt kontekst er aktiv, vises kontekstnavnet også.

---

### `cast-operations resources`

List alle tilgængelige ressourcetyper.

```bash
cast-operations resources [--type <type>]
```

| Indstilling     | Type   | Standard | Beskrivelse                                |
| --------------- | ------ | -------- | ------------------------------------------ |
| `--type <type>` | streng | Ingen    | Filtrer efter `database` eller `analytics` |

---

## Globale indstillinger

Disse flag er tilgængelige på alle kommandoer:

| Indstilling             | Beskrivelse                           |
| ----------------------- | ------------------------------------- |
| `--api-key <key>`       | Tilsidesæt API-nøgle                  |
| `--url <url>`           | Tilsidesæt instans-URL                |
| `--context <name>`      | Brug en specifik kontekst             |
| `-o, --output <format>` | Outputformat: `json`, `table`, `wide` |
| `--no-color`            | Deaktiver farvet output               |
| `--help`                | Vis hjælp                             |
| `--version`             | Vis version                           |

## API-ruter

Som reference mapper CLI-kommandoer til disse API-endpoints:

| Kommando | Metode | Endpoint                        |
| -------- | ------ | ------------------------------- |
| `list`   | POST   | `/api/<resource>/get-list`      |
| `get`    | POST   | `/api/<resource>/<id>/get-item` |
| `create` | POST   | `/api/<resource>`               |
| `update` | PUT    | `/api/<resource>/<id>/`         |
| `delete` | DELETE | `/api/<resource>/<id>/`         |
| `count`  | POST   | `/api/<resource>/count`         |

Alle anmodninger inkluderer `APIKey`-headeren til autentificering.
