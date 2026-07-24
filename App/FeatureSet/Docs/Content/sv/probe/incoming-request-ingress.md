# Ingress för inkommande förfrågningar

En anpassad sond kan valfritt köra en **inkommande HTTP-lyssnare** som accepterar `heartbeat`- och `incoming-request`-anrop från inside ditt privata nätverk och vidarebefordrar dem till Cast Operations. Detta gör det möjligt för tjänster som **inte har utgående internetåtkomst** att fortfarande rapportera till en [Monitor för inkommande förfrågningar](/docs/monitor/incoming-request-monitor) genom att skicka förfrågan till en sond i det lokala nätverket istället för direkt till `latticeruntime.com`.

## Översikt

När `PROBE_INGRESS_PORT` är inställd binder sonden en ytterligare HTTP-lyssnare på den porten. Lyssnaren accepterar samma `secretkey`-URL-sökvägar som de offentliga Cast Operations-slutpunkterna:

- `POST /heartbeat/:secretkey`
- `GET /heartbeat/:secretkey`
- `POST /incoming-request/:secretkey`
- `GET /incoming-request/:secretkey`

Sonden proxy:ar sedan förfrågan till din Cast Operations-instans och bevarar metoden, innehållet och förfrågningshuvuden (minus hop-by-hop-huvuden som `Host`, `Connection`, `Content-Length` etc.). Sonden bifogar automatiskt ett `Cast Operations-Probe-Id`-huvud så att förfrågan attributeras till den vidarebefordrande sonden.

Lyssnaren körs på en **dedikerad port**, separat från sondens interna status-/måttslutpunkter, så du kan exponera den för ditt privata nätverk utan att exponera något annat.

## När du ska använda detta

Använd ingress-lyssnaren när:

- Dina tjänster körs i ett isolerat nätverkssegment utan utgående HTTPS-åtkomst
- Du behöver hålla all övervakningsrafik inom ditt VPC/on-prem-nätverk
- Du vill ha en enda utgångspunkt – sonden – som tillåts nå Cast Operations
- Du redan distribuerade en [Anpassad sond](/docs/probe/custom-probe) och vill återanvända den för inkommande hjärtslag

Om dina tjänster redan kan nå `https://latticeruntime.com` (eller din egeninstallerade URL) direkt behöver du **inte** den här funktionen – anropa hjärtslagURL:en direkt från tjänsten.

## Aktivera ingress-lyssnaren

Ange `PROBE_INGRESS_PORT` till den port du vill att lyssnaren ska binda. Valfritt värde större än `0` aktiverar lyssnaren; om du lämnar det oinstallerat (eller `0`) inaktiveras det.

### Docker

```bash
docker run --name cast-operations-probe --network host \
  -e PROBE_KEY=<probe-key> \
  -e PROBE_ID=<probe-id> \
  -e CAST_OPERATIONS_URL=https://latticeruntime.com \
  -e PROBE_INGRESS_PORT=3875 \
  -d cast-operations/probe:release
```

Om du inte använder `--network host`, publicera ingress-porten explicit:

```bash
docker run --name cast-operations-probe \
  -e PROBE_KEY=<probe-key> \
  -e PROBE_ID=<probe-id> \
  -e CAST_OPERATIONS_URL=https://latticeruntime.com \
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
      - CAST_OPERATIONS_URL=https://latticeruntime.com
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
              value: "https://latticeruntime.com"
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

Interna tjänster kan sedan skicka hjärtslag till `http://cast-operations-probe-ingress.<namespace>.svc.cluster.local:3875/heartbeat/<secret-key>`.

## Skicka förfrågningar till sonden

Ersätt den offentliga hjärtslagURL:en:

```
https://latticeruntime.com/heartbeat/<secret-key>
```

med sondens ingress-URL:

```
http://<probe-host>:<PROBE_INGRESS_PORT>/heartbeat/<secret-key>
```

Sökvägen, metoden, innehållet och huvuden är annars identiska, så befintlig klientkod behöver bara bas-URL:en ändrad.

### Exempel

```bash
# GET hjärtslag
curl http://probe.internal:3875/heartbeat/YOUR_SECRET_KEY

# POST hjärtslag med JSON-innehåll
curl -X POST http://probe.internal:3875/heartbeat/YOUR_SECRET_KEY \
  -H "Content-Type: application/json" \
  -d '{"status": "healthy", "version": "1.2.3"}'

# Cron-jobb
*/5 * * * * curl -s http://probe.internal:3875/heartbeat/YOUR_SECRET_KEY > /dev/null
```

