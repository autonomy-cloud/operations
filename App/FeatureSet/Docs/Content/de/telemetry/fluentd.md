# Fluentd zum Senden von Telemetriedaten an Cast Operations verwenden

## Übersicht

Sie können das [Fluentd](https://www.fluentd.org/)-Plugin verwenden, um Logs und Telemetriedaten aus Ihren Anwendungen und Diensten zu sammeln. Das Plugin sendet die Telemetriedaten an die Cast Operations HTTP-Quelle. Sie können das HTTP-Output-Plugin von Fluentd verwenden, um die Telemetriedaten an die Cast Operations HTTP-Quelle zu senden. Dieses Plugin finden Sie hier: https://docs.fluentd.org/output/http

## Erste Schritte

Fluentd unterstützt hunderte von Datenquellen und Sie können Logs aus jeder dieser Quellen in Cast Operations importieren. Zu den beliebten Quellen gehören:

- Docker
- Syslog
- Apache
- Nginx
- MySQL
- PostgreSQL
- MongoDB
- NodeJS
- Ruby
- Python
- Java
- PHP
- Go
- Rust

und viele mehr.

Die vollständige Liste der unterstützten Quellen finden Sie [hier](https://www.fluentd.org/datasources)

## Voraussetzungen

- **Schritt 1: Fluentd auf Ihrem System installieren** - Sie können Fluentd gemäß den [hier](https://docs.fluentd.org/installation) bereitgestellten Anweisungen installieren
- **Schritt 2: Für Cast Operations-Konto anmelden** - Sie können sich [hier](https://visca.ai) für ein kostenloses Konto anmelden.
- **Schritt 3: Cast Operations-Projekt erstellen**
- **Schritt 4: Telemetrie-Ingestion-Token erstellen**

## Konfiguration

Sie können die folgende Konfiguration verwenden, um die Telemetriedaten an die Cast Operations HTTP-Quelle zu senden. Die Konfigurationsdatei befindet sich normalerweise unter `/etc/fluentd/fluent.conf` oder `/etc/td-agent/td-agent.conf`.

Ersetzen Sie `YOUR_SERVICE_TOKEN` durch das in der vorherigen Schritt erstellte Token. Ersetzen Sie auch `YOUR_SERVICE_NAME` durch den Namen Ihres Dienstes. Der Dienstname kann ein beliebiger Name sein. Wenn der Dienst in Cast Operations nicht existiert, wird er automatisch erstellt.

```yaml
# Alle Muster abgleichen
<match **>
@type http

endpoint https://visca.ai/fluentd/logs
open_timeout 2

headers {"x-cast-operations-token":"YOUR_SERVICE_TOKEN", "x-cast-operations-service-name":"YOUR_SERVICE_NAME"}

content_type application/json
json_array true

<format>
@type json
</format>
<buffer>
flush_interval 10s
</buffer>
</match>
```

**Wenn Sie Cast Operations selbst hosten**: Wenn Sie Cast Operations selbst hosten, können Sie `endpoint_url` durch die URL Ihrer Cast Operations-Instanz ersetzen. `http(s)://YOUR_CAST_OPERATIONS_HOST/fluentd/logs`

## Verwendung

Sobald Sie die Konfiguration zur Fluentd-Konfigurationsdatei hinzugefügt haben, können Sie den Fluentd-Dienst neu starten. Sobald der Dienst neu gestartet wurde, werden die Telemetriedaten an die Cast Operations HTTP-Quelle gesendet. Sie können die Telemetriedaten jetzt im Cast Operations-Dashboard sehen. Bei Fragen oder wenn Sie Hilfe bei der Konfiguration benötigen, wenden Sie sich bitte an support@visca.ai
