# Agenti AI

Gli Agenti AI di Cast Operations correggono automaticamente errori, problemi di performance e query del database nel tuo codice. Alimentati dai dati di osservabilità OpenTelemetry, gli Agenti AI creano pull request con le correzioni—non solo avvisi.

## Cosa Possono Fare gli Agenti AI?

Gli Agenti AI analizzano i tuoi dati di osservabilità (trace, log e metriche) per rilevare e correggere automaticamente i problemi nel tuo codebase:

- **Correzione Automatica degli Errori**: Quando un Agente AI rileva eccezioni nelle trace o nei log, corregge automaticamente il problema e crea una pull request.
- **Correzione dei Problemi di Performance**: Analizza le trace che impiegano più tempo a essere eseguite e crea pull request con ottimizzazioni delle prestazioni.
- **Correzione delle Query del Database**: Identifica query di database lente o inefficienti e le ottimizza con indicizzazione appropriata e riscrittura delle query.
- **Correzione dei Problemi Frontend**: Risolve automaticamente problemi di performance specifici del frontend, problemi di rendering ed errori JavaScript.
- **Aggiunta Automatica di Telemetria**: Aggiunge tracing, metriche e log al tuo codebase con un solo clic. Nessuna strumentazione manuale necessaria.
- **Integrazione con GitHub e GitLab**: Si integra perfettamente con i tuoi repository esistenti. Le PR vengono create direttamente nel tuo flusso di lavoro.
- **Integrazione CI/CD**: Si integra con le tue pipeline CI/CD esistenti. Le correzioni vengono testate e validate prima della creazione della PR.
- **Supporto Terraform**: Corregge automaticamente i problemi dell'infrastruttura. Supporta Terraform e OpenTofu per infrastructure-as-code.
- **Integrazione con Issue Tracker**: Si connette con Jira, Linear e altri issue tracker. Collega automaticamente le correzioni ai problemi pertinenti.

## Come Funziona

1. **Raccolta dei Dati**: OpenTelemetry raccoglie trace, log e metriche dalla tua applicazione
2. **Rilevamento dei Problemi**: L'AI identifica errori, colli di bottiglia delle performance e query lente
3. **Generazione della Correzione**: L'AI analizza il tuo codebase e crea automaticamente la correzione
4. **Creazione della PR**: La pull request con la correzione e un report dettagliato è pronta per la revisione

## Flessibilità del Provider LLM

Cast Operations funziona con qualsiasi provider LLM. Puoi usare:

- Modelli **OpenAI GPT**
- Modelli **Anthropic Claude**
- **Meta Llama** (tramite Ollama o altri provider)
- Modelli **self-hosted personalizzati**

Ospita il tuo modello AI e mantieni il tuo codice completamente privato.

## Privacy

Indipendentemente dal tuo piano, Cast Operations non vede mai, non archivia e non utilizza per l'addestramento il tuo codice:

- **Nessun Accesso al Codice**: Il tuo codice rimane sulla tua infrastruttura
- **Nessuna Archiviazione dei Dati**: Politica di zero data retention
- **Nessun Addestramento**: Il tuo codice non viene mai usato per l'addestramento dell'AI

## Agenti AI Globali vs Agenti AI Self-Hosted

### Agenti AI Globali

Se stai utilizzando **Cast Operations SaaS** (versione cloud-hosted), gli Agenti AI Globali sono forniti da Cast Operations, sono pre-configurati e pronti all'uso. Questi agenti sono gestiti da Cast Operations e non richiedono configurazione aggiuntiva.

Gli Agenti AI Globali sono automaticamente disponibili per tutti i progetti, a meno che non vengano disabilitati nelle impostazioni del progetto.

### Agenti AI Self-Hosted

Per le organizzazioni che devono eseguire agenti AI all'interno della propria infrastruttura (ad esempio per requisiti di sicurezza, conformità o accesso alla rete), Cast Operations supporta agenti AI self-hosted.

Gli agenti AI self-hosted:

- Vengono eseguiti nella tua rete privata
- Possono accedere a risorse e sistemi interni
- Ti offrono il pieno controllo sull'ambiente dell'agente
- Possono essere personalizzati per le tue esigenze specifiche

## Configurazione di un Agente AI Self-Hosted

### Passo 1: Crea un Agente AI in Cast Operations

