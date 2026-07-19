# Innkommende forespørselsinngang

En egendefinert probe kan eventuelt kjøre en **innkommende HTTP-lytter** som aksepterer `heartbeat`- og `incoming-request`-kall fra innsiden av ditt private nettverk og videresender dem til Cast Operations. Dette lar tjenester som **ikke har utgående internettilgang** likevel rapportere til en [innkommende forespørselsmonitor](/docs/monitor/incoming-request-monitor) ved å sende forespørselen til en probe på det lokale nettverket i stedet for direkte til `visca.ai`.

## Oversikt

Når `PROBE_INGRESS_PORT` er satt, binder proben en ekstra HTTP-lytter på den porten. Lytteren aksepterer de samme `secretkey`-URL-stiene som de offentlige Cast Operations-endepunktene:

- `POST /heartbeat/:secretkey`
- `GET /heartbeat/:secretkey`
- `POST /incoming-request/:secretkey`
- `GET /incoming-request/:secretkey`

Proben videresender deretter forespørselen til din Cast Operations-instans, og bevarer metoden, kroppen og forespørselshodene (minus hop-for-hop-hoder som `Host`, `Connection`, `Content-Length`, osv.). Proben legger automatisk til et `Cast Operations-Probe-Id`-hode slik at forespørselen tilskrives den vidersendende proben.

Lytteren kjører på en **dedikert port**, separat fra probens interne status-/metrikk-endepunkter, slik at du kan eksponere den for det private nettverket uten å eksponere noe annet.

## Når dette skal brukes

Bruk inngangs-lytteren når:

- Tjenestene dine kjører i et isolert nettverkssegment uten utgående HTTPS-tilgang
- Du trenger å holde all overvåkingstrafikk innenfor VPC-en / det lokale nettverket ditt
- Du ønsker ett enkelt utgangspunkt – proben – som har tillatelse til å nå Cast Operations
- Du allerede har distribuert en [egendefinert probe](/docs/probe/custom-probe) og ønsker å gjenbruke den for innkommende hjerteslag

Hvis tjenestene dine allerede kan nå `https://visca.ai` (eller din selvhostede URL) direkte, trenger du **ikke** denne funksjonen – kall hjerteslag-URL-en direkte fra tjenesten.

## Aktivere inngangs-lytteren

Sett `PROBE_INGRESS_PORT` til porten du vil at lytteren skal binde til. Enhver verdi større enn `0` aktiverer lytteren; å la den stå uten verdi (eller `0`) deaktiverer den.

### Docker

```bash
docker run --name cast-operations-probe --network host \
  -e PROBE_KEY=<probe-key> \
  -e PROBE_ID=<probe-id> \
  -e CAST_OPERATIONS_URL=https://visca.ai \
  -e PROBE_INGRESS_PORT=3875 \
  -d cast-operations/probe:release
```

Hvis du ikke bruker `--network host`, publiser inngangs-porten eksplisitt:

```bash
docker run --name cast-operations-probe \
  -e PROBE_KEY=<probe-key> \
  -e PROBE_ID=<probe-id> \
  -e CAST_OPERATIONS_URL=https://visca.ai \
  -e PROBE_INGRESS_PORT=3875 \
  -p 3875:3875 \
  -d cast-operations/probe:release
```

### Docker Compose

```yaml
version: "3"

services:
  cast-operations-probe:
    image: cast-operations/probe:release
    container_name: cast-operations-probe
    environment:
      - PROBE_KEY=<probe-key>
      - PROBE_ID=<probe-id>
      - CAST_OPERATIONS_URL=https://visca.ai
      - PROBE_INGRESS_PORT=3875
    ports:
      - "3875:3875"
    restart: always
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cast-operations-probe
spec:
  selector:
    matchLabels:
      app: cast-operations-probe
  template:
    metadata:
      labels:
        app: cast-operations-probe
    spec:
      containers:
        - name: cast-operations-probe
          image: cast-operations/probe:release
          env:
            - name: PROBE_KEY
              value: "<probe-key>"
            - name: PROBE_ID
              value: "<probe-id>"
            - name: CAST_OPERATIONS_URL
              value: "https://visca.ai"
            - name: PROBE_INGRESS_PORT
              value: "3875"
          ports:
            - name: ingress
              containerPort: 3875
---
apiVersion: v1
kind: Service
metadata:
  name: cast-operations-probe-ingress
spec:
  selector:
    app: cast-operations-probe
  ports:
    - name: ingress
      port: 3875
      targetPort: 3875
  type: ClusterIP
```

Interne tjenester kan deretter sende hjerteslag til `http://cast-operations-probe-ingress.<namespace>.svc.cluster.local:3875/heartbeat/<secret-key>`.

## Sende forespørsler til proben

Erstatt den offentlige hjerteslag-URL-en:

```
https://visca.ai/heartbeat/<secret-key>
```

med probens inngangs-URL:

```
http://<probe-host>:<PROBE_INGRESS_PORT>/heartbeat/<secret-key>
```

Sti, metode, kropp og hoder er ellers identiske, så eksisterende klientkode trenger bare å endre basis-URL-en.

### Eksempler

