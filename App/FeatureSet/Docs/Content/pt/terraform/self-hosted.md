# Guia de Configuração Terraform do Cast Operations Auto-Hospedado

Este guia é especificamente para clientes que executam instâncias auto-hospedadas do Cast Operations. Abrange gerenciamento de versões, configuração e melhores práticas para usar o provedor Terraform com sua própria implantação do Cast Operations.

## Notas Importantes

⚠️ **Projetos não podem ser criados via Terraform** - Os projetos devem ser criados manualmente no painel do Cast Operations primeiro. Use o ID do projeto nas suas configurações Terraform.

⚠️ **A regra mais importante para clientes auto-hospedados**: Sempre fixe a versão do provedor Terraform para corresponder exatamente à versão de instalação do Cast Operations.

## Estrutura de Recursos

Todos os recursos Terraform do Cast Operations seguem uma estrutura simplificada:

- `name` (obrigatório) - Nome do recurso
- `description` (opcional) - Descrição do recurso
- `data` (opcional) - Configuração complexa como JSON

## Crítico: Compatibilidade de Versões

⚠️ **A regra mais importante para clientes auto-hospedados**: Sempre fixe a versão do provedor Terraform para corresponder exatamente à versão de instalação do Cast Operations.

### Por que a Fixação de Versão é Crítica

- O provedor Terraform é gerado automaticamente a partir da API do Cast Operations
- Cada versão do Cast Operations pode ter endpoints de API e esquemas diferentes
- Usar uma versão de provedor incompatível pode causar erros ou comportamento inesperado
- A fixação de versão garante compatibilidade e comportamento previsível

## Encontrando Sua Versão do Cast Operations

### Método 1: Painel

1. Faça login no seu painel do Cast Operations
2. Vá para **Settings** → **About**
3. Procure o número da versão (ex.: "7.0.123")

### Método 2: Endpoint de API

```bash
curl https://sua-instancia-visca.ai/api/status
```

### Método 3: Imagens Docker

Se você estiver executando o Cast Operations com Docker:

```bash
docker images | grep cast-operations
# Procure pela tag, ex.: cast-operations/dashboard:7.0.123
```

### Método 4: Helm Chart

Se você estiver usando Helm:

```bash
helm list -n cast-operations
# Verifique a versão do chart
```

### Método 5: Variáveis de Ambiente

Verifique seus arquivos de configuração para variáveis de versão:

```bash
grep -r "APP_VERSION\|IMAGE_TAG" /path/to/your/cast-operations/config
```

## Modelos de Configuração do Provedor

### Modelo para Versão 7.0.x

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Substitua 123 pelo seu número de build exato
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  cast_operations_url = "https://operations.suaempresa.com"  # Sua URL auto-hospedada
  api_key       = var.cast_operations_api_key
}
```

### Modelo para Versão 7.1.x

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.1.45"  # Substitua pela sua versão exata
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  cast_operations_url = "https://operations.suaempresa.com"
  api_key       = var.cast_operations_api_key
}
```

## Exemplo Completo de Configuração Auto-Hospedada

Aqui está um exemplo completo para uma instância auto-hospedada do Cast Operations:

```hcl
# versions.tf
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Deve corresponder à sua versão do Cast Operations
    }
  }
  required_version = ">= 1.0"

  # Opcional: Use estado remoto para colaboração em equipe
  backend "s3" {
    bucket = "seu-bucket-de-estado-terraform"
    key    = "cast-operations/terraform.tfstate"
    region = "us-west-2"
  }
}

# variables.tf
variable "cast_operations_url" {
  description = "URL da instância do Cast Operations"
  type        = string
  default     = "https://operations.suaempresa.com"
}

variable "cast_operations_api_key" {
  description = "Chave de API do Cast Operations"
  type        = string
  sensitive   = true
}

variable "environment" {
  description = "Nome do ambiente"
  type        = string
  default     = "production"
}

# providers.tf
provider "cast-operations" {
  cast_operations_url = var.cast_operations_url
  api_key       = var.cast_operations_api_key
}

# variables.tf
variable "project_id" {
  description = "ID do projeto Cast Operations (crie manualmente no painel)"
  type        = string
}

# main.tf
# Criar equipes
resource "cast_operations_team" "infrastructure" {
  name        = "Equipe de Infraestrutura"
  description = "Equipe de infraestrutura e operações"
}

resource "cast_operations_team" "development" {
  name        = "Equipe de Desenvolvimento"
  description = "Equipe de desenvolvimento de aplicativos"
}

# Monitores de infraestrutura
resource "cast_operations_monitor" "database" {
  name       = "${var.environment}-database"

  monitor_type = "port"
  hostname     = "db.internal.suaempresa.com"
  port         = 5432
  interval     = "2m"
  timeout      = "10s"
}

resource "cast_operations_monitor" "application" {
  name       = "${var.environment}-application"

  monitor_type = "website"
  url          = "https://app.suaempresa.com/health"
  interval     = "1m"
  timeout      = "30s"
}
```

## Configuração Específica do Ambiente

