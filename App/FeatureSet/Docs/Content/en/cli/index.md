# Cast Operations CLI

The Cast Operations CLI is a command-line interface for managing your Cast Operations resources directly from the terminal. It supports full CRUD operations on monitors, incidents, alerts, status pages, and more.

## Features

- **Multi-environment support** with named contexts for production, staging, and development
- **Auto-discovery** of available resources from your Cast Operations instance
- **Flexible authentication** via CLI flags, environment variables, or saved contexts
- **Smart output formatting** with JSON, table, and wide display modes
- **Scriptable** for CI/CD pipelines and automation workflows

## Installation

```bash
npm install -g @cast-operations/cli
```

## Quick Start

```bash
# Authenticate with your Cast Operations instance
cast-operations login <your-api-key> https://visca.ai

# List your monitors
cast-operations monitor list

# View a specific incident
cast-operations incident get <incident-id>

# See all available resources
cast-operations resources
```

## Documentation

| Guide                                           | Description                                              |
| ----------------------------------------------- | -------------------------------------------------------- |
| [Authentication](./authentication.md)           | Login, contexts, and credential management               |
| [Resource Operations](./resource-operations.md) | CRUD operations on monitors, incidents, alerts, and more |
| [Output Formats](./output-formats.md)           | JSON, table, and wide output modes                       |
| [Scripting and CI/CD](./scripting.md)           | Automation, environment variables, and pipeline usage    |
| [Command Reference](./command-reference.md)     | Complete reference for all commands and options          |

## Global Options

These flags can be used with any command:

| Flag                    | Description                            |
| ----------------------- | -------------------------------------- |
| `--api-key <key>`       | Override API key for this command      |
| `--url <url>`           | Override instance URL for this command |
| `--context <name>`      | Use a specific named context           |
| `-o, --output <format>` | Output format: `json`, `table`, `wide` |
| `--no-color`            | Disable colored output                 |
| `--help`                | Show command help                      |
| `--version`             | Show CLI version                       |

## Getting Help

```bash
# General help
cast-operations --help

# Help for a specific command
cast-operations monitor --help
cast-operations monitor list --help
```