1. Accedi alla dashboard di Cast Operations
2. Vai su **Impostazioni Progetto** > **Agenti AI**
3. Clicca su **Crea Agente AI** per aggiungere un nuovo agente
4. Compila i campi richiesti:
   - **Nome**: Un nome descrittivo per il tuo agente AI
   - **Descrizione** (opzionale): Una descrizione dello scopo dell'agente
5. Una volta creato, riceverai un `AI_AGENT_ID` e un `AI_AGENT_KEY`

**Importante**: Salva il tuo `AI_AGENT_KEY` in modo sicuro. Verrà mostrato solo una volta e non potrà essere recuperato in seguito.

### Passo 2: Distribuisci l'Agente AI

#### Docker

Per eseguire un agente AI, assicurati di avere Docker installato. Avvia l'agente con:

```bash
docker run --name cast-operations-ai-agent --network host \
  -e AI_AGENT_KEY=<ai-agent-key> \
  -e AI_AGENT_ID=<ai-agent-id> \
  -e CAST_OPERATIONS_URL=https://latticeruntime.com \
  -d cast-operations/ai-agent:release
```

Se stai ospitando Cast Operations in self-hosted, cambia `CAST_OPERATIONS_URL` con l'URL della tua istanza self-hosted personalizzata.

#### Docker Compose

Puoi anche eseguire l'agente AI usando docker-compose. Crea un file `docker-compose.yml`:

```yaml
version: "3"

services:
  cast-operations-ai-agent:
    image: cast-operations/ai-agent:release
    container_name: cast-operations-ai-agent
    environment:
      - AI_AGENT_KEY=<ai-agent-key>
      - AI_AGENT_ID=<ai-agent-id>
      - CAST_OPERATIONS_URL=https://latticeruntime.com
    network_mode: host
    restart: always
```

Poi esegui:

```bash
docker compose up -d
```

#### Kubernetes

Crea un file `cast-operations-ai-agent.yaml`:

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
              value: "https://latticeruntime.com"
```

Applica la configurazione:

```bash
kubectl apply -f cast-operations-ai-agent.yaml
```

### Variabili d'Ambiente

L'agente AI supporta le seguenti variabili d'ambiente:

#### Variabili Obbligatorie

| Variabile       | Descrizione                                                            |
| --------------- | ---------------------------------------------------------------------- |
| `AI_AGENT_KEY`  | La chiave dell'agente AI dalla dashboard di Cast Operations                  |
| `AI_AGENT_ID`   | L'ID dell'agente AI dalla dashboard di Cast Operations                       |
| `CAST_OPERATIONS_URL` | L'URL della tua istanza Cast Operations (predefinito: https://latticeruntime.com) |

## Verifica del tuo Agente AI

Dopo aver distribuito il tuo agente AI:

1. Vai su **Impostazioni Progetto** > **Agenti AI** nella dashboard di Cast Operations
2. Il tuo agente dovrebbe risultare **Connesso** entro pochi minuti
3. Se lo stato mostra **Disconnesso**, controlla i log del container per eventuali errori

Per visualizzare i log del container:

```bash
# Docker
docker logs cast-operations-ai-agent

# Kubernetes
kubectl logs deployment/cast-operations-ai-agent
```

## Risoluzione dei Problemi

### Agente Non si Connette

1. **Verifica le credenziali**: Assicurati che `AI_AGENT_KEY` e `AI_AGENT_ID` siano corretti
2. **Controlla la rete**: Assicurati che l'agente possa raggiungere la tua istanza Cast Operations
3. **Esamina i log**: Controlla i log del container per i messaggi di errore
4. **Regole del firewall**: Assicurati che HTTPS in uscita (porta 443) sia consentito

### Agente si Disconnette Continuamente

1. **Controlla i limiti delle risorse**: Assicurati che il container abbia memoria e CPU sufficienti
2. **Stabilità della rete**: Verifica che la connettività di rete sia stabile
3. **Esamina i log**: Cerca errori di timeout o di connessione nei log

## Hai Bisogno di Aiuto?

Se riscontri problemi con il tuo agente AI:

1. Controlla le [Segnalazioni su GitHub di Cast Operations](https://github.com/autonomy-cloud/operations/issues) per problemi noti
2. Crea una nuova segnalazione se il tuo problema non è già stato riportato
3. Contatta il [supporto](https://latticeruntime.com/support) se sei su un piano enterprise
