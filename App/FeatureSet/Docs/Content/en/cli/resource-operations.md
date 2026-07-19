# Resource Operations

The Cast Operations CLI provides full CRUD (Create, Read, Update, Delete) operations for all supported resources. Resources are auto-discovered from your Cast Operations instance.

## Available Resources

Run the following command to see all available resource types:

```bash
cast-operations resources
```

You can filter by type:

```bash
# Show only database resources
cast-operations resources --type database

# Show only analytics resources
cast-operations resources --type analytics
```

Common resources include:

| Resource                    | Command                                 |
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

## List Resources

Retrieve a list of resources with optional filtering, pagination, and sorting.

```bash
cast-operations <resource> list [options]
```

**Options:**

| Option                  | Description               | Default |
| ----------------------- | ------------------------- | ------- |
| `--query <json>`        | Filter criteria as JSON   | None    |
| `--limit <n>`           | Maximum number of results | `10`    |
| `--skip <n>`            | Number of results to skip | `0`     |
| `--sort <json>`         | Sort order as JSON        | None    |
| `-o, --output <format>` | Output format             | `table` |

**Examples:**

```bash
# List the 10 most recent incidents
cast-operations incident list

# Filter incidents by state ID
cast-operations incident list --query '{"currentIncidentStateId":"<state-id>"}'

# List with pagination
cast-operations incident list --limit 20 --skip 40

# Sort by creation date (descending)
cast-operations incident list --sort '{"createdAt":-1}'

# Output as JSON
cast-operations incident list -o json
```

## Get a Resource

Retrieve a single resource by its ID.

```bash
cast-operations <resource> get <id>
```

**Arguments:**

| Argument | Description            |
| -------- | ---------------------- |
| `<id>`   | The resource ID (UUID) |

**Examples:**

```bash
# Get a specific incident
cast-operations incident get 550e8400-e29b-41d4-a716-446655440000

# Get a monitor as JSON
cast-operations monitor get abc-123 -o json
```

## Create a Resource

Create a new resource from inline JSON or a file.

```bash
cast-operations <resource> create [options]
```

**Options:**

| Option                  | Description                                  |
| ----------------------- | -------------------------------------------- |
| `--data <json>`         | Resource data as a JSON object               |
| `--file <path>`         | Path to a JSON file containing resource data |
| `-o, --output <format>` | Output format                                |

You must provide either `--data` or `--file`.

**Examples:**

```bash
# Create an incident with inline JSON
cast-operations incident create --data '{"title":"API Outage","currentIncidentStateId":"<state-id>","incidentSeverityId":"<severity-id>","declaredAt":"2025-01-15T10:30:00Z"}'

# Create from a JSON file
cast-operations incident create --file incident.json

# Create and output as JSON to capture the ID
cast-operations monitor create --data '{"name":"API Health Check"}' -o json
```

## Update a Resource

Update an existing resource by ID.

```bash
cast-operations <resource> update <id> [options]
```

**Arguments:**

| Argument | Description     |
| -------- | --------------- |
| `<id>`   | The resource ID |

**Options:**

| Option                  | Description                         |
| ----------------------- | ----------------------------------- |
| `--data <json>`         | Fields to update as JSON (required) |
| `-o, --output <format>` | Output format                       |

**Examples:**

```bash
# Change incident state (e.g., to resolved)
cast-operations incident update abc-123 --data '{"currentIncidentStateId":"<resolved-state-id>"}'

# Rename a monitor
cast-operations monitor update abc-123 --data '{"name":"Updated Monitor Name"}'
```

## Delete a Resource

Delete a resource by ID.

```bash
cast-operations <resource> delete <id> [--force]
```

**Arguments:**

| Argument | Description     |
| -------- | --------------- |
| `<id>`   | The resource ID |

**Options:**

| Option    | Description              |
| --------- | ------------------------ |
| `--force` | Skip confirmation prompt |

**Examples:**

```bash
cast-operations incident delete abc-123
cast-operations monitor delete 550e8400-e29b-41d4-a716-446655440000

# Skip confirmation
cast-operations monitor delete 550e8400-e29b-41d4-a716-446655440000 --force
```

## Count Resources

Count resources matching optional filter criteria.

```bash
cast-operations <resource> count [options]
```

**Options:**

| Option           | Description             |
| ---------------- | ----------------------- |
| `--query <json>` | Filter criteria as JSON |

**Examples:**

```bash
# Count all incidents
cast-operations incident count

# Count incidents by state
cast-operations incident count --query '{"currentIncidentStateId":"<state-id>"}'

# Count monitors
cast-operations monitor count
```

## Analytics Resources

Analytics resources support a limited set of operations compared to database resources:

| Operation | Supported |
| --------- | --------- |
| `list`    | Yes       |
| `create`  | Yes       |
| `count`   | Yes       |
| `get`     | No        |
| `update`  | No        |
| `delete`  | No        |

Use `cast-operations resources --type analytics` to see which analytics resources are available on your instance.
