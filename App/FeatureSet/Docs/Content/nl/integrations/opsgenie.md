# Opsgenie-integratie

Maak een [Opsgenie](https://www.atlassian.com/software/opsgenie)-alert aan telkens wanneer een Cast Operations-incident wordt aangemaakt, en sluit hem wanneer Cast Operations oplost.

Deze integratie is **outbound**: Cast Operations roept de [Opsgenie Alert API](https://docs.opsgenie.com/docs/alert-api) aan. Ze maakt gebruik van een Cast Operations **[Workflow](/docs/workflows/index)** met een **Incident → On Create**-trigger en een **API-component**.

```text
Cast Operations Incident → On Create  ──►  API component (POST /v2/alerts)  ──►  Opsgenie alert
```

## Vereisten

- Een Opsgenie **API-sleutel** van een API-integratie: **Settings → Integrations → Add → API**. Kopieer de sleutel.
- Ken je regio. De standaard API-host is `https://api.opsgenie.com`; EU-accounts gebruiken `https://api.eu.opsgenie.com`.
- Een Cast Operations-project waar je workflows kunt aanmaken.

## Stap 1 — Sla de API-sleutel op

1. Ga naar **Workflows → Global Variables → Create**.
2. Geef het de naam `OPSGENIE_KEY`, plak de API-sleutel, en zet **Is Secret** aan.

## Stap 2 — Bouw de "alert aanmaken"-workflow

1. Open **Workflows → Create Workflow**, geef het de naam `Incidents → Opsgenie`, en open de **Builder**.
2. Voeg een **Incident**-trigger toe ingesteld op **On Create**. Hernoem het naar `Incident`.
3. Voeg een **API**-blok toe verbonden met de trigger:

   - **Method**: `POST`
   - **URL**: `https://api.opsgenie.com/v2/alerts` _(gebruik `api.eu.opsgenie.com` voor EU)_
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

   De **`alias`** koppelt deze Opsgenie-alert aan het Cast Operations-incident zodat je hem later op alias kunt sluiten. Let op dat het Opsgenie-auth-schema het letterlijke woord `GenieKey` is gevolgd door een spatie en je sleutel.

4. **Sla op**, schakel in en maak een testincident aan. Een respons `202 Accepted` in de workflow-logs betekent dat Opsgenie de alert in de wachtrij heeft gezet.

## Stap 3 — Sluiten bij Cast Operations-oplossing (aanbevolen)

1. Maak een **tweede** workflow aan met de naam `Close Opsgenie` met een trigger **Incident → On Update**.
2. Voeg een **Conditions**-blok toe dat controleert of het incident nu is opgelost (vertak op `{{Incident.currentIncidentState.name}}`).
3. Voeg vanuit **Yes** een **API**-blok toe:
   - **Method**: `POST`
   - **URL**: `https://api.opsgenie.com/v2/alerts/cast-operations-{{Incident._id}}/close?identifierType=alias`
   - **Headers**: hetzelfde `Authorization: GenieKey {{variable.OPSGENIE_KEY}}`
   - **Body**: `{ "source": "Cast Operations", "note": "Resolved in Cast Operations" }`

Opsgenie zoekt de alert op via alias en sluit hem.

## Prioriteitsmapping (optioneel)

Opsgenie-prioriteiten lopen van `P1` tot `P5`. Map vanuit Cast Operations-severities met **Conditions**-takken op `{{Incident.incidentSeverity.name}}` vóór het API-blok.

## Probleemoplossing

- **`401`/`403`** — verkeerde sleutel, verkeerde regio-host, of de integratie heeft geen toestemming om alerts aan te maken. Bevestig dat je een **API**-integratiesleutel gebruikt en de bijbehorende `api`/`api.eu`-host.
- **Sluiten geeft `404`** — de `alias` bij de sluit-aanroep moet exact overeenkomen met die van de aanmaak-aanroep, en `identifierType=alias` moet in de querystring staan.
- **Er gebeurt niets** — bevestig dat de workflow **Enabled** is.

## Waar verder lezen

- [Integraties – Overzicht](/docs/integrations/index) — patronen en het authenticatie-spiekbriefje.
- [PagerDuty](/docs/integrations/pagerduty) — hetzelfde idee voor PagerDuty.
- [On Call](/docs/on-call/incoming-call-policy) — de ingebouwde escalatie van Cast Operations.
