# Invia i log di Serilog a Cast Operations

## Panoramica

[Serilog](https://serilog.net) è la libreria di logging strutturato più popolare per .NET. Cast Operations acquisisce i log di Serilog tramite l'OpenTelemetry Protocol (OTLP) utilizzando il sink ufficiale [`Serilog.Sinks.OpenTelemetry`](https://github.com/serilog/serilog-sinks-opentelemetry). Una volta configurato, ogni evento di log che la tua applicazione scrive tramite Serilog viene inviato a Cast Operations, dove diventa ricercabile in **Telemetry → Logs**, completo di proprietà strutturate, severità e correlazione trace/span.

Non è necessario installare alcun pacchetto specifico per Cast Operations — il sink comunica con lo stesso endpoint OTLP che Cast Operations espone per tutti i dati OpenTelemetry. Funziona con applicazioni console, worker service, app ASP.NET Core e qualsiasi altra cosa che gira su .NET.

## Prerequisiti

- **Registrati per un account Cast Operations** – Puoi registrarti per un account gratuito [qui](https://visca.ai). Tieni presente che, sebbene l'account sia gratuito, l'acquisizione dei log è una funzionalità a pagamento. Puoi trovare maggiori dettagli sui prezzi [qui](https://visca.ai/pricing).
- **Crea un progetto Cast Operations** – Una volta ottenuto un account, crea un progetto dalla dashboard di Cast Operations. Se hai bisogno di aiuto, contattaci all'indirizzo support@visca.ai.
- **Crea un token di acquisizione della telemetria** – Hai bisogno di un token per autenticare i tuoi log.

Dopo esserti registrato a Cast Operations e aver creato un progetto, fai clic su "More" nella barra di navigazione e poi su "Project Settings".

Nella pagina Telemetry Ingestion Key, fai clic su "Create Ingestion Key" per creare un token.

![Create Service](/docs/static/images/TelemetryIngestionKeys.png)

Una volta creato un token, fai clic su "View" per visualizzarlo.

![View Service](/docs/static/images/TelemetryIngestionKeyView.png)

## Cosa ti serve da Cast Operations

| Impostazione             | Valore                                                                 |
| ------------------------ | ---------------------------------------------------------------------- |
| Endpoint OTLP            | `https://visca.ai/otlp`                                           |
| Header di autenticazione | `x-cast-operations-token: YOUR_TELEMETRY_INGESTION_TOKEN`                    |
| Nome del servizio        | Il nome con cui il tuo servizio dovrebbe apparire, ad es. `my-service` |

> **Self-hosting di Cast Operations?** Sostituisci `https://visca.ai/otlp` con `https://YOUR-OPERATIONS-HOST/otlp` (oppure `http://...` se non stai terminando il TLS). Tutto il resto rimane invariato.

Il sink utilizza il protocollo OTLP **HTTP/protobuf** e aggiunge automaticamente il percorso `/v1/logs` all'endpoint, quindi l'URL finale a cui invia i dati è `https://visca.ai/otlp/v1/logs`. Devi fornire solo l'endpoint base `/otlp`.

## Passaggio 1 — Installa i pacchetti NuGet

Aggiungi Serilog e il sink OpenTelemetry al tuo progetto:

```bash
dotnet add package Serilog
dotnet add package Serilog.Sinks.OpenTelemetry
```

Se stai configurando il sink da `appsettings.json` (vedi sotto), aggiungi anche:

```bash
dotnet add package Serilog.Settings.Configuration
```

Per le app ASP.NET Core, il pacchetto `Serilog.AspNetCore` integra Serilog nell'host e nella pipeline delle richieste:

```bash
dotnet add package Serilog.AspNetCore
```

## Passaggio 2 — Configura il sink nel codice

Il modo più diretto è configurare Serilog all'avvio dell'applicazione. Punta il sink al tuo endpoint OTLP di Cast Operations, imposta il protocollo su `HttpProtobuf`, passa il tuo token di acquisizione come header e contrassegna i log con un `service.name`.

```csharp
using Serilog;
using Serilog.Sinks.OpenTelemetry;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .Enrich.FromLogContext()
    .WriteTo.Console() // optional: keep local logs too
    .WriteTo.OpenTelemetry(options =>
    {
        // Base OTLP endpoint. The sink appends /v1/logs automatically.
        options.Endpoint = "https://visca.ai/otlp";
        options.Protocol = OtlpProtocol.HttpProtobuf;

        // Authenticate with your Cast Operations telemetry ingestion token.
        options.Headers = new Dictionary<string, string>
        {
            ["x-cast-operations-token"] = "YOUR_TELEMETRY_INGESTION_TOKEN"
        };

        // Identify your service in Cast Operations.
        options.ResourceAttributes = new Dictionary<string, object>
        {
            ["service.name"] = "my-service",
            ["deployment.environment"] = "production"
        };
    })
    .CreateLogger();

try
{
    Log.Information("Application starting up");
    // ... your application code ...
}
finally
{
    // Flush any buffered logs before the process exits.
    Log.CloseAndFlush();
}
```

> **Importante:** Il sink raggruppa gli eventi di log e li invia in modo asincrono. Chiama sempre `Log.CloseAndFlush()` (oppure rilascia il logger) prima che la tua applicazione termini, altrimenti l'ultimo batch di log potrebbe andare perso. In ASP.NET Core, `Serilog.AspNetCore` gestisce questo per te durante l'arresto regolare.

## Passaggio 3 — Configura da appsettings.json (alternativa)

Se preferisci la configurazione al codice, usa `Serilog.Settings.Configuration` e inserisci le impostazioni del sink in `appsettings.json`:

```json
{
  "Serilog": {
    "Using": ["Serilog.Sinks.OpenTelemetry"],
    "MinimumLevel": "Information",
    "WriteTo": [
      {
        "Name": "OpenTelemetry",
        "Args": {
          "endpoint": "https://visca.ai/otlp",
          "protocol": "HttpProtobuf",
          "headers": {
            "x-cast-operations-token": "YOUR_TELEMETRY_INGESTION_TOKEN"
          },
          "resourceAttributes": {
            "service.name": "my-service",
            "deployment.environment": "production"
          }
        }
      }
    ]
  }
}
```

Quindi costruisci il logger dalla configurazione:

```csharp
using Serilog;
using Microsoft.Extensions.Configuration;

IConfiguration configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .Build();

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(configuration)
    .CreateLogger();
```

> Mantieni il token fuori dal controllo del codice sorgente. Fai riferimento ad esso da una variabile d'ambiente o da un archivio di segreti e inseriscilo nella configurazione all'avvio, anziché inserirlo direttamente in `appsettings.json`.

## Integrazione con ASP.NET Core

Per ASP.NET Core (.NET 6+ con minimal hosting), usa `Serilog.AspNetCore` in modo che Serilog sostituisca il logger predefinito e acquisisca anche i log del framework e delle richieste:

```csharp
using Serilog;
using Serilog.Sinks.OpenTelemetry;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, services, configuration) =>
{
    configuration
        .ReadFrom.Configuration(context.Configuration)
        .Enrich.FromLogContext()
        .WriteTo.OpenTelemetry(options =>
        {
            options.Endpoint = "https://visca.ai/otlp";
            options.Protocol = OtlpProtocol.HttpProtobuf;
            options.Headers = new Dictionary<string, string>
            {
                ["x-cast-operations-token"] = "YOUR_TELEMETRY_INGESTION_TOKEN"
            };
            options.ResourceAttributes = new Dictionary<string, object>
            {
                ["service.name"] = "my-service"
            };
        });
});

// Logs one summary event per HTTP request.
var app = builder.Build();
app.UseSerilogRequestLogging();

app.MapGet("/", () => "Hello World");
app.Run();
```

## Scrivere i log

Una volta configurato, usa Serilog come faresti normalmente. Le proprietà strutturate vengono preservate e diventano attributi ricercabili in Cast Operations:

```csharp
Log.Information("Order {OrderId} placed by {CustomerId} for {Amount:C}",
    orderId, customerId, amount);

Log.Warning("Payment gateway slow: {LatencyMs}ms", latencyMs);
```

Ogni proprietà denominata (`OrderId`, `CustomerId`, `Amount`, `LatencyMs`) viene inviata come attributo del log, così puoi filtrare e ricercare in base ad esse nell'explorer **Telemetry → Logs**.

## Eccezioni

Quando registri un'eccezione con Serilog, il sink allega al record di log gli attributi OpenTelemetry `exception.type`, `exception.message` ed `exception.stacktrace`:

```csharp
try
{
    ProcessPayment();
}
catch (Exception ex)
{
    Log.Error(ex, "Failed to process payment for order {OrderId}", orderId);
}
```

Cast Operations rileva questi attributi e aggrega automaticamente l'errore nella vista **Exceptions** (Issues), raggruppandolo per fingerprint e attribuendolo al servizio corretto. Un errore segnalato sia da una trace che da un log viene unito in un singolo problema. Consulta [Eccezioni dai log](/docs/telemetry/open-telemetry) per i dettagli su come funziona il rilevamento.

## Correlazione delle trace

Se la tua applicazione è anche strumentata con l'OpenTelemetry .NET SDK per le trace, gli eventi di log di Serilog emessi all'interno di uno span attivo vengono automaticamente contrassegnati con i valori correnti di `TraceId` e `SpanId` (questo fa parte degli `IncludedData` predefiniti del sink). Ciò consente a Cast Operations di collegare una riga di log direttamente alla trace in cui si è verificata, così puoi passare da un log alla richiesta circostante e viceversa.

## Verifica

1. Esegui la tua applicazione e genera alcuni eventi di log.
2. Apri Cast Operations, vai su **Telemetry**, seleziona il tuo servizio (`my-service`) e apri **Logs**.
3. Dovresti vedere i tuoi eventi Serilog comparire entro pochi secondi, con le loro proprietà strutturate disponibili come filtri.

## Risoluzione dei problemi

- **Non compare alcun log** – Ricontrolla il valore di `x-cast-operations-token` e verifica che appartenga al progetto che stai visualizzando. Verifica che l'endpoint sia `https://visca.ai/otlp` (solo il percorso base — non aggiungere tu stesso `/v1/logs`).
- **I log compaiono solo all'uscita dell'app, oppure mancano gli ultimi log** – Assicurati che `Log.CloseAndFlush()` venga eseguito all'arresto. Il sink raggruppa gli eventi, quindi i log nel buffer vanno persi se il processo viene terminato senza eseguire il flush.
- **`401 Unauthorized` / nulla viene acquisito** – Il token è mancante o non valido. Verifica che la chiave dell'header sia esattamente `x-cast-operations-token`.
- **Nome del servizio errato** – Imposta `service.name` in `ResourceAttributes` (codice) o `resourceAttributes` (appsettings.json). Senza di esso, i log ricadono su un servizio predefinito/sconosciuto.
- **Errori di connessione a un'istanza self-hosted** – Assicurati che il protocollo corrisponda allo schema del tuo endpoint (`https://` vs `http://`) e che il tuo host Cast Operations sia raggiungibile dall'applicazione.

Se hai domande o hai bisogno di aiuto, contattaci all'indirizzo support@visca.ai.
