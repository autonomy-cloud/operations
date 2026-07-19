# Kommandoreferanse

Fullstendig referanse for alle Cast Operations CLI-kommandoer.

## Autentiseringskommandoer

### `cast-operations login`

Autentiser med en Cast Operations-instans.

```bash
cast-operations login <api-key> <instance-url> [--context-name <name>]
```

| Parameter        | Type       | Påkrevd | Beskrivelse                          |
| ---------------- | ---------- | ------- | ------------------------------------ |
| `<api-key>`      | argument   | Ja      | API-nøkkel for autentisering         |
| `<instance-url>` | argument   | Ja      | URL til Cast Operations-instansen          |
| `--context-name` | alternativ | Nei     | Kontekstnavn (standard: `"default"`) |

---

### `cast-operations context list`

List alle lagrede kontekster.

```bash
cast-operations context list
```

---

### `cast-operations context use`

Bytt til en navngitt kontekst.

```bash
cast-operations context use <name>
```

| Parameter | Type     | Påkrevd | Beskrivelse                     |
| --------- | -------- | ------- | ------------------------------- |
| `<name>`  | argument | Ja      | Kontekstnavn som skal aktiveres |

---

### `cast-operations context current`

Vis den aktive konteksten med maskert API-nøkkel.

```bash
cast-operations context current
```

---

### `cast-operations context delete`

Fjern en lagret kontekst.

```bash
cast-operations context delete <name>
```

| Parameter | Type     | Påkrevd | Beskrivelse                   |
| --------- | -------- | ------- | ----------------------------- |
| `<name>`  | argument | Ja      | Kontekstnavn som skal slettes |

---

## Ressurskommandoer

Alle ressurskommandoer følger samme mønster. Erstatt `<resource>` med et støttet ressursnavn (f.eks. `incident`, `monitor`, `alert`, `status-page`).

### `cast-operations <resource> list`

List ressurser med filtrering og paginering.

```bash
cast-operations <resource> list [options]
```

| Alternativ       | Type   | Standard | Beskrivelse                     |
| ---------------- | ------ | -------- | ------------------------------- |
| `--query <json>` | streng | Ingen    | Filterkriterier som JSON        |
| `--limit <n>`    | tall   | `10`     | Maksimalt antall resultater     |
| `--skip <n>`     | tall   | `0`      | Resultater som skal hoppes over |
| `--sort <json>`  | streng | Ingen    | Sorteringsrekkefølge som JSON   |
| `-o, --output`   | streng | `table`  | Utdataformat                    |

---

### `cast-operations <resource> get`

Hent en enkelt ressurs etter ID.

```bash
cast-operations <resource> get <id> [-o <format>]
```

| Parameter      | Type       | Påkrevd | Beskrivelse       |
| -------------- | ---------- | ------- | ----------------- |
| `<id>`         | argument   | Ja      | Ressurs-ID (UUID) |
| `-o, --output` | alternativ | Nei     | Utdataformat      |

---

### `cast-operations <resource> create`

Opprett en ny ressurs.

```bash
cast-operations <resource> create [--data <json> | --file <path>] [-o <format>]
```

| Alternativ      | Type   | Påkrevd                       | Beskrivelse          |
| --------------- | ------ | ----------------------------- | -------------------- |
| `--data <json>` | streng | Én av `--data` eller `--file` | Ressursdata som JSON |
| `--file <path>` | streng | Én av `--data` eller `--file` | Sti til JSON-fil     |
| `-o, --output`  | streng | Nei                           | Utdataformat         |

---

### `cast-operations <resource> update`

Oppdater en eksisterende ressurs.

```bash
cast-operations <resource> update <id> --data <json> [-o <format>]
```

| Parameter       | Type       | Påkrevd | Beskrivelse                       |
| --------------- | ---------- | ------- | --------------------------------- |
| `<id>`          | argument   | Ja      | Ressurs-ID                        |
| `--data <json>` | alternativ | Ja      | Felt som skal oppdateres som JSON |
| `-o, --output`  | alternativ | Nei     | Utdataformat                      |

---

### `cast-operations <resource> delete`

Slett en ressurs.

```bash
cast-operations <resource> delete <id> [--force]
```

| Parameter | Type       | Påkrevd | Beskrivelse                    |
| --------- | ---------- | ------- | ------------------------------ |
| `<id>`    | argument   | Ja      | Ressurs-ID                     |
| `--force` | alternativ | Nei     | Hopp over bekreftelsesprompten |

---

### `cast-operations <resource> count`

Tell ressurser som matcher et filter.

```bash
cast-operations <resource> count [--query <json>]
```

| Alternativ       | Type   | Standard | Beskrivelse              |
| ---------------- | ------ | -------- | ------------------------ |
| `--query <json>` | streng | Ingen    | Filterkriterier som JSON |

---

## Verktøykommandoer

### `cast-operations version`

Vis CLI-versjonen.

```bash
cast-operations version
```

---

### `cast-operations whoami`

Vis gjeldende autentiseringsdetaljer.

```bash
cast-operations whoami
```

Viser instans-URL og maskert API-nøkkel. Hvis en lagret kontekst er aktiv, vises også kontekstnavnet.

---

### `cast-operations resources`

List alle tilgjengelige ressurstyper.

```bash
cast-operations resources [--type <type>]
```

| Alternativ      | Type   | Standard | Beskrivelse                                |
| --------------- | ------ | -------- | ------------------------------------------ |
| `--type <type>` | streng | Ingen    | Filtrer etter `database` eller `analytics` |

---

## Globale alternativer

Disse flaggene er tilgjengelige på alle kommandoer:

| Alternativ              | Beskrivelse                           |
| ----------------------- | ------------------------------------- |
| `--api-key <key>`       | Overstyr API-nøkkel                   |
| `--url <url>`           | Overstyr instans-URL                  |
| `--context <name>`      | Bruk en spesifikk kontekst            |
| `-o, --output <format>` | Utdataformat: `json`, `table`, `wide` |
| `--no-color`            | Deaktiver farget utdata               |
| `--help`                | Vis hjelp                             |
| `--version`             | Vis versjon                           |

## API-ruter

For referanse, kartlegger CLI kommandoer til disse API-endepunktene:

| Kommando | Metode | Endepunkt                       |
| -------- | ------ | ------------------------------- |
| `list`   | POST   | `/api/<resource>/get-list`      |
| `get`    | POST   | `/api/<resource>/<id>/get-item` |
| `create` | POST   | `/api/<resource>`               |
| `update` | PUT    | `/api/<resource>/<id>/`         |
| `delete` | DELETE | `/api/<resource>/<id>/`         |
| `count`  | POST   | `/api/<resource>/count`         |

Alle forespørsler inkluderer `APIKey`-overskriften for autentisering.
