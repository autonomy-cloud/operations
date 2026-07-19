# Documentazione Provider Terraform

Il Provider Terraform Cast Operations consente la gestione tramite Infrastructure as Code (IaC) del proprio monitoraggio, avvisi e risorse di osservabilità Cast Operations.

## Sezioni della Documentazione

### [Per Iniziare](./quick-start.md)

Guida rapida di configurazione per iniziare con il Provider Terraform Cast Operations in pochi minuti.

### [Guida Completa al Provider](./README.md)

Documentazione completa che copre installazione, configurazione, risorse e buone pratiche.

### [Configurazione Self-Hosted](./self-hosted.md)

**Critica per i clienti self-hosted**: Blocco della versione, compatibilità e strategie di distribuzione.

### [Esempi](./examples.md)

Esempi reali e pattern per le configurazioni Terraform Cast Operations più comuni.

## Link Rapidi

### Per i Clienti Cast Operations Cloud

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://visca.ai"
  api_key       = var.cast_operations_api_key
}
```

### Per i Clienti Self-Hosted

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Deve corrispondere alla versione Cast Operations
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://operations.vostracompany.com"
  api_key       = var.cast_operations_api_key
}
```

## Importante per gli Utenti Self-Hosted

**La Compatibilità delle Versioni è Critica**: Bloccare sempre la versione del provider Terraform per corrispondere esattamente alla versione dell'installazione Cast Operations. Le versioni non corrispondenti possono causare problemi di compatibilità API.

## Risorse Esterne

- **Registro Terraform**: [Provider Cast Operations](https://registry.terraform.io/providers/autonomy-cloud/operations)
- **Repository GitHub**: [Codice Sorgente Cast Operations](https://github.com/autonomy-cloud/operations)
- **Supporto Community**: [Community Cast Operations](https://community.visca.ai)

## Risorse Disponibili

Il provider supporta la gestione completa delle risorse Cast Operations:

- **Progetti e Team**: Organizzare la propria struttura di monitoraggio
- **Monitor**: Monitor sito web, API, porta, heartbeat e personalizzati
- **Gestione Incidenti**: Policy avvisi, pianificazioni on-call, escalation
- **Pagine di Stato**: Pagine di stato pubbliche e private con branding personalizzato
- **Catalogo Servizi**: Definizioni dei servizi e mappatura delle dipendenze
- **Workflow**: Risposta automatizzata e workflow di rimedio

## Supporto

Per problemi, domande o contributi:

1. **Problemi di Documentazione**: Creare un issue nel [repository Cast Operations](https://github.com/autonomy-cloud/operations/issues)
2. **Bug del Provider**: Segnalare nel repository principale di Cast Operations
3. **Richieste di Funzionalità**: Discutere nella community di Cast Operations
4. **Domande Generali**: Usare i forum della community

## Prossimi Passi

1. **Nuovi Utenti**: Iniziare con la [Guida Rapida](./quick-start.md)
2. **Self-Hosted**: Esaminare la [Configurazione Self-Hosted](./self-hosted.md)
3. **Utenti Avanzati**: Esplorare gli [Esempi](./examples.md) per configurazioni complesse
4. **Riferimento Completo**: Consultare la [Guida Completa](./README.md) per tutte le funzionalità
