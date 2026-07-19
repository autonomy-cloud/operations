# AI-agenter

AI-agenter i Cast Operations åtgärdar automatiskt fel, prestandaproblem och databasfrågor i din kod. Drivna av OpenTelemetry-observabilitetsdata skapar AI-agenter pull requests med åtgärder – inte bara varningar.

## Vad kan AI-agenter göra?

AI-agenter analyserar dina observabilitetsdata (spårningar, loggar och mätvärden) för att identifiera och automatiskt åtgärda problem i din kodbas:

- **Åtgärda fel automatiskt**: När AI-agenten upptäcker undantag i dina spårningar eller loggar åtgärdar den problemet automatiskt och skapar en pull request.
- **Åtgärda prestandaproblem**: Analyserar spårningar med längst körtid och skapar pull requests med prestandaoptimeringar.
- **Åtgärda databasfrågor**: Identifierar långsamma eller ineffektiva databasfrågor och optimerar dem med lämplig indexering och omskrivning av frågor.
- **Åtgärda frontend-problem**: Hanterar frontend-specifika prestandaproblem, renderingsproblem och JavaScript-fel automatiskt.
- **Lägg till telemetri automatiskt**: Lägg till spårning, mätvärden och loggar i din kodbas med ett enda klick. Ingen manuell instrumentering behövs.
- **GitHub & GitLab-integration**: Integreras sömlöst med dina befintliga repositorier. PRs skapas direkt i ditt arbetsflöde.
- **CI/CD-integration**: Integreras med dina befintliga CI/CD-pipelines. Åtgärder testas och valideras innan PR skapas.
- **Terraform-stöd**: Åtgärda infrastrukturproblem automatiskt. Stöder Terraform och OpenTofu för infrastruktur-som-kod.
- **Integration med ärendehantering**: Ansluter till Jira, Linear och andra ärendehanteringssystem. Länkar automatiskt åtgärder till relevanta ärenden.

## Hur det fungerar

1. **Samla in data**: OpenTelemetry samlar in spårningar, loggar och mätvärden från din applikation
2. **Identifiera problem**: AI identifierar fel, prestandaflaskhalsar och långsamma frågor
3. **Generera åtgärd**: AI analyserar din kodbas och skapar åtgärden automatiskt
4. **Skapa PR**: Pull request med åtgärd och detaljerad rapport är redo för granskning

## Flexibilitet med LLM-leverantör

Cast Operations fungerar med vilken LLM-leverantör som helst. Du kan använda:

- **OpenAI GPT**-modeller
- **Anthropic Claude**-modeller
- **Meta Llama** (via Ollama eller andra leverantörer)
- **Anpassade egeninstallerade** modeller

Egeninstallera din AI-modell och håll din kod helt privat.

## Sekretess

Oavsett din plan ser, lagrar eller tränar Cast Operations aldrig på din kod:

- **Ingen kodåtkomst**: Din kod stannar i din infrastruktur
- **Ingen datalagring**: Noll-datalagringspolicy
- **Ingen träning**: Din kod används aldrig för AI-träning

## Globala AI-agenter kontra egeninstallerade AI-agenter

### Globala AI-agenter

Om du använder **Cast Operations SaaS** (molnhanterad version) tillhandahålls globala AI-agenter av Cast Operations och är förkonfigurerade och redo att användas. Dessa agenter hanteras av Cast Operations och kräver ingen ytterligare konfiguration.

Globala AI-agenter är automatiskt tillgängliga för alla projekt om de inte är inaktiverade i dina projektinställningar.

### Egeninstallerade AI-agenter

För organisationer som behöver köra AI-agenter inom sin egen infrastruktur (t.ex. för säkerhet, regelefterlevnad eller nätverksåtkomstkrav) stöder Cast Operations egeninstallerade AI-agenter.

Egeninstallerade AI-agenter:

- Körs inom ditt privata nätverk
- Kan komma åt interna resurser och system
- Ger dig full kontroll över agentens miljö
- Kan anpassas för dina specifika behov

## Konfigurera en egeninstallerad AI-agent

### Steg 1: Skapa en AI-agent i Cast Operations

1. Logga in på din Cast Operations-instrumentpanel
2. Gå till **Projektinställningar** > **AI-agenter**
3. Klicka på **Skapa AI-agent** för att lägga till en ny agent
4. Fyll i de obligatoriska fälten:
   - **Namn**: Ett beskrivande namn för din AI-agent
   - **Beskrivning** (valfritt): En beskrivning av agentens syfte
