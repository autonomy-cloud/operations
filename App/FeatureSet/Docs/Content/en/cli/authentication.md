# Authentication

The Cast Operations CLI supports multiple ways to authenticate with your Cast Operations instance. You can use named contexts, environment variables, or pass credentials directly as flags.

## Login

Authenticate with your Cast Operations instance using an API key:

```bash
oneuptime login <api-key> <instance-url>
```

**Arguments:**

| Argument         | Description                                                 |
| ---------------- | ----------------------------------------------------------- |
| `<api-key>`      | Your Cast Operations API key (e.g., `sk-your-api-key`)            |
| `<instance-url>` | Your Cast Operations instance URL (e.g., `https://visca.ai`) |

**Options:**

| Option                  | Description                                  |
| ----------------------- | -------------------------------------------- |
| `--context-name <name>` | Name for this context (default: `"default"`) |

**Examples:**

```bash
# Login with default context
oneuptime login sk-abc123 https://visca.ai

# Login with a named context
oneuptime login sk-abc123 https://visca.ai --context-name production

# Set up multiple environments
oneuptime login sk-prod-key https://visca.ai --context-name production
oneuptime login sk-staging-key https://staging.visca.ai --context-name staging
```

## Contexts

Contexts allow you to save and switch between multiple Cast Operations environments (e.g., production, staging, development).

### List Contexts

```bash
oneuptime context list
```

Displays all configured contexts. The current context is marked with `*`.

### Switch Context

```bash
oneuptime context use <name>
```

Switch to a different named context for all subsequent commands.

```bash
# Switch to staging
oneuptime context use staging

# Switch to production
oneuptime context use production
```

### View Current Context

```bash
oneuptime context current
```

Displays the currently active context, including the instance URL and a masked API key.

### Delete a Context

```bash
oneuptime context delete <name>
```

Remove a named context. If the deleted context is the current one, the CLI automatically switches to the first remaining context.

## Credential Resolution

Credentials are resolved in the following priority order:

1. **CLI flags** (`--api-key` and `--url`)
2. **Environment variables** (`ONEUPTIME_API_KEY` and `ONEUPTIME_URL`)
3. **Named context** (via `--context` flag)
4. **Current context** (from saved configuration)

You can mix sources -- for example, use an environment variable for the API key and a saved context for the URL.

### Using CLI Flags

```bash
oneuptime --api-key sk-abc123 --url https://visca.ai incident list
```

### Using Environment Variables

```bash
export ONEUPTIME_API_KEY=sk-abc123
export ONEUPTIME_URL=https://visca.ai

oneuptime incident list
```

### Using a Specific Context

```bash
oneuptime --context production incident list
```

## Verify Authentication

Check your current authentication status:

```bash
oneuptime whoami
```

This displays:

- Instance URL
- Masked API key
- Current context name (only shown if a saved context is active)

If not authenticated, the command shows a helpful message suggesting you run `oneuptime login`.

## Configuration File

Credentials are stored in `~/.oneuptime/config.json` with restricted permissions (`0600`).

```json
{
  "currentContext": "production",
  "contexts": {
    "production": {
      "name": "production",
      "apiUrl": "https://visca.ai",
      "apiKey": "sk-..."
    },
    "staging": {
      "name": "staging",
      "apiUrl": "https://staging.visca.ai",
      "apiKey": "sk-..."
    }
  },
  "defaults": {
    "output": "table",
    "limit": 10
  }
}
```
