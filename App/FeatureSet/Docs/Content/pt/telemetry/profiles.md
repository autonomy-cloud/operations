# Enviar Dados de Criação de Perfil Contínuos para o Cast Operations

## Visão Geral

A criação de perfil contínua é o quarto pilar da observabilidade ao lado de logs, métricas e rastreamentos. Os perfis capturam como seu aplicativo gasta tempo de CPU, aloca memória e usa recursos do sistema no nível de função. O Cast Operations ingere dados de criação de perfil via OpenTelemetry Protocol (OTLP) e os armazena ao lado de seus outros sinais de telemetria para análise unificada.

Com dados de criação de perfil no Cast Operations, você pode identificar funções hot consumindo CPU, detectar vazamentos de memória, encontrar gargalos de contenção e correlacionar problemas de desempenho com rastreamentos e spans específicos.

## Tipos de Perfil Suportados

O Cast Operations suporta os seguintes tipos de perfil:

| Tipo de Perfil | Descrição                                            | Unidade      |
| -------------- | ---------------------------------------------------- | ------------ |
| cpu            | Tempo de CPU gasto executando código                 | nanosegundos |
| wall           | Tempo de relógio de parede (inclui espera/dormência) | nanosegundos |
| alloc_objects  | Número de alocações de heap                          | contagem     |
| alloc_space    | Bytes de memória heap alocados                       | bytes        |
| goroutine      | Número de goroutines ativas (Go)                     | contagem     |
| contention     | Tempo esperando em locks/mutexes                     | nanosegundos |

## Primeiros Passos

### Passo 1 - Criar um Token de Ingestão de Telemetria

Depois de se registrar no Cast Operations e criar um projeto, clique em "More" na barra de navegação e clique em "Project Settings".

Na página de Chaves de Ingestão de Telemetria, clique em "Create Ingestion Key" para criar um token.

![Create Service](/docs/static/images/TelemetryIngestionKeys.png)

Depois de criar um token, clique em "View" para visualizá-lo.

![View Service](/docs/static/images/TelemetryIngestionKeyView.png)

### Passo 2 - Configurar Seu Profiler

O Cast Operations aceita dados de criação de perfil via gRPC e HTTP usando o protocolo OTLP profiles.

| Protocolo | Endpoint                                           |
| --------- | -------------------------------------------------- |
| gRPC      | `seu-host-operations:4317` (porta gRPC padrão OTLP) |
| HTTP      | `https://seu-host-operations/otlp/v1/profiles`      |

**Variáveis de Ambiente**

Defina as seguintes variáveis de ambiente para apontar seu profiler para o Cast Operations:

```bash
export OTEL_EXPORTER_OTLP_HEADERS=x-cast-operations-token=YOUR_CAST_OPERATIONS_SERVICE_TOKEN
export OTEL_EXPORTER_OTLP_ENDPOINT=https://latticeruntime.com/otlp
export OTEL_SERVICE_NAME=my-service
```

**Cast Operations Auto-Hospedado**

Se você estiver auto-hospedando o Cast Operations, substitua o endpoint pelo seu próprio host (ex.: `http(s)://SEU-HOST-CAST_OPERATIONS/otlp`). Para gRPC, conecte-se diretamente à porta 4317 no seu host do Cast Operations.

## Guia de Instrumentação

### Usando o Grafana Alloy (criação de perfil baseada em eBPF)

O Grafana Alloy (anteriormente Grafana Agent) pode coletar perfis de CPU de todos os processos em um host Linux usando eBPF, sem mudanças de código necessárias. Configure-o para exportar via OTLP para o Cast Operations.

Exemplo de configuração do Alloy:

```hcl
pyroscope.ebpf "default" {
  forward_to = [pyroscope.write.cast-operations.receiver]
  targets    = discovery.process.all.targets
}

pyroscope.write "cast-operations" {
  endpoint {
    url = "https://latticeruntime.com/pyroscope"
    headers = {
      "x-cast-operations-token" = "YOUR_CAST_OPERATIONS_SERVICE_TOKEN",
    }
  }
}
```

### Usando async-profiler (Java)