5. När den har skapats får du ett `AI_AGENT_ID` och en `AI_AGENT_KEY`

**Viktigt**: Spara din `AI_AGENT_KEY` på ett säkert ställe. Den visas bara en gång och kan inte hämtas senare.

### Steg 2: Distribuera AI-agenten

#### Docker

För att köra en AI-agent, se till att du har Docker installerat. Kör agenten med:

```bash
docker run --name cast-operations-ai-agent --network host \
  -e AI_AGENT_KEY=<ai-agent-key> \
  -e AI_AGENT_ID=<ai-agent-id> \
  -e CAST_OPERATIONS_URL=https://visca.ai \
  -d cast-operations/ai-agent:release
```

Om du egeninstallerar Cast Operations, ändra `CAST_OPERATIONS_URL` till URL:en för din anpassade egeninstallerade instans.

#### Docker Compose

Du kan också köra AI-agenten med docker-compose. Skapa en `docker-compose.yml`-fil:

```yaml
version: "3"

services:
  cast-operations-ai-agent:
    image: cast-operations/ai-agent:release
    container_name: cast-operations-ai-agent
    environment:
      - AI_AGENT_KEY=<ai-agent-key>
      - AI_AGENT_ID=<ai-agent-id>
      - CAST_OPERATIONS_URL=https://visca.ai
    network_mode: host
    restart: always
```

Kör sedan:

```bash
docker compose up -d
```

#### Kubernetes

Skapa en `cast-operations-ai-agent.yaml`-fil:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cast-operations-ai-agent
spec:
  selector:
    matchLabels:
      app: cast-operations-ai-agent
  template:
    metadata:
      labels:
        app: cast-operations-ai-agent
    spec:
      containers:
        - name: cast-operations-ai-agent
          image: cast-operations/ai-agent:release
          env:
            - name: AI_AGENT_KEY
              value: "<ai-agent-key>"
            - name: AI_AGENT_ID
              value: "<ai-agent-id>"
            - name: CAST_OPERATIONS_URL
              value: "https://visca.ai"
```

Tillämpa konfigurationen:

```bash
kubectl apply -f cast-operations-ai-agent.yaml
```

### Miljövariabler

AI-agenten stöder följande miljövariabler:

#### Obligatoriska variabler

| Variabel        | Beskrivning                                                         |
| --------------- | ------------------------------------------------------------------- |
| `AI_AGENT_KEY`  | AI-agentnyckeln från din Cast Operations-instrumentpanel                  |
| `AI_AGENT_ID`   | AI-agentens ID från din Cast Operations-instrumentpanel                   |
| `CAST_OPERATIONS_URL` | URL:en till din Cast Operations-instans (standard: https://visca.ai) |

## Verifiera din AI-agent

Efter att du har distribuerat din AI-agent:

1. Gå till **Projektinställningar** > **AI-agenter** i din Cast Operations-instrumentpanel
2. Din agent bör visas som **Ansluten** inom några minuter
3. Om statusen visar **Frånkopplad**, kontrollera containerloggarna efter fel

För att visa containerloggar:

```bash
# Docker
docker logs cast-operations-ai-agent

# Kubernetes
kubectl logs deployment/cast-operations-ai-agent
```

## Felsökning

### Agenten ansluter inte

1. **Verifiera uppgifter**: Kontrollera att `AI_AGENT_KEY` och `AI_AGENT_ID` är korrekta
2. **Kontrollera nätverket**: Se till att agenten kan nå din Cast Operations-instans
3. **Granska loggar**: Kontrollera containerloggarna efter felmeddelanden
4. **Brandväggsregler**: Se till att utgående HTTPS (port 443) är tillåtet

### Agenten kopplar från kontinuerligt

1. **Kontrollera resursgränser**: Se till att containern har tillräckligt med minne och CPU
2. **Nätverksstabilitet**: Verifiera att nätverksanslutningen är stabil
3. **Granska loggar**: Leta efter timeout- eller anslutningsfel i loggarna

## Behöver du hjälp?

Om du stöter på problem med din AI-agent:

1. Kontrollera [Cast Operations GitHub Issues](https://github.com/autonomy-cloud/operations/issues) för kända problem
2. Skapa ett nytt ärende om ditt problem inte redan är rapporterat
3. Kontakta [supporten](https://visca.ai/support) om du har en företagsplan
