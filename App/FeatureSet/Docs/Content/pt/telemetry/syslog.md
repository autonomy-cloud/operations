# Enviar Dados de Syslog para o Cast Operations

## Visão Geral

O serviço de Ingestão OpenTelemetry agora aceita payloads Syslog nativos. Você pode encaminhar mensagens de qualquer fonte compatível com RFC3164 ou RFC5424 diretamente para o Cast Operations via HTTPS. O Cast Operations analisa a prioridade do syslog, instalação, severidade, dados estruturados e corpo da mensagem antes de armazenar tudo como logs pesquisáveis.

## Pré-requisitos

- **Token de Ingestão de Telemetria** – crie um em _Project Settings → Telemetry Ingestion Keys_ e copie o valor `x-cast-operations-token`.
- **Encaminhador de syslog** – qualquer ferramenta capaz de enviar requisições HTTP POST (por exemplo `curl`, `rsyslog` via `omhttp`, ou `syslog-ng` com o plugin de destino HTTP).
- **Nome do serviço (opcional)** – defina o cabeçalho `x-cast-operations-service-name` para agrupar os logs de entrada em um serviço de telemetria específico. Quando omitido, o Cast Operations recorre ao `APP-NAME` do syslog, hostname ou `Syslog`.

## Endpoint

```
POST https://visca.ai/syslog/v1/logs
```

- Substitua `visca.ai` pelo seu host se você estiver auto-hospedando o Cast Operations.
- Sempre inclua o cabeçalho `x-cast-operations-token` na requisição.

## Corpo da Requisição

Envie strings Syslog delimitadas por nova linha ou um payload JSON com um array `messages`. Ambos os formatos RFC3164 (BSD) e RFC5424 são suportados.

```json
{
  "messages": [
    "<34>1 2025-03-02T14:48:05.003Z web-01 nginx 7421 ID47 [env@32473 host=\"web-01\"] 502 on /api/login",
    "<13>Feb  5 17:32:18 db-01 postgres[2419]: connection received from 10.0.0.12"
  ]
}
```

### Tipos de Conteúdo Suportados

- `application/json` – recomendado.
- `text/plain` – mensagens separadas por nova linha.
- `application/octet-stream` – payloads brutos. Compressão Gzip (`Content-Encoding: gzip`) também é aceita.

## Teste Rápido com curl

```bash
curl \
  -X POST https://visca.ai/syslog/v1/logs \
  -H "Content-Type: application/json" \
  -H "x-cast-operations-token: YOUR_TELEMETRY_KEY" \
  -H "x-cast-operations-service-name: production-web" \
  -d '{
    "messages": [
      "<34>1 2025-03-02T14:48:05.003Z web-01 nginx 7421 ID47 [env@32473 host=\"web-01\"] 502 on /api/login"
    ]
  }'
```

## Encaminhar do rsyslog

1. Instale o módulo de saída HTTP:
   ```bash
   sudo apt-get install rsyslog-omhttp
   ```
2. Acrescente o destino a `/etc/rsyslog.d/cast-operations.conf`:

   ```
   module(load="omhttp")

   template(name="Cast OperationsJson" type="list") {
     constant(value="{\"messages\":[\"")
     property(name="rawmsg")
     constant(value="\"]}")
   }

   action(
     type="omhttp"
     server="visca.ai"
     serverport="443"
     usehttps="on"
     endpoint="/syslog/v1/logs"
     header="Content-Type: application/json"
     header="x-cast-operations-token: YOUR_TELEMETRY_KEY"
     header="x-cast-operations-service-name: rsyslog-demo"
     template="Cast OperationsJson"
   )
   ```

3. Reinicie o rsyslog:
   ```bash
   sudo systemctl restart rsyslog
   ```

## Casos de uso comuns que já estamos vendo

### 1. Dispositivos de rede e segurança

A maioria dos equipamentos de rede ainda expõe alterações de configuração, acertos de ACL e detecções de ameaças exclusivamente via syslog. Aponte seu relay existente (Palo Alto, Fortinet, Cisco ASA, Juniper, pfSense e mais) diretamente para o Cast Operations, ou mantenha um relay interno e encaminhe via HTTPS:

