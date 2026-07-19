# Befehlsreferenz

Vollständige Referenz für alle Cast Operations CLI-Befehle.

## Authentifizierungsbefehle

### `cast-operations login`

Mit einer Cast Operations-Instanz authentifizieren.

```bash
cast-operations login <api-key> <instance-url> [--context-name <name>]
```

| Parameter        | Typ      | Erforderlich | Beschreibung                        |
| ---------------- | -------- | ------------ | ----------------------------------- |
| `<api-key>`      | Argument | Ja           | API-Schlüssel zur Authentifizierung |
| `<instance-url>` | Argument | Ja           | Cast Operations-Instanz-URL               |
| `--context-name` | Option   | Nein         | Kontextname (Standard: `"default"`) |

---

### `cast-operations context list`

Alle gespeicherten Kontexte auflisten.

```bash
cast-operations context list
```

---

### `cast-operations context use`

Zu einem benannten Kontext wechseln.

```bash
cast-operations context use <name>
```

| Parameter | Typ      | Erforderlich | Beschreibung                 |
| --------- | -------- | ------------ | ---------------------------- |
| `<name>`  | Argument | Ja           | Zu aktivierender Kontextname |

---

### `cast-operations context current`

Den aktiven Kontext mit maskiertem API-Schlüssel anzeigen.

```bash
cast-operations context current
```

---

### `cast-operations context delete`

Einen gespeicherten Kontext entfernen.

```bash
cast-operations context delete <name>
```

| Parameter | Typ      | Erforderlich | Beschreibung              |
| --------- | -------- | ------------ | ------------------------- |
| `<name>`  | Argument | Ja           | Zu löschender Kontextname |

---

## Ressourcenbefehle

Alle Ressourcenbefehle folgen demselben Muster. Ersetzen Sie `<resource>` durch einen beliebigen unterstützten Ressourcennamen (z. B. `incident`, `monitor`, `alert`, `status-page`).

### `cast-operations <resource> list`

Ressourcen mit Filterung und Paginierung auflisten.

```bash
cast-operations <resource> list [options]
```

| Option           | Typ          | Standard | Beschreibung                 |
| ---------------- | ------------ | -------- | ---------------------------- |
| `--query <json>` | Zeichenkette | Keiner   | Filterkriterien als JSON     |
| `--limit <n>`    | Zahl         | `10`     | Maximale Ergebnisse          |
| `--skip <n>`     | Zahl         | `0`      | Zu überspringende Ergebnisse |
| `--sort <json>`  | Zeichenkette | Keiner   | Sortierreihenfolge als JSON  |
| `-o, --output`   | Zeichenkette | `table`  | Ausgabeformat                |

---

### `cast-operations <resource> get`

Eine einzelne Ressource nach ID abrufen.

```bash
cast-operations <resource> get <id> [-o <format>]
```

| Parameter      | Typ      | Erforderlich | Beschreibung         |
| -------------- | -------- | ------------ | -------------------- |
| `<id>`         | Argument | Ja           | Ressourcen-ID (UUID) |
| `-o, --output` | Option   | Nein         | Ausgabeformat        |

---

### `cast-operations <resource> create`

Eine neue Ressource erstellen.

```bash
cast-operations <resource> create [--data <json> | --file <path>] [-o <format>]
```

| Option          | Typ          | Erforderlich                     | Beschreibung             |
| --------------- | ------------ | -------------------------------- | ------------------------ |
| `--data <json>` | Zeichenkette | Eines von `--data` oder `--file` | Ressourcendaten als JSON |
| `--file <path>` | Zeichenkette | Eines von `--data` oder `--file` | Pfad zur JSON-Datei      |
| `-o, --output`  | Zeichenkette | Nein                             | Ausgabeformat            |

---

### `cast-operations <resource> update`

Eine vorhandene Ressource aktualisieren.

```bash
cast-operations <resource> update <id> --data <json> [-o <format>]
```

| Parameter       | Typ      | Erforderlich | Beschreibung                       |
| --------------- | -------- | ------------ | ---------------------------------- |
| `<id>`          | Argument | Ja           | Ressourcen-ID                      |
| `--data <json>` | Option   | Ja           | Zu aktualisierende Felder als JSON |
| `-o, --output`  | Option   | Nein         | Ausgabeformat                      |

---

### `cast-operations <resource> delete`

Eine Ressource löschen.

```bash
cast-operations <resource> delete <id> [--force]
```

| Parameter | Typ      | Erforderlich | Beschreibung                          |
| --------- | -------- | ------------ | ------------------------------------- |
| `<id>`    | Argument | Ja           | Ressourcen-ID                         |
| `--force` | Option   | Nein         | Bestätigungsaufforderung überspringen |

---

### `cast-operations <resource> count`

Ressourcen zählen, die einem Filter entsprechen.

```bash
cast-operations <resource> count [--query <json>]
```

| Option           | Typ          | Standard | Beschreibung             |
| ---------------- | ------------ | -------- | ------------------------ |
| `--query <json>` | Zeichenkette | Keiner   | Filterkriterien als JSON |

---

## Hilfsbefehle

### `cast-operations version`

Die CLI-Version anzeigen.

```bash
cast-operations version
```

---

### `cast-operations whoami`

Aktuelle Authentifizierungsdetails anzeigen.

```bash
cast-operations whoami
```

Zeigt die Instanz-URL und den maskierten API-Schlüssel an. Wenn ein gespeicherter Kontext aktiv ist, wird auch der Kontextname angezeigt.

---

### `cast-operations resources`

Alle verfügbaren Ressourcentypen auflisten.

```bash
cast-operations resources [--type <type>]
```

| Option          | Typ          | Standard | Beschreibung                             |
| --------------- | ------------ | -------- | ---------------------------------------- |
| `--type <type>` | Zeichenkette | Keiner   | Nach `database` oder `analytics` filtern |

---

## Globale Optionen

Diese Flags sind für alle Befehle verfügbar:

| Option                  | Beschreibung                           |
| ----------------------- | -------------------------------------- |
| `--api-key <key>`       | API-Schlüssel überschreiben            |
| `--url <url>`           | Instanz-URL überschreiben              |
| `--context <name>`      | Einen spezifischen Kontext verwenden   |
| `-o, --output <format>` | Ausgabeformat: `json`, `table`, `wide` |
| `--no-color`            | Farbige Ausgabe deaktivieren           |
| `--help`                | Hilfe anzeigen                         |
| `--version`             | Version anzeigen                       |

## API-Routen

Als Referenz ordnet die CLI Befehle diesen API-Endpunkten zu:

| Befehl   | Methode | Endpunkt                        |
| -------- | ------- | ------------------------------- |
| `list`   | POST    | `/api/<resource>/get-list`      |
| `get`    | POST    | `/api/<resource>/<id>/get-item` |
| `create` | POST    | `/api/<resource>`               |
| `update` | PUT     | `/api/<resource>/<id>/`         |
| `delete` | DELETE  | `/api/<resource>/<id>/`         |
| `count`  | POST    | `/api/<resource>/count`         |

Alle Anfragen enthalten den `APIKey`-Header zur Authentifizierung.