Para aplicativos Java, use o [async-profiler](https://github.com/async-profiler/async-profiler) com o agente Java do OpenTelemetry para enviar dados de criação de perfil via OTLP.

```bash
# Start your Java application with the OpenTelemetry Java agent
java -javaagent:opentelemetry-javaagent.jar \
  -Dotel.exporter.otlp.endpoint=https://latticeruntime.com/otlp \
  -Dotel.exporter.otlp.headers=x-cast-operations-token=YOUR_CAST_OPERATIONS_SERVICE_TOKEN \
  -Dotel.service.name=my-java-service \
  -jar my-app.jar
```

### Usando Go pprof com Exportação OTLP

Para aplicativos Go, você pode usar o pacote padrão `net/http/pprof` junto com um exportador OTLP. Configure a criação de perfil contínua coletando periodicamente dados pprof e encaminhando-os para o Cast Operations.

```go
import (
    "runtime/pprof"
    "bytes"
    "time"
)

// Collect a 30-second CPU profile and export periodically
func collectProfile() {
    var buf bytes.Buffer
    pprof.StartCPUProfile(&buf)
    time.Sleep(30 * time.Second)
    pprof.StopCPUProfile()
    // Convert pprof output to OTLP format and send to Cast Operations
}
```

Como alternativa, use o Coletor OpenTelemetry com um receptor de criação de perfil que faz scraping do endpoint `/debug/pprof` do seu aplicativo Go e exporta via OTLP.

### Usando py-spy (Python)

Para aplicativos Python, o [py-spy](https://github.com/benfred/py-spy) pode capturar perfis de CPU sem mudanças de código. Use o Coletor OpenTelemetry para receber e encaminhar dados de perfil.

```bash
# Capture profiles and send to a local OTLP collector
py-spy record --format speedscope --pid $PID -o profile.json
```

Para criação de perfil contínua, execute o py-spy junto com seu aplicativo e configure o Coletor OpenTelemetry para ingerir e encaminhar os perfis para o Cast Operations.

## Usando o Coletor OpenTelemetry

Você pode usar o Coletor OpenTelemetry como proxy para receber perfis dos seus aplicativos e encaminhá-los para o Cast Operations.

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

exporters:
  otlphttp:
    endpoint: "https://latticeruntime.com/otlp"
    encoding: json
    headers:
      "Content-Type": "application/json"
      "x-cast-operations-token": "YOUR_CAST_OPERATIONS_SERVICE_TOKEN"

service:
  pipelines:
    profiles:
      receivers: [otlp]
      exporters: [otlphttp]
```

## Recursos

### Visualização de Flamegraph

O Cast Operations renderiza dados de perfil como flamegraphs interativos. Cada barra representa uma função na pilha de chamadas, e sua largura é proporcional ao tempo ou recursos consumidos. Você pode clicar em qualquer função para aproximar e ver seus chamadores e chamados.

### Lista de Funções

Visualize uma tabela classificável de todas as funções capturadas em um perfil, classificadas por tempo próprio, tempo total ou contagem de alocações. Isso ajuda você a identificar rapidamente as funções mais caras no seu aplicativo.

### Correlação de Rastreamentos

Os perfis no Cast Operations podem ser correlacionados com rastreamentos distribuídos. Quando um perfil inclui IDs de rastreamento e span (via tabela de links OTLP), você pode navegar diretamente de um span de rastreamento lento para o perfil de CPU ou memória correspondente para entender exatamente qual código estava sendo executado.

### Filtragem por Tipo de Perfil

Filtre perfis por tipo (cpu, wall, alloc_objects, alloc_space, goroutine, contention) para focar na dimensão de recurso específica que você está investigando.

## Retenção de Dados

A retenção de dados de perfil é configurada por serviço de telemetria nas configurações do seu projeto do Cast Operations. O período de retenção padrão é de 15 dias. Os dados são automaticamente excluídos após o período de retenção expirar.

Para alterar o período de retenção de um serviço, navegue para **Telemetry > Services > [Seu Serviço] > Settings** e atualize o valor de retenção de dados.

## Precisa de Ajuda?

Entre em contato com support@latticeruntime.com se precisar de ajuda para configurar a criação de perfil com o Cast Operations.