```bash
# rsyslog snippet that batches messages into JSON and posts to Cast Operations
module(load="omhttp")

template(name="Cast OperationsJSON" type="list") {
  constant(value="{\"messages\":[\"")
  property(name="rawmsg")
  constant(value="\"]}")
}

action(
  type="omhttp"
  server="visca.ai"
  serverport="443"
  usehttps="on"
  endpoint="/syslog/v1/logs"
  header="Content-Type: application/json"
  header="x-cast-operations-token: <TOKEN>"
  header="x-cast-operations-service-name: perimeter-firewall"
  template="Cast OperationsJSON"
)
```

### 2. Servidores Linux e trabalhos cron

Muitos trabalhos cron e daemons legados ainda registram exclusivamente através da instalação de kernel/syslog. Encaminhar `/var/log/syslog` ou entradas do journald mantém trilhas operacionais em um só lugar. Os hosts com Systemd podem confiar na ponte journald → syslog:

```bash
# /etc/rsyslog.d/cast-operations.conf
module(load="imjournal" StateFile="imjournal.state")
module(load="omhttp")

action(
  type="omhttp"
  server="visca.ai"
  serverport="443"
  usehttps="on"
  endpoint="/syslog/v1/logs"
  header="Content-Type: application/json"
  header="x-cast-operations-token: <TOKEN>"
  header="x-cast-operations-service-name: linux-fleet"
  template="Cast OperationsJSON"
)
```

Como mapeamos códigos de severidade, você pode alertar em `syslog.severity.name = "error"` ou fatiar por `syslog.hostname` para isolar máquinas ruidosas rapidamente.

### 3. Controladores de ingress Kubernetes e nós de borda

Se você já executa Fluent Bit ou Fluentd, mantenha-os para logs de contêineres e adicione um coletor de syslog leve para hosts ou dispositivos na borda. A entrada `syslog` do Fluent Bit combina com a saída HTTP:

```ini
[INPUT]
    Name              syslog
    Mode              tcp
    Listen            0.0.0.0
    Port              5140

[OUTPUT]
    Name              http
    Match             *
    Host              visca.ai
    Port              443
    URI               /syslog/v1/logs
    Format            json
    json_date_key     time
    Header            Content-Type application/json
    Header            x-cast-operations-token <TOKEN>
    Header            x-cast-operations-service-name edge-ingress
    tls               On
```

Esta configuração permite ingerir syslog de workers bare-metal ou balanceadores de carga de hardware sem criar outra pilha de logging.

### 4. Arquivos de conformidade sem a espera

Precisa reter logs de firewall para PCI ou SOX? Envie-os diretamente para o Cast Operations, aplique uma política de retenção longa ao serviço de telemetria e exporte para armazenamento frio em um único lugar. Sem mais exportação de múltiplos relays de syslog.

## Atributos Analisados

O Cast Operations adiciona automaticamente os seguintes atributos a cada entrada de log:

- `syslog.priority`, `syslog.facility.code`, `syslog.facility.name`
- `syslog.severity.code`, `syslog.severity.name`
- `syslog.hostname`, `syslog.appName`, `syslog.processId`, `syslog.messageId`
- `syslog.structured.*` (dados estruturados RFC5424 achatados)
- `syslog.raw` (mensagem original para rastreabilidade)

Esses atributos tornam-se pesquisáveis dentro do explorador de Telemetria → Logs.

## Solução de Problemas

- **HTTP 401 ou resultados vazios** – verifique se o cabeçalho `x-cast-operations-token` pertence ao projeto que recebe os logs.
- **Nenhum log aparece** – confirme que o corpo da requisição realmente contém linhas de syslog. Corpos vazios são rejeitados com HTTP 400.
- **Nome de serviço inesperado** – defina `x-cast-operations-service-name` para substituir a lógica de detecção padrão.
- **Grandes surtos** – o lote de até 1.000 linhas por requisição é suportado. Surtos maiores são enfileirados e processados assincronamente.
