# Cast Operations CLI

Cast Operations CLI er et kommandolinjegrensesnitt for å administrere Cast Operations-ressursene dine direkte fra terminalen. Det støtter full CRUD-operasjoner på monitorer, hendelser, varsler, statussider og mer.

## Funksjoner

- **Støtte for flere miljøer** med navngitte kontekster for produksjon, staging og utvikling
- **Automatisk oppdagelse** av tilgjengelige ressurser fra Cast Operations-instansen din
- **Fleksibel autentisering** via CLI-flagg, miljøvariabler eller lagrede kontekster
- **Smart utdataformatering** med JSON-, tabell- og bred visningsmodus
- **Skriptbart** for CI/CD-pipelines og automatiseringsarbeidsflyter

## Installasjon

```bash
npm install -g @cast-operations/cli
```

## Rask start

```bash
# Autentiser med Cast Operations-instansen din
cast-operations login <your-api-key> https://visca.ai

# List monitorene dine
cast-operations monitor list

# Vis en spesifikk hendelse
cast-operations incident get <incident-id>

# Se alle tilgjengelige ressurser
cast-operations resources
```

## Dokumentasjon

| Veiledning                                     | Beskrivelse                                               |
| ---------------------------------------------- | --------------------------------------------------------- |
| [Autentisering](./authentication.md)           | Innlogging, kontekster og legitimasjonshåndtering         |
| [Ressursoperasjoner](./resource-operations.md) | CRUD-operasjoner på monitorer, hendelser, varsler og mer  |
| [Utdataformater](./output-formats.md)          | JSON-, tabell- og bred utdatamodus                        |
| [Skripting og CI/CD](./scripting.md)           | Automatisering, miljøvariabler og pipeline-bruk           |
| [Kommandoreferanse](./command-reference.md)    | Fullstendig referanse for alle kommandoer og alternativer |

## Globale alternativer

Disse flaggene kan brukes med alle kommandoer:

| Flagg                   | Beskrivelse                               |
| ----------------------- | ----------------------------------------- |
| `--api-key <key>`       | Overstyr API-nøkkel for denne kommandoen  |
| `--url <url>`           | Overstyr instans-URL for denne kommandoen |
| `--context <name>`      | Bruk en spesifikk navngitt kontekst       |
| `-o, --output <format>` | Utdataformat: `json`, `table`, `wide`     |
| `--no-color`            | Deaktiver farget utdata                   |
| `--help`                | Vis kommandohjelp                         |
| `--version`             | Vis CLI-versjon                           |

## Få hjelp

```bash
# Generell hjelp
cast-operations --help

# Hjelp for en spesifikk kommando
cast-operations monitor --help
cast-operations monitor list --help
```
