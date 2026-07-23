# Guida Rapida al Provider Terraform

Questa guida aiuterà a iniziare con il Provider Terraform Cast Operations in pochi minuti.

## Prerequisiti

- Terraform >= 1.0 installato
- Account Cast Operations (Cloud o Self-Hosted)
- Chiave API Cast Operations

## Fase 1: Creare la Chiave API

### Per Cast Operations Cloud

1. Accedere a [Cast Operations Cloud](https://latticeruntime.com) ed effettuare il login
2. Navigare a **Impostazioni** → **Chiavi API**
3. Fare clic su **Crea Chiave API**
4. Nominarla "Provider Terraform"
5. Selezionare i permessi richiesti
6. Copiare la chiave API generata

### Per Cast Operations Self-Hosted

1. Accedere alla propria istanza Cast Operations
2. Navigare a **Impostazioni** → **Chiavi API**
3. Fare clic su **Crea Chiave API**
4. Nominarla "Provider Terraform"
5. Selezionare i permessi richiesti
6. Copiare la chiave API generata

## Fase 2: Creare la Configurazione Terraform

Creare una nuova directory e un file `main.tf`:

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      # Per i clienti Cloud
      version = "~> 7.0"

      # Per i clienti Self-Hosted - bloccare alla versione esatta
      # version = "= 7.0.123"  # Sostituire con la propria versione Cast Operations
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  # Per i clienti Cloud
  cast_operations_url = "https://latticeruntime.com"

  # Per i clienti Self-Hosted - usare l'URL della propria istanza
  # cast_operations_url = "https://operations.vostracompany.com"

  api_key = var.cast_operations_api_key
}

variable "cast_operations_api_key" {
  description = "Chiave API Cast Operations"
  type        = string
  sensitive   = true
}

# Nota: I progetti devono essere creati manualmente nel dashboard Cast Operations
# Usare qui il proprio ID progetto esistente
variable "project_id" {
  description = "ID progetto Cast Operations"
  type        = string
}

# Creare un semplice monitor sito web
resource "cast_operations_monitor" "website" {
  name        = "Monitor Sito Web"
  description = "Monitor per l'uptime del sito web"
  data        = jsonencode({
    url = "https://example.com"
    interval = "5m"
    timeout = "30s"
  })
}

# Restituire l'ID del monitor
output "monitor_id" {
  value = cast_operations_monitor.website.id
}
```

## Fase 3: Creare il File Variabili

Creare `terraform.tfvars`:

```hcl
# terraform.tfvars
cast_operations_api_key = "vostra-api-key"
project_id        = "vostro-id-progetto"  # Ottenere dal dashboard Cast Operations
```

**Importante**: Aggiungere `terraform.tfvars` al proprio `.gitignore` per tenere le chiavi API al sicuro!

## Fase 4: Inizializzare e Applicare

```bash
# Inizializzare Terraform
terraform init

# Pianificare la distribuzione
terraform plan

# Applicare la configurazione
terraform apply
```

## Fase 5: Verificare le Risorse

1. Controllare il dashboard Cast Operations
2. Accedere al proprio progetto esistente
3. Verificare che il "Monitor Sito Web" sia creato e in esecuzione

## Prossimi Passi

1. **Esplorare Altre Risorse**: Consultare la [documentazione completa](./README.md) per tutte le risorse disponibili
2. **Configurare gli Avvisi**: Aggiungere policy avvisi e canali di notifica
3. **Creare Pagine di Stato**: Configurare pagine di stato pubbliche per i propri servizi
4. **Organizzare con i Team**: Creare team e assegnare permessi

## Esempi Specifici per Versione

### Clienti Cloud (Ultima Versione)

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Ottiene sempre la versione 7.x compatibile più recente
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://latticeruntime.com"
  api_key       = var.cast_operations_api_key
}
```

### Clienti Self-Hosted (Versione Bloccata)

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Deve corrispondere esattamente alla versione Cast Operations
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://operations.miacompany.com"  # Il proprio URL self-hosted
  api_key       = var.cast_operations_api_key
}
```

## Risoluzione Rapida dei Problemi

### Problema: Provider non trovato

```
Error: Failed to query available provider packages
```

**Soluzione**: Eseguire `terraform init` per scaricare il provider

### Problema: Autenticazione fallita

```
Error: Invalid API key
```

**Soluzione**:

1. Verificare la chiave API nel dashboard Cast Operations
2. Controllare che la chiave API abbia permessi sufficienti
3. Assicurarsi che `cast_operations_url` sia corretto per la propria istanza

### Problema: Mancata corrispondenza di versione (Self-Hosted)

```
Error: API version incompatible
```

**Soluzione**:

1. Controllare la versione Cast Operations nel dashboard
2. Aggiornare la versione del provider per corrispondere esattamente
3. Eseguire `terraform init -upgrade`

## Pulizia

Per rimuovere tutte le risorse create in questa guida rapida:

```bash
terraform destroy
```

Questo eliminerà il monitor e il progetto creati durante la guida rapida.
