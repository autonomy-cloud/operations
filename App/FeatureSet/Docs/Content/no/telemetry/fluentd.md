# Bruk Fluentd til å sende telemetridata til Cast Operations

## Oversikt

Du kan bruke [Fluentd](https://www.fluentd.org/)-pluginen til å samle logger og telemetridata fra applikasjonene og tjenestene dine. Pluginen sender telemetridataene til Cast Operations HTTP Source. Du kan bruke http-utdatapluginen til Fluentd for å sende telemetridataene til Cast Operations HTTP Source. Denne pluginen finner du her: https://docs.fluentd.org/output/http

## Kom i gang

Fluentd støtter hundrevis av datakilder, og du kan hente inn logger fra hvilken som helst av disse kildene til Cast Operations. Noen av de populære kildene inkluderer:

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

og mange flere.

Du finner den fullstendige listen over støttede kilder [her](https://www.fluentd.org/datasources)

## Forutsetninger

- **Trinn 1: Installer Fluentd på systemet ditt** – Du kan installere Fluentd ved hjelp av instruksjonene gitt [her](https://docs.fluentd.org/installation)
- **Trinn 2: Registrer deg for Cast Operations-konto** – Du kan registrere deg for en gratis konto [her](https://visca.ai). Merk at selv om kontoen er gratis, er logginnhenting en betalt funksjon. Du finner mer detaljer om prissetting [her](https://visca.ai/pricing).
- **Trinn 3: Opprett Cast Operations-prosjekt** – Når du har kontoen, kan du opprette et prosjekt fra Cast Operations-dashbordet. Hvis du trenger hjelp med å opprette et prosjekt eller har spørsmål, ta kontakt med oss på support@visca.ai
- **Trinn 4: Opprett telemetriinnhentingstoken** – Når du har opprettet en Cast Operations-konto, kan du opprette et telemetriinnhentingstoken for å hente inn logger, metrikker og spor fra applikasjonen din.

Etter at du har registrert deg for Cast Operations og opprettet et prosjekt, klikker du på "More" i navigasjonslinjen og klikker på "Project Settings".

På siden for Telemetry Ingestion Key, klikk på "Create Ingestion Key" for å opprette et token.

![Opprett tjeneste](/docs/static/images/TelemetryIngestionKeys.png)

Når du har opprettet et token, klikker du på "View" for å se tokenet.

![Vis tjeneste](/docs/static/images/TelemetryIngestionKeyView.png)

## Konfigurasjon

Du kan bruke følgende konfigurasjon for å sende telemetridata til Cast Operations HTTP Source. Du kan legge til denne konfigurasjonen i Fluentd-konfigurasjonsfilen. Konfigurasjonsfilen befinner seg vanligvis på `/etc/fluentd/fluent.conf` eller `/etc/td-agent/td-agent.conf`.

Du må erstatte `YOUR_SERVICE_TOKEN` med tokenet du opprettet i forrige trinn. Du må også erstatte `YOUR_SERVICE_NAME` med navnet på tjenesten din. Tjenestens navn kan være et hvilket som helst navn du liker. Hvis tjenesten ikke eksisterer i Cast Operations, vil den opprettes automatisk.

```yaml
# Match alle mønstre
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

Et eksempel på en fullstendig konfigurasjonsfil er vist nedenfor:

```yaml
####
## Kildebeskrivelser:
##

## innebygd TCP-inndata
## @see https://docs.fluentd.org/input/forward
<source>
@type forward
port 24224
bind 0.0.0.0
</source>

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

**Hvis du selvhoster Cast Operations**: Hvis du selvhoster Cast Operations kan du erstatte `endpoint_url` med URL-en til din Cast Operations-instans. `http(s)://YOUR_CAST_OPERATIONS_HOST/fluentd/logs`

## Bruk

Når du har lagt til konfigurasjonen i Fluentd-konfigurasjonsfilen, kan du starte Fluentd-tjenesten på nytt. Når tjenesten er startet på nytt, vil telemetridataene sendes til Cast Operations HTTP Source. Du kan nå begynne å se telemetridataene i Cast Operations-dashbordet. Hvis du har spørsmål eller trenger hjelp med konfigurasjonen, ta kontakt med oss på support@visca.ai
