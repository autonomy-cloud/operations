# Integrazione con Opsgenie

Crea un allarme [Opsgenie](https://www.atlassian.com/software/opsgenie) ogni volta che viene creato un incidente Cast Operations, e chiudilo quando Cast Operations lo risolve.

Questa integrazione è **in uscita**: Cast Operations chiama l'[Opsgenie Alert API](https://docs.opsgenie.com/docs/alert-api). Utilizza un **[Workflow](/docs/workflows/index)** di Cast Operations con un trigger **Incident → On Create** e un **componente API**.

```text
Cast Operations Incident → On Create  ──►  API component (POST /v2/alerts)  ──►  Opsgenie alert
```

## Prerequisiti

- Una **chiave API** Opsgenie da un'integrazione API: **Settings → Integrations → Add → API**. Copia la chiave.
- Conosci la tua regione. L'host API predefinito è `https://api.opsgenie.com`; gli account EU usano `https://api.eu.opsgenie.com`.
- Un progetto Cast Operations in cui puoi creare workflow.

## Passaggio 1 — Salva la chiave API

1. Vai su **Workflows → Global Variables → Create**.
2. Chiamala `OPSGENIE_KEY`, incolla la chiave API e attiva **Is Secret**.

## Passaggio 2 — Crea il workflow di "creazione allarme"

1. Apri **Workflows → Create Workflow**, chiamalo `Incidents → Opsgenie` e apri il **Builder**.
2. Aggiungi un trigger **Incident** impostato su **On Create**. Rinominalo `Incident`.
3. Aggiungi un blocco **API** collegato al trigger:

   - **Method**: `POST`
   - **URL**: `https://api.opsgenie.com/v2/alerts` _(usa `api.eu.opsgenie.com` per l'EU)_
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

   L'**`alias`** collega questo allarme Opsgenie all'incidente Cast Operations in modo da poterlo chiudere in seguito tramite alias. Nota che lo schema di autenticazione Opsgenie è la parola letterale `GenieKey` seguita da uno spazio e dalla tua chiave.

4. **Salva**, abilita e crea un incidente di test. Una risposta `202 Accepted` nei log del workflow significa che Opsgenie ha messo in coda l'allarme.

## Passaggio 3 — Chiudi alla risoluzione in Cast Operations (consigliato)

1. Crea un **secondo** workflow chiamato `Close Opsgenie` con un trigger **Incident → On Update**.
2. Aggiungi un blocco **Conditions** che verifica che l'incidente sia ora risolto (ramifica su `{{Incident.currentIncidentState.name}}`).
3. Da **Yes**, aggiungi un blocco **API**:
   - **Method**: `POST`
   - **URL**: `https://api.opsgenie.com/v2/alerts/cast-operations-{{Incident._id}}/close?identifierType=alias`
   - **Headers**: lo stesso `Authorization: GenieKey {{variable.OPSGENIE_KEY}}`
   - **Body**: `{ "source": "Cast Operations", "note": "Resolved in Cast Operations" }`

Opsgenie cerca l'allarme per alias e lo chiude.

## Mappatura delle priorità (opzionale)

Le priorità Opsgenie vanno da `P1` a `P5`. Mappa dalle severità Cast Operations con rami **Conditions** su `{{Incident.incidentSeverity.name}}` prima del blocco API.

## Risoluzione dei problemi

- **`401`/`403`** — chiave errata, host di regione sbagliato, o l'integrazione non ha il permesso di creare allarmi. Conferma di star usando una chiave di integrazione **API** e il corrispondente host `api`/`api.eu`.
- **La chiusura restituisce `404`** — l'`alias` nella chiamata di chiusura deve corrispondere esattamente a quello della chiamata di creazione, e `identifierType=alias` deve essere nella query string.
- **Non succede nulla** — conferma che il workflow sia **Enabled**.

## Dove leggere poi

- [Panoramica delle integrazioni](/docs/integrations/index) — pattern e guida rapida all'autenticazione.
- [PagerDuty](/docs/integrations/pagerduty) — la stessa idea per PagerDuty.
- [On Call](/docs/on-call/incoming-call-policy) — l'escalation integrata di Cast Operations.