```bash
# GET-hjerteslag
curl http://probe.internal:3875/heartbeat/YOUR_SECRET_KEY

# POST-hjerteslag med JSON-kropp
curl -X POST http://probe.internal:3875/heartbeat/YOUR_SECRET_KEY \
  -H "Content-Type: application/json" \
  -d '{"status": "healthy", "version": "1.2.3"}'

# Cron-jobb
*/5 * * * * curl -s http://probe.internal:3875/heartbeat/YOUR_SECRET_KEY > /dev/null
```

## Videresendingsatferd

- **Synkront svar, asynkron videresending.** Proben bekrefter den innkommende forespørselen umiddelbart med en `200` og videresender til Cast Operations i bakgrunnen. Tjenesten din trenger ikke å vente på at videresendingen fullføres.
- **Hoder bevares.** Alle hoder unntatt hop-for-hop-hoder (`Host`, `Connection`, `Content-Length`, `Transfer-Encoding`, `Keep-Alive`, `Proxy-Authenticate`, `Proxy-Authorization`, `TE`, `Trailer`, `Upgrade`) sendes videre. Proben legger til et `Cast Operations-Probe-Id`-hode som identifiserer den.
- **Kropp bevares.** JSON-, URL-kodet og rå `application/octet-stream`-nyttelaster opptil **50 MB** aksepteres.
- **Nye forsøk med eksponentiell ventetid.** Hvis videresendingen mislykkes, prøver proben på nytt opptil `PROBE_INGRESS_FORWARD_RETRY_LIMIT` ganger med eksponentiell ventetid (2 s, 4 s, 8 s, begrenset til 15 s).
- **Proxy-bevisst.** Hvis proben selv er konfigurert med `HTTP_PROXY_URL` / `HTTPS_PROXY_URL`, vil videresendte forespørsler gå gjennom proxyen.

## Miljøvariabler

| Variabel                            | Standard                 | Beskrivelse                                                                                         |
| ----------------------------------- | ------------------------ | --------------------------------------------------------------------------------------------------- |
| `PROBE_INGRESS_PORT`                | _ikke satt_ (deaktivert) | Port innkommende lytter binder til. Enhver verdi `> 0` aktiverer inngang.                           |
| `PROBE_INGRESS_FORWARD_TIMEOUT_MS`  | `10000`                  | Tidsavbrudd (ms) for hvert videresendingsforsøk til Cast Operations. Minimum `1000`.                      |
| `PROBE_INGRESS_FORWARD_RETRY_LIMIT` | `3`                      | Antall nye forsøk før proben gir opp på en videresending. Sett til `0` for å deaktivere nye forsøk. |

Standard probe-variabler (`PROBE_KEY`, `PROBE_ID`, `CAST_OPERATIONS_URL`, proxy-variabler) gjelder alle – se [Egendefinerte prober](/docs/probe/custom-probe) for den fullstendige listen.

## Sikkerhetshensyn

- **Endepunktet er uautentisert av design** – den hemmelige nøkkelen i URL-stien _er_ autentiseringen, akkurat som den er på det offentlige `visca.ai`-endepunktet. Behandle den hemmelige nøkkelen som en legitimasjon.
- **Bind bare til et privat grensesnitt.** Inngangs-lytteren skal ikke være tilgjengelig fra det offentlige internett. Bruk en nettverkspolicy, brannmurregel eller `ClusterIP`-tjeneste for å begrense tilgangen.
- **Bruk HTTPS-terminering hvis du krever kryptering under overføring.** Probens lytter snakker vanlig HTTP. Plasser den bak en intern lastbalanser/inngangs-kontroller hvis du trenger TLS på det innkommende hoppet. Videresendingssegmentet fra probe → Cast Operations bruker alltid HTTPS (forutsatt at `CAST_OPERATIONS_URL` er `https://`).
- **Ressursgrenser.** Lytteren aksepterer forespørselskropper opptil 50 MB. Hvis du trenger en strammere grense, plasser en omvendt proxy foran.

## Feilsøking

- **Proben logger `Probe ingress listener started on port <port>` ved oppstart** – bekrefter at lytteren er oppe. Hvis du ikke ser denne linjen, er `PROBE_INGRESS_PORT` ikke satt, `0` eller ugyldig.
- **`Probe ingress: failed to forward to <url> after N attempts`** – proben kunne ikke nå Cast Operations. Sjekk probens utgående tilkobling, proxy-innstillinger og verdien av `CAST_OPERATIONS_URL`.
- **`Probe ingress: probe ID not available, forwarding without it`** – proben har ikke registrert seg ennå. Videresendingen lykkes likevel; hjerteslaget vil rett og slett ikke bli tilskrevet en probe.
- **Hjerteslag vises i Cast Operations, men ikke via proben** – bekreft at tjenesten din treffer `http://<probe-host>:<port>/...` og ikke den offentlige URL-en. En feilkonfigurert DNS eller `/etc/hosts`-oppføring er den vanlige årsaken.

## Relatert

- [Egendefinerte prober](/docs/probe/custom-probe)
- [Innkommende forespørselsmonitor](/docs/monitor/incoming-request-monitor)
