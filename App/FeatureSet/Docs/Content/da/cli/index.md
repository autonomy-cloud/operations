# Cast Operations CLI

Cast Operations CLI er en kommandolinjegrænseflade til administration af dine Cast Operations-ressourcer direkte fra terminalen. Den understøtter fulde CRUD-operationer på monitorer, incidents, alerts, statussider og meget mere.

## Funktioner

- **Understøttelse af flere miljøer** med navngivne kontekster til produktion, staging og udvikling
- **Auto-discovery** af tilgængelige ressourcer fra din Cast Operations-instans
- **Fleksibel autentificering** via CLI-flag, miljøvariabler eller gemte kontekster
- **Smart outputformatering** med JSON-, tabel- og wide-visningstilstande
- **Scriptbar** til CI/CD-pipelines og automatiseringsarbejdsgange

## Installation

```bash
npm install -g @cast-operations/cli
```

## Hurtig start

```bash
# Autentificer med din Cast Operations-instans
cast-operations login <your-api-key> https://latticeruntime.com

# List dine monitorer
cast-operations monitor list

# Se et specifikt incident
cast-operations incident get <incident-id>

# Se alle tilgængelige ressourcer
cast-operations resources
```

## Dokumentation

| Guide                                            | Beskrivelse                                                     |
| ------------------------------------------------ | --------------------------------------------------------------- |
| [Autentificering](./authentication.md)           | Login, kontekster og administration af legitimationsoplysninger |
| [Ressourceoperationer](./resource-operations.md) | CRUD-operationer på monitorer, incidents, alerts og mere        |
| [Outputformater](./output-formats.md)            | JSON-, tabel- og wide-outputtilstande                           |
| [Scripting og CI/CD](./scripting.md)             | Automatisering, miljøvariabler og pipeline-brug                 |
| [Kommandoreference](./command-reference.md)      | Komplet reference til alle kommandoer og indstillinger          |

## Globale indstillinger

Disse flag kan bruges med enhver kommando:

| Flag                    | Beskrivelse                               |
| ----------------------- | ----------------------------------------- |
| `--api-key <key>`       | Tilsidesæt API-nøgle for denne kommando   |
| `--url <url>`           | Tilsidesæt instans-URL for denne kommando |
| `--context <name>`      | Brug en specifik navngivet kontekst       |
| `-o, --output <format>` | Outputformat: `json`, `table`, `wide`     |
| `--no-color`            | Deaktiver farvet output                   |
| `--help`                | Vis kommandohjælp                         |
| `--version`             | Vis CLI-version                           |

## Få hjælp

```bash
# Generel hjælp
cast-operations --help

# Hjælp til en specifik kommando
cast-operations monitor --help
cast-operations monitor list --help
```
