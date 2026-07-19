# Command Reference

Complete reference for all Cast Operations CLI commands.

## Authentication Commands

### `cast-operations login`

Authenticate with a Cast Operations instance.

```bash
cast-operations login <api-key> <instance-url> [--context-name <name>]
```

| Parameter        | Type     | Required | Description                         |
| ---------------- | -------- | -------- | ----------------------------------- |
| `<api-key>`      | argument | Yes      | API key for authentication          |
| `<instance-url>` | argument | Yes      | Cast Operations instance URL              |
| `--context-name` | option   | No       | Context name (default: `"default"`) |

---

### `cast-operations context list`

List all saved contexts.

```bash
cast-operations context list
```

---

### `cast-operations context use`

Switch to a named context.

```bash
cast-operations context use <name>
```

| Parameter | Type     | Required | Description              |
| --------- | -------- | -------- | ------------------------ |
| `<name>`  | argument | Yes      | Context name to activate |

---

### `cast-operations context current`

Display the active context with masked API key.

```bash
cast-operations context current
```

---

### `cast-operations context delete`

Remove a saved context.

```bash
cast-operations context delete <name>
```

| Parameter | Type     | Required | Description            |
| --------- | -------- | -------- | ---------------------- |
| `<name>`  | argument | Yes      | Context name to delete |

---

## Resource Commands

All resource commands follow the same pattern. Replace `<resource>` with any supported resource name (e.g., `incident`, `monitor`, `alert`, `status-page`).

### `cast-operations <resource> list`

List resources with filtering and pagination.

```bash
cast-operations <resource> list [options]
```

| Option           | Type   | Default | Description             |
| ---------------- | ------ | ------- | ----------------------- |
| `--query <json>` | string | None    | Filter criteria as JSON |
| `--limit <n>`    | number | `10`    | Maximum results         |
| `--skip <n>`     | number | `0`     | Results to skip         |
| `--sort <json>`  | string | None    | Sort order as JSON      |
| `-o, --output`   | string | `table` | Output format           |

---

### `cast-operations <resource> get`

Get a single resource by ID.

```bash
cast-operations <resource> get <id> [-o <format>]
```

| Parameter      | Type     | Required | Description        |
| -------------- | -------- | -------- | ------------------ |
| `<id>`         | argument | Yes      | Resource ID (UUID) |
| `-o, --output` | option   | No       | Output format      |

---

### `cast-operations <resource> create`

Create a new resource.

```bash
cast-operations <resource> create [--data <json> | --file <path>] [-o <format>]
```

| Option          | Type   | Required                    | Description           |
| --------------- | ------ | --------------------------- | --------------------- |
| `--data <json>` | string | One of `--data` or `--file` | Resource data as JSON |
| `--file <path>` | string | One of `--data` or `--file` | Path to JSON file     |
| `-o, --output`  | string | No                          | Output format         |

---

### `cast-operations <resource> update`

Update an existing resource.

```bash
cast-operations <resource> update <id> --data <json> [-o <format>]
```

| Parameter       | Type     | Required | Description              |
| --------------- | -------- | -------- | ------------------------ |
| `<id>`          | argument | Yes      | Resource ID              |
| `--data <json>` | option   | Yes      | Fields to update as JSON |
| `-o, --output`  | option   | No       | Output format            |

---

### `cast-operations <resource> delete`

Delete a resource.

```bash
cast-operations <resource> delete <id> [--force]
```

| Parameter | Type     | Required | Description              |
| --------- | -------- | -------- | ------------------------ |
| `<id>`    | argument | Yes      | Resource ID              |
| `--force` | option   | No       | Skip confirmation prompt |

---

### `cast-operations <resource> count`

Count resources matching a filter.

```bash
cast-operations <resource> count [--query <json>]
```

| Option           | Type   | Default | Description             |
| ---------------- | ------ | ------- | ----------------------- |
| `--query <json>` | string | None    | Filter criteria as JSON |

---

## Utility Commands

### `cast-operations version`

Display the CLI version.

```bash
cast-operations version
```

---

### `cast-operations whoami`

Show current authentication details.

```bash
cast-operations whoami
```

Displays the instance URL and masked API key. If a saved context is active, the context name is also shown.

---

### `cast-operations resources`

List all available resource types.

```bash
cast-operations resources [--type <type>]
```

| Option          | Type   | Default | Description                         |
| --------------- | ------ | ------- | ----------------------------------- |
| `--type <type>` | string | None    | Filter by `database` or `analytics` |

---

## Global Options

These flags are available on all commands:

| Option                  | Description                            |
| ----------------------- | -------------------------------------- |
| `--api-key <key>`       | Override API key                       |
| `--url <url>`           | Override instance URL                  |
| `--context <name>`      | Use a specific context                 |
| `-o, --output <format>` | Output format: `json`, `table`, `wide` |
| `--no-color`            | Disable colored output                 |
| `--help`                | Show help                              |
| `--version`             | Show version                           |

## API Routes

For reference, the CLI maps commands to these API endpoints:

| Command  | Method | Endpoint                        |
| -------- | ------ | ------------------------------- |
| `list`   | POST   | `/api/<resource>/get-list`      |
| `get`    | POST   | `/api/<resource>/<id>/get-item` |
| `create` | POST   | `/api/<resource>`               |
| `update` | PUT    | `/api/<resource>/<id>/`         |
| `delete` | DELETE | `/api/<resource>/<id>/`         |
| `count`  | POST   | `/api/<resource>/count`         |

All requests include the `APIKey` header for authentication.
