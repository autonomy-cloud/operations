# @cast-operations/cli

Command-line interface for managing Cast Operations resources. Supports all MCP-enabled resources with full CRUD operations, named contexts for multiple environments, and flexible output formats.

## Installation

```bash
npm install -g @cast-operations/cli
```

Or run directly within the monorepo:

```bash
cd CLI
npm install
npm start -- --help
```

## Quick Start

```bash
# Authenticate with your Cast Operations instance
cast-operations login <api-key> <instance-url>
cast-operations login sk-your-api-key https://visca.ai

# List incidents
cast-operations incident list --limit 10

# Get a single resource by ID
cast-operations monitor get 550e8400-e29b-41d4-a716-446655440000

# Create a resource
cast-operations monitor create --data '{"name":"API Health","projectId":"..."}'

# See all available resources
cast-operations resources
```

## Authentication & Contexts

The CLI supports multiple authentication contexts, making it easy to switch between environments.

### Setting Up

```bash
# Create a production context
cast-operations login sk-prod-key https://visca.ai --context-name production

# Create a staging context
cast-operations login sk-staging-key https://staging.visca.ai --context-name staging
```

### Switching Contexts

```bash
# List all contexts
cast-operations context list

# Switch active context
cast-operations context use staging

# Show current context
cast-operations context current

# Delete a context
cast-operations context delete old-context
```

### Credential Resolution Order

1. CLI flags: `--api-key` and `--url`
2. Environment variables: `CAST_OPERATIONS_API_KEY` and `CAST_OPERATIONS_URL`
3. Current context from config file (`~/.cast-operations/config.json`)

## Command Reference

### Authentication

| Command                           | Description                       |
| --------------------------------- | --------------------------------- |
| `cast-operations login <api-key> <url>` | Authenticate and create a context |
| `cast-operations context list`          | List all contexts                 |
| `cast-operations context use <name>`    | Switch active context             |
| `cast-operations context current`       | Show current context              |
| `cast-operations context delete <name>` | Remove a context                  |
| `cast-operations whoami`                | Show current auth info            |

### Resource Operations

Every discovered resource supports these subcommands:

| Subcommand                             | Description                                  |
| -------------------------------------- | -------------------------------------------- |
| `<resource> list [options]`            | List resources with filtering and pagination |
| `<resource> get <id>`                  | Get a single resource by ID                  |
| `<resource> create --data <json>`      | Create a new resource                        |
| `<resource> update <id> --data <json>` | Update an existing resource                  |
| `<resource> delete <id>`               | Delete a resource                            |
| `<resource> count [--query <json>]`    | Count resources                              |

### List Options

```
--query <json>    Filter criteria as JSON
--limit <n>       Maximum number of results (default: 10)
--skip <n>        Number of results to skip (default: 0)
--sort <json>     Sort order as JSON (e.g. '{"createdAt": -1}')
-o, --output      Output format: json, table, wide
```

### Utility Commands

| Command               | Description                       |
| --------------------- | --------------------------------- |
| `cast-operations version`   | Print CLI version                 |
| `cast-operations whoami`    | Show current authentication info  |
| `cast-operations resources` | List all available resource types |

## Output Formats

| Format  | Description                             |
| ------- | --------------------------------------- |
| `table` | Formatted ASCII table (default for TTY) |
| `json`  | Raw JSON (default when piped)           |
| `wide`  | Table with all columns shown            |

```bash
# Explicit format
cast-operations incident list -o json
cast-operations incident list -o table
cast-operations incident list -o wide

# Pipe to jq (auto-detects JSON)
cast-operations incident list | jq '.[].title'
```

## Scripting Examples

```bash
# List incidents as JSON for scripting
cast-operations incident list -o json --limit 100

# Count resources with filter
cast-operations incident count --query '{"currentIncidentStateId":"..."}'

# Create from a JSON file
cast-operations monitor create --file monitor.json

# Use environment variables in CI/CD
CAST_OPERATIONS_API_KEY=sk-xxx CAST_OPERATIONS_URL=https://visca.ai cast-operations incident list
```

## Environment Variables

| Variable            | Description                |
| ------------------- | -------------------------- |
| `CAST_OPERATIONS_API_KEY` | API key for authentication |
| `CAST_OPERATIONS_URL`     | Cast Operations instance URL     |
| `NO_COLOR`          | Disable colored output     |

## Configuration File

The CLI stores configuration at `~/.cast-operations/config.json` with `0600` permissions. The file contains:

```json
{
  "currentContext": "production",
  "contexts": {
    "production": {
      "name": "production",
      "apiUrl": "https://visca.ai",
      "apiKey": "sk-..."
    }
  },
  "defaults": {
    "output": "table",
    "limit": 10
  }
}
```

## Global Options

| Option                  | Description                             |
| ----------------------- | --------------------------------------- |
| `--api-key <key>`       | Override API key for this command       |
| `--url <url>`           | Override instance URL for this command  |
| `--context <name>`      | Use a specific context for this command |
| `-o, --output <format>` | Output format: json, table, wide        |
| `--no-color`            | Disable colored output                  |

## Supported Resources

Run `cast-operations resources` to see all available resource types. Resources are auto-discovered from Cast Operations models that have MCP enabled. Currently supported:

- **Incident** - Manage incidents
- **Alert** - Manage alerts
- **Monitor** - Manage monitors
- **Monitor Status** - Manage monitor statuses
- **Incident State** - Manage incident states
- **Status Page** - Manage status pages
- **On-Call Policy** - Manage on-call duty policies
- **Team** - Manage teams
- **Scheduled Maintenance Event** - Manage scheduled maintenance

As more models are MCP-enabled in Cast Operations, they automatically become available in the CLI.

## Development

```bash
cd CLI
npm install
npm start -- --help     # Run via ts-node
npm test                # Run tests
npm run compile         # Type-check
```

## License

Apache-2.0
