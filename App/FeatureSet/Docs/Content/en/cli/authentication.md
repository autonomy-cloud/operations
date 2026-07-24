# Authentication

The Cast Operations CLI supports multiple ways to authenticate with your Cast Operations instance. You can use named contexts, environment variables, or pass credentials directly as flags.

## Login

Authenticate with your Cast Operations instance using an API key:

```bash
cast-operations login <api-key> <instance-url>
```

**Arguments:**

| Argument         | Description                                                 |
| ---------------- | ----------------------------------------------------------- |
| `<api-key>`      | Your Cast Operations API key (e.g., `sk-your-api-key`)            |
| `<instance-url>` | Your Cast Operations instance URL (e.g., `https://latticeruntime.com`) |

**Options:**

| Option                  | Description                                  |
| ----------------------- | -------------------------------------------- |
| `--context-name <name>` | Name for this context (default: `"default"`) |

**Examples:**

```bash
# Login with default context
cast-operations login sk-abc123 https://latticeruntime.com

# Login with a named context
cast-operations login sk-abc123 https://latticeruntime.com --context-name production

# Set up multiple environments
cast-operations login sk-prod-key https://latticeruntime.com --context-name production
cast-operations login sk-staging-key https://staging.latticeruntime.com --context-name staging
```

## Contexts

Contexts allow you to save and switch between multiple Cast Operations environments (e.g., production, staging, development).

### List Contexts

```bash
cast-operations context list
```

Displays all configured contexts. The current context is marked with `*`.

### Switch Context

```bash
cast-operations context use <name>
```

Switch to a different named context for all subsequent commands.

```bash
# Switch to staging
cast-operations context use staging

# Switch to production
cast-operations context use production
```

### View Current Context

```bash
cast-operations context current
```

Displays the currently active context, including the instance URL and a masked API key.

### Delete a Context

```bash
cast-operations context delete <name>
```

Remove a named context. If the deleted context is the current one, the CLI automatically switches to the first remaining context.

## Credential Resolution

Credentials are resolved in the following priority order:

1. **CLI flags** (`--api-key` and `--url`)
2. **Environment variables** (`CAST_OPERATIONS_API_KEY` and `CAST_OPERATIONS_URL`)
3. **Named context** (via `--context` flag)
4. **Current context** (from saved configuration)

You can mix sources -- for example, use an environment variable for the API key and a saved context for the URL.

### Using CLI Flags

```bash
cast-operations --api-key sk-abc123 --url https://latticeruntime.com incident list
```

### Using Environment Variables

```bash
export CAST_OPERATIONS_API_KEY=sk-abc123
export CAST_OPERATIONS_URL=https://latticeruntime.com

cast-operations incident list
```

### Using a Specific Context

```bash
cast-operations --context production incident list
```

## Verify Authentication

Check your current authentication status:

```bash
cast-operations whoami
```

This displays:

- Instance URL
- Masked API key
- Current context name (only shown if a saved context is active)

If not authenticated, the command shows a helpful message suggesting you run `cast-operations login`.

## Configuration File

Credentials are stored in `~/.cast-operations/config.json` with restricted permissions (`0600`).

```json
{
  "currentContext": "production",
  "contexts": {
    "production": {
      "name": "production",
      "apiUrl": "https://latticeruntime.com",
      "apiKey": "sk-..."
    },
    "staging": {
      "name": "staging",
      "apiUrl": "https://staging.latticeruntime.com",
      "apiKey": "sk-..."
    }
  },
  "defaults": {
    "output": "table",
    "limit": 10
  }
}
```