### Ambiente de Desenvolvimento

```hcl
# dev.tfvars
cast_operations_url = "https://operations-dev.suaempresa.com"
environment = "development"
```

### Ambiente de Staging

```hcl
# staging.tfvars
cast_operations_url = "https://operations-staging.suaempresa.com"
environment = "staging"
```

### Ambiente de Produção

```hcl
# prod.tfvars
cast_operations_url = "https://operations.suaempresa.com"
environment = "production"
```

## Processo de Atualização para Auto-Hospedado

Ao atualizar sua instância do Cast Operations:

### 1. Lista de Verificação Pré-Atualização

```bash
# Backup do estado atual do Terraform
terraform state pull > backup-$(date +%Y%m%d).tfstate

# Anote a versão atual do Cast Operations
curl https://operations.suaempresa.com/api/status | jq '.version'

# Anote a versão atual do provedor
terraform providers | grep cast-operations
```

### 2. Atualizar Instância do Cast Operations

Siga seu processo padrão de atualização do Cast Operations (Docker, Helm, etc.)

### 3. Atualizar Provedor Terraform

```hcl
# Atualize a versão no bloco terraform
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.124"  # Nova versão após atualização
    }
  }
}
```

### 4. Testar e Aplicar

```bash
# Atualizar provedor
terraform init -upgrade

# Planejar para ver quaisquer mudanças
terraform plan

# Aplicar se tudo parecer bem
terraform apply
```

## Configuração de Rede

### Regras de Firewall

Certifique-se de que seu executor do Terraform possa acessar:

- Endpoint de API do Cast Operations (geralmente porta 443/HTTPS)
- Quaisquer recursos internos sendo monitorados

### VPN/Redes Privadas

Se o Cast Operations estiver em uma rede privada:

```hcl
provider "cast-operations" {
  cast_operations_url = "https://10.0.1.100:443"  # IP interno
  api_key       = var.cast_operations_api_key
}
```

## Melhores Práticas de Segurança

### 1. Gerenciamento de Chaves de API

```bash
# Usar variáveis de ambiente
export CAST_OPERATIONS_API_KEY="sua-chave-de-api"

# Ou usar um sistema de gerenciamento de segredos
export CAST_OPERATIONS_API_KEY=$(vault kv get -field=api_key secret/cast-operations)
```

### 2. Chaves de API com Menos Privilégios

Crie chaves de API com as permissões mínimas necessárias:

- Gerenciamento de monitores
- Gerenciamento de política de alertas
- Gerenciamento de equipes (se necessário)

## Monitorando Sua Automação Terraform

Crie monitores para sua automação Terraform:

```hcl
resource "cast_operations_monitor" "terraform_runner" {
  name       = "Saúde do Executor Terraform"

  monitor_type = "heartbeat"
  interval     = "15m"
}
```

## Solução de Problemas para Auto-Hospedado

### Problema: Conexão Recusada

```
Error: connection refused
```

**Soluções**:

1. Verifique se a instância do Cast Operations está em execução
2. Verifique se a URL da API está correta
3. Verifique a conectividade de rede/firewall
4. Verifique se os certificados TLS são válidos

### Problema: Incompatibilidade de Versão de API

```
Error: API version incompatible
```

**Soluções**:

1. Verifique a versão do Cast Operations: `curl https://sua-instancia/api/status`
2. Atualize a versão do provedor para corresponder
3. Execute `terraform init -upgrade`

### Problema: Certificados Autoassinados

Se estiver usando certificados autoassinados:

```bash
# Ignore temporariamente a verificação TLS (não recomendado para produção)
export CAST_OPERATIONS_SKIP_TLS_VERIFY=true
```

Melhor solução: Adicione seu certificado CA ao armazenamento de confiança do sistema.

## Backup e Recuperação de Desastres

### Backup de Estado

```bash
# Backups regulares de estado
terraform state pull > backup-$(date +%Y%m%d-%H%M%S).tfstate

# Script de backup automatizado
#!/bin/bash
DATE=$(date +%Y%m%d-%H%M%S)
terraform state pull > "backups/terraform-state-${DATE}.tfstate"
find backups/ -name "terraform-state-*.tfstate" -mtime +30 -delete
```

## Gerenciamento de Múltiplos Ambientes

### Usando Workspaces

```bash
# Criar ambientes
terraform workspace new dev
terraform workspace new staging
terraform workspace new prod

# Alternar entre ambientes
terraform workspace select prod
terraform apply -var-file="prod.tfvars"
```

### Usando Diretórios Separados

```
terraform/
├── environments/
│   ├── dev/
│   │   ├── main.tf
│   │   └── terraform.tfvars
│   ├── staging/
│   │   ├── main.tf
│   │   └── terraform.tfvars
│   └── prod/
│       ├── main.tf
│       └── terraform.tfvars
└── modules/
    └── cast-operations/
        ├── main.tf
        ├── variables.tf
        └── outputs.tf
```

Esta abordagem fornece melhor isolamento e gerenciamento de versões mais fácil por ambiente.