## Vidarebefordringsbeteende

- **Synkront svar, asynkron vidarebefordran.** Sonden bekräftar den inkommande förfrågan omedelbart med `200` och vidarebefordrar till Cast Operations i bakgrunden. Din tjänst behöver inte vänta på att vidarebefordran ska slutföras.
- **Huvuden bevaras.** Alla huvuden utom hop-by-hop-huvuden skickas igenom. Sonden lägger till ett `Cast Operations-Probe-Id`-huvud som identifierar den.
- **Innehåll bevaras.** JSON-, URL-kodade och raw `application/octet-stream`-nyttolaster upp till **50 MB** accepteras.
- **Försök igen med backoff.** Om vidarebefordran misslyckas försöker sonden igen upp till `PROBE_INGRESS_FORWARD_RETRY_LIMIT` gånger med exponentiell backoff (2 s, 4 s, 8 s, tak vid 15 s).
- **Proxymedveten.** Om sonden själv är konfigurerad med `HTTP_PROXY_URL` / `HTTPS_PROXY_URL` går vidarebefordrade förfrågningar via proxyn.

## Miljövariabler

| Variabel                            | Standard                     | Beskrivning                                                                               |
| ----------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------- |
| `PROBE_INGRESS_PORT`                | _inte angiven_ (inaktiverad) | Porten som inkommande lyssnare binder. Valfritt värde `> 0` aktiverar ingress.            |
| `PROBE_INGRESS_FORWARD_TIMEOUT_MS`  | `10000`                      | Timeout (ms) för varje vidarebefordringsförsök till Cast Operations. Minimum `1000`.            |
| `PROBE_INGRESS_FORWARD_RETRY_LIMIT` | `3`                          | Antal försök innan sonden ger upp en vidarebefordran. Ange `0` för att inaktivera försök. |

Standardsondvariablerna (`PROBE_KEY`, `PROBE_ID`, `CAST_OPERATIONS_URL`, proxyvariabler) gäller alla – se [Anpassade sonder](/docs/probe/custom-probe) för den fullständiga listan.

## Säkerhetsöverväganden

- **Slutpunkten är oautentiserad av design** – den hemliga nyckeln i URL-sökvägen _är_ autentiseringen, precis som på den offentliga `latticeruntime.com`-slutpunkten. Behandla den hemliga nyckeln som en autentiseringsuppgift.
- **Bind bara till ett privat gränssnitt.** Ingress-lyssnaren bör inte vara nåbar från det offentliga internet. Använd en nätverkspolicy, brandväggsregel eller `ClusterIP`-tjänst för att begränsa åtkomsten.
- **Använd HTTPS-terminering om du kräver kryptering under transport.** Sondens lyssnare talar plain HTTP. Placera den bakom en intern lastbalanserare/ingress-kontroller om du behöver TLS på det inkommande hoppet. Vidarebefordringsetappen från sond → Cast Operations använder alltid HTTPS (förutsatt att `CAST_OPERATIONS_URL` är `https://`).
- **Resursbegränsningar.** Lyssnaren accepterar förfrågningsinnehåll upp till 50 MB. Om du behöver ett strängare tak, placera en omvänd proxy framför.

## Felsökning

- **Sonden loggar `Probe ingress listener started on port <port>` vid start** – bekräftar att lyssnaren är igång. Om du inte ser den här raden är `PROBE_INGRESS_PORT` inte angiven, `0` eller ogiltig.
- **`Probe ingress: failed to forward to <url> after N attempts`** – sonden kunde inte nå Cast Operations. Kontrollera sondens utgående anslutning, proxyinställningar och värdet på `CAST_OPERATIONS_URL`.
- **`Probe ingress: probe ID not available, forwarding without it`** – sonden har ännu inte registrerat sig. Vidarebefordran lyckas ändå; hjärtslaget attributeras helt enkelt inte till en sond.
- **Hjärtslag visas i Cast Operations men inte via sonden** – bekräfta att din tjänst träffar `http://<probe-host>:<port>/...` och inte den offentliga URL:en. En felkonfigurerad DNS eller `/etc/hosts`-post är den vanliga orsaken.

## Relaterat

- [Anpassade sonder](/docs/probe/custom-probe)
- [Monitor för inkommande förfrågningar](/docs/monitor/incoming-request-monitor)
