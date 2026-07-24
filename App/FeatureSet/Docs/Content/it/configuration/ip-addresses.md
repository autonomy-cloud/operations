# Whitelist degli Indirizzi IP per Cast Operations.com

Se stai utilizzando Cast Operations.com e vuoi aggiungere i nostri IP alla whitelist per motivi di sicurezza, puoi farlo seguendo le istruzioni qui sotto.

Aggiungi alla whitelist i seguenti IP nel tuo firewall per consentire a latticeruntime.com di raggiungere le tue risorse.

{{IP_WHITELIST}}

Questi IP possono cambiare; ti avviseremo in anticipo se ciò dovesse accadere.

## Recupero degli Indirizzi IP in Modo Programmatico

Puoi anche recuperare l'elenco degli indirizzi IP di uscita delle probe in modo programmatico tramite il seguente endpoint API:

```
GET https://latticeruntime.com/ip-whitelist
```

Questo restituisce una risposta JSON:

```json
{
  "ipWhitelist": ["<list of IPs>"]
}
```

Puoi utilizzare questo endpoint per mantenere aggiornata automaticamente la whitelist del tuo firewall.
