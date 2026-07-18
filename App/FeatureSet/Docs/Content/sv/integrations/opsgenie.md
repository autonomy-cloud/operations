# Opsgenie-integration

Skapa ett [Opsgenie](https://www.atlassian.com/software/opsgenie)-larm när en Cast Operations-incident skapas, och stäng det när Cast Operations löser den.

Den här integrationen är **utgående**: Cast Operations anropar [Opsgenie Alert API](https://docs.opsgenie.com/docs/alert-api). Den använder ett Cast Operations **[Arbetsflöde](/docs/workflows/index)** med en **Incident → On Create**-utlösare och en **API-komponent**.

```text
Cast Operations Incident → On Create  ──►  API component (POST /v2/alerts)  ──►  Opsgenie alert
```

## Förutsättningar

- En Opsgenie **API-nyckel** från en API-integration: **Settings → Integrations → Add → API**. Kopiera nyckeln.
- Känn till din region. Standard-API-hosten är `https://api.opsgenie.com`; EU-konton använder `https://api.eu.opsgenie.com`.
- Ett Cast Operations-projekt där du kan skapa arbetsflöden.

## Steg 1 — Spara API-nyckeln

1. Gå till **Workflows → Global Variables → Create**.
2. Namnge det `OPSGENIE_KEY`, klistra in API-nyckeln och slå på **Is Secret**.

## Steg 2 — Bygg arbetsflödet för "skapa larm"

1. Öppna **Workflows → Create Workflow**, namnge det `Incidents → Opsgenie` och öppna **Builder**.
2. Lägg till en **Incident**-utlösare inställd på **On Create**. Byt namn till `Incident`.
3. Lägg till ett **API**-block kopplat till utlösaren:

   - **Method**: `POST`
   - **URL**: `https://api.opsgenie.com/v2/alerts` _(använd `api.eu.opsgenie.com` för EU)_
   - **Headers**:

     ```text
     Authorization: GenieKey {{variable.OPSGENIE_KEY}}
     Content-Type: application/json
     ```

   - **Body**:

     ```json
     {
       "message": "{{Incident.title}}",
       "alias": "cast-operations-{{Incident._id}}",
       "description": "{{Incident.description}}",
       "priority": "P1",
       "source": "Cast Operations"
     }
     ```

   **`alias`** kopplar det här Opsgenie-larmet till Cast Operations-incidenten så att du kan stänga det senare via alias. Notera att Opsgenie-autentiseringsschemat är det bokstavliga ordet `GenieKey` följt av ett mellanslag och din nyckel.

4. **Spara**, aktivera och skapa en testincident. Ett `202 Accepted`-svar i arbetsflödets loggar betyder att Opsgenie köade larmet.

## Steg 3 — Stäng vid Cast Operations-lösning (rekommenderas)

1. Skapa ett **andra** arbetsflöde som heter `Close Opsgenie` med en **Incident → On Update**-utlösare.
2. Lägg till ett **Conditions**-block som kontrollerar att incidenten nu är löst (förgrena på `{{Incident.currentIncidentState.name}}`).
3. Från **Yes**, lägg till ett **API**-block:
   - **Method**: `POST`
   - **URL**: `https://api.opsgenie.com/v2/alerts/cast-operations-{{Incident._id}}/close?identifierType=alias`
   - **Headers**: samma `Authorization: GenieKey {{variable.OPSGENIE_KEY}}`
   - **Body**: `{ "source": "Cast Operations", "note": "Resolved in Cast Operations" }`

Opsgenie letar upp larmet via alias och stänger det.

## Prioritetsmappning (valfritt)

Opsgenie-prioriteter går från `P1`–`P5`. Mappa från Cast Operations-allvarlighetsgrader med **Conditions**-grenar på `{{Incident.incidentSeverity.name}}` före API-blocket.

## Felsökning

- **`401`/`403`** — fel nyckel, fel regions-host, eller integrationen saknar behörighet att skapa larm. Bekräfta att du använder en **API**-integrationsnyckel och den matchande `api`/`api.eu`-hosten.
- **Stängning returnerar `404`** — `alias` i stängningsanropet måste matcha skapanropsanropet exakt, och `identifierType=alias` måste finnas i query-strängen.
- **Ingenting händer** — bekräfta att arbetsflödet är **Enabled**.

## Läs vidare

- [Integrationsöversikt](/docs/integrations/index) — mönster och autentiseringsfuskbladet.
- [PagerDuty](/docs/integrations/pagerduty) — samma idé för PagerDuty.
- [Jour](/docs/on-call/incoming-call-policy) — Cast Operations:s inbyggda eskalering.
