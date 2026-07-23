# Provedor Terraform do Cast Operations

O Provedor Terraform do Cast Operations permite gerenciar recursos do Cast Operations usando Infraestrutura como Código (IaC). Este provedor permite configurar monitoramento, gerenciamento de incidentes, páginas de status e outros recursos do Cast Operations através do Terraform.

## Índice

- [Instalação](#instalação)
- [Configuração do Provedor](#configuração-do-provedor)
- [Início Rápido](#início-rápido)
- [Compatibilidade de Versões](#compatibilidade-de-versões)
- [Recursos Disponíveis](#recursos-disponíveis)
- [Exemplos](#exemplos)
- [Melhores Práticas](#melhores-práticas)
- [Guia de Migração](#guia-de-migração)

## Instalação

### Do Registro do Terraform (Recomendado)

O provedor Terraform do Cast Operations está disponível no [Registro do Terraform](https://registry.terraform.io/providers/autonomy-cloud/operations).

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Use a versão 7.x mais recente
    }
  }
  required_version = ">= 1.0"
}
```

### Fixação de Versão para Instalações Auto-Hospedadas

⚠️ **Importante para Clientes Auto-Hospedados**: Sempre fixe a versão do provedor Terraform para corresponder à versão de instalação do Cast Operations para garantir compatibilidade de API.

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Fixe na versão exata que corresponde à sua instalação do Cast Operations
    }
  }
  required_version = ">= 1.0"
}
```

#### Encontrando Sua Versão do Cast Operations

Você pode encontrar sua versão do Cast Operations de várias formas:

1. **Painel**: Vá para Settings → About no seu painel do Cast Operations
2. **API**: Chame o endpoint `GET /api/status`
3. **Docker**: Verifique a tag da imagem que você está usando
4. **Helm**: Verifique a versão do seu Helm chart

```bash
# Exemplo: Se executando o Cast Operations 7.0.123
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"
    }
  }
}
```

## Configuração do Provedor

### Configuração Básica

```hcl
provider "cast-operations" {
  cast_operations_url = "https://sua-instancia-latticeruntime.com"  # Ou https://latticeruntime.com para nuvem
  api_key       = var.cast_operations_api_key
}
```

### Variáveis de Ambiente

Você pode configurar o provedor usando variáveis de ambiente:

```bash
export CAST_OPERATIONS_URL="https://sua-instancia-latticeruntime.com"
export CAST_OPERATIONS_API_KEY="sua-chave-de-api-aqui"
```

Em seguida, use o provedor sem configuração explícita:

```hcl
provider "cast-operations" {
  # A configuração será lida das variáveis de ambiente
}
```

### Opções de Configuração

| Argumento       | Variável de Ambiente | Descrição                 | Obrigatório |
| --------------- | -------------------- | ------------------------- | ----------- |
| `cast_operations_url` | `CAST_OPERATIONS_URL`      | URL do Cast Operations          | Sim         |
| `api_key`       | `CAST_OPERATIONS_API_KEY`  | Chave de API do Cast Operations | Sim         |

## Início Rápido

### 1. Criar Chave de API

Primeiro, crie uma chave de API no seu painel do Cast Operations:

1. Vá para **Settings** → **API Keys**
2. Clique em **Create API Key**
3. Dê um nome descritivo (ex.: "Automação Terraform")
4. Selecione as permissões apropriadas
5. Copie a chave de API gerada

### 2. Configuração Básica do Terraform

Crie um arquivo `main.tf`:

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
  cast_operations_url = "https://latticeruntime.com"  # Use a URL da sua instância
  api_key       = var.cast_operations_api_key
}

# Nota: Projetos devem ser criados manualmente no painel do Cast Operations
variable "project_id" {
  description = "ID do projeto Cast Operations"
  type        = string
}

# Criar um monitor
resource "cast_operations_monitor" "website" {
  name        = "Monitor de Site"
  description = "Monitor para uptime do site"
  data        = jsonencode({
    url = "https://example.com"
    interval = "5m"
    timeout = "30s"
  })
}

# Criar uma equipe
resource "cast_operations_team" "platform" {
  name        = "Equipe de Plataforma"
  description = "Equipe de engenharia de plataforma"
}
```

### 3. Inicializar e Aplicar

```bash
# Inicializar o Terraform
terraform init

# Planejar as mudanças
terraform plan

# Aplicar a configuração
terraform apply
```

## Compatibilidade de Versões

### Clientes de Nuvem

Para clientes do Cast Operations Cloud, use a versão mais recente do provedor:

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Sempre use a versão compatível mais recente
    }
  }
}
```

### Clientes Auto-Hospedados

**Crítico**: Os clientes auto-hospedados devem fixar a versão do provedor para corresponder à instalação do Cast Operations:

| Versão do Cast Operations | Versão do Provedor | Configuração           |
| ------------------- | ------------------ | ---------------------- |
| 7.0.x               | 7.0.x              | `version = "~> 7.0.0"` |
| 7.1.x               | 7.1.x              | `version = "~> 7.1.0"` |
| 7.2.x               | 7.2.x              | `version = "~> 7.2.0"` |

Exemplo para Cast Operations 7.0.123:

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Correspondência de versão exata
    }
  }
}
```

## Recursos Disponíveis

O provedor Terraform do Cast Operations suporta os seguintes recursos:

### Recursos Principais

- `cast_operations_team` - Gerenciar equipes

### Monitoramento

- `cast_operations_monitor` - Criar e gerenciar monitores
- `cast_operations_probe` - Gerenciar probes de monitoramento

### Gerenciamento de Plantão

- `cast_operations_on_call_duty_policy` - Configurar escalas de plantão

### Páginas de Status

- `cast_operations_status_page` - Criar páginas de status

### Catálogo de Serviços

- `cast_operations_service_catalog` - Gerenciar entradas do catálogo de serviços

### Catálogo de Serviços

- `cast_operations_service` - Definir serviços
- `cast_operations_service_dependency` - Mapear dependências de serviços

### Fontes de Dados

Nota: As fontes de dados não estão disponíveis atualmente no provedor, pois nenhuma fonte de dados está definida no esquema do provedor.

## Exemplos

### Configuração Completa de Monitoramento

```hcl
# Variáveis
variable "cast_operations_api_key" {
  description = "Chave de API do Cast Operations"
  type        = string
  sensitive   = true
}

variable "project_id" {
  description = "ID do projeto Cast Operations (crie o projeto manualmente no painel)"
  type        = string
}

variable "cast_operations_url" {
  description = "URL do Cast Operations"
  type        = string
  default     = "https://latticeruntime.com"
}

# Configuração do provedor
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"
    }
  }
}

provider "cast-operations" {
  cast_operations_url = var.cast_operations_url
  api_key       = var.cast_operations_api_key
}

# Equipe
resource "cast_operations_team" "platform" {
  name        = "Equipe de Plataforma"
  description = "Equipe de engenharia de plataforma"
}

# Monitores
resource "cast_operations_monitor" "api" {
  name        = "Verificação de Saúde da API"
  description = "Monitor para o endpoint de saúde da API"
  data        = jsonencode({
    url = "https://api.mycompany.com/health"
    method = "GET"
    interval = "1m"
    timeout = "30s"
  })
}

resource "cast_operations_monitor" "database" {
  name       = "Conexão com o Banco de Dados"
  project_id = cast_operations_project.production.id

  monitor_type = "port"
  hostname     = "db.mycompany.com"
  port         = 5432
  interval     = "2m"

  tags = {
    service     = "database"
    environment = "production"
    criticality = "critical"
  }
}

# Política de plantão
resource "cast_operations_on_call_policy" "platform_oncall" {
  name       = "Plantão de Plataforma"
  project_id = cast_operations_project.production.id
  team_id    = cast_operations_team.platform.id

  schedules {
    name      = "Horário Comercial"
    timezone  = "America/New_York"

    layers {
      name = "Primário"
      users = ["user1@mycompany.com", "user2@mycompany.com"]
      rotation_type = "weekly"
      start_time = "09:00"
      end_time = "17:00"
      days = ["monday", "tuesday", "wednesday", "thursday", "friday"]
    }
  }
}

# Política de alertas
resource "cast_operations_alert_policy" "critical_alerts" {
  name       = "Alertas Críticos do Sistema"
  project_id = cast_operations_project.production.id

  conditions {
    monitor_id = cast_operations_monitor.api.id
    threshold  = "down"
  }

  conditions {
    monitor_id = cast_operations_monitor.database.id
    threshold  = "down"
  }

  actions {
    type = "webhook"
    url  = "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
  }

  actions {
    type           = "oncall_escalation"
    oncall_policy_id = cast_operations_on_call_policy.platform_oncall.id
  }
}

# Página de status
resource "cast_operations_status_page" "public" {
  name       = "Status da MyCompany"
  project_id = cast_operations_project.production.id

  domain = "status.mycompany.com"

  components {
    name       = "API"
    monitor_id = cast_operations_monitor.api.id
  }

  components {
    name       = "Banco de Dados"
    monitor_id = cast_operations_monitor.database.id
  }
}
```

### Exemplo de Configuração Auto-Hospedada

```hcl
# Para instância auto-hospedada do Cast Operations versão 7.0.123
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Deve corresponder exatamente à sua versão do Cast Operations
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  cast_operations_url = "https://operations.mycompany.com"  # Sua URL auto-hospedada
  api_key       = var.cast_operations_api_key
}

# Restante da sua configuração...
```

## Melhores Práticas

### 1. Gerenciamento de Versões

**Para Clientes de Nuvem:**

- Use versionamento semântico com `~>` para obter atualizações compatíveis
- Revise o changelog antes de atualizações de versão principal

**Para Clientes Auto-Hospedados:**

- Sempre fixe na versão exata correspondente à sua instalação
- Atualize a versão do provedor ao atualizar o Cast Operations
- Teste em ambiente não produtivo primeiro

### 2. Gerenciamento de Estado

```hcl
terraform {
  backend "s3" {
    bucket = "meu-estado-terraform"
    key    = "cast-operations/terraform.tfstate"
    region = "us-west-2"
  }
}
```

### 3. Separação de Ambientes

Use workspaces ou arquivos de estado separados para diferentes ambientes:

```bash
# Usando workspaces
terraform workspace new production
terraform workspace new staging

# Usando diretórios separados
mkdir -p environments/{staging,production}
```

### 4. Gerenciamento de Variáveis

```hcl
# variables.tf
variable "environment" {
  description = "Nome do ambiente"
  type        = string
}

variable "monitors" {
  description = "Lista de monitores a criar"
  type = list(object({
    name = string
    url  = string
    type = string
  }))
}

# terraform.tfvars
environment = "production"
monitors = [
  {
    name = "Site"
    url  = "https://example.com"
    type = "website"
  },
  {
    name = "API"
    url  = "https://api.example.com/health"
    type = "api"
  }
]
```

### 5. Nomenclatura de Recursos

Use convenções de nomenclatura consistentes:

```hcl
resource "cast_operations_monitor" "website_production" {
  name = "${var.environment}-website-monitor"
  # ...
}

resource "cast_operations_alert_policy" "critical_production" {
  name = "${var.environment}-critical-alerts"
  # ...
}
```

## Guia de Migração

### Da Configuração Manual

1. **Audite os recursos existentes** no painel do Cast Operations
2. **Crie a configuração Terraform** para recursos existentes
3. **Importe os recursos existentes** para o estado do Terraform
4. **Valide a configuração** corresponde ao estado atual
5. **Aplique as mudanças** incrementalmente

Exemplo de importação:

```bash
# Importar monitor existente
terraform import cast_operations_monitor.website monitor-id-here

# Importar projeto existente
terraform import cast_operations_project.main project-id-here
```

### Atualizações de Versão

Ao atualizar o Cast Operations (auto-hospedado):

1. **Faça backup do seu estado atual**
2. **Verifique a compatibilidade do provedor**
3. **Atualize a versão do provedor** na configuração
4. **Teste no ambiente de staging**
5. **Aplique na produção**

```bash
# Backup do estado
terraform state pull > backup.tfstate

# Atualize a versão do provedor
# Edite o bloco terraform na sua configuração

# Planeje e aplique
terraform init -upgrade
terraform plan
terraform apply
```

## Suporte e Recursos

- **Documentação**: [Docs do Cast Operations](https://docs.latticeruntime.com)
- **Registro Terraform**: [Provedor Cast Operations](https://registry.terraform.io/providers/autonomy-cloud/operations)
- **Problemas GitHub**: [Cast Operations GitHub](https://github.com/autonomy-cloud/operations/issues)
- **Comunidade**: [Comunidade Cast Operations](https://community.latticeruntime.com)

## Solução de Problemas

### Problemas Comuns

1. **Incompatibilidade de Versão (Auto-Hospedado)**

   ```
   Error: API version incompatible
   ```

   **Solução**: Certifique-se de que a versão do provedor corresponde à instalação do Cast Operations

2. **Problemas de Autenticação**

   ```
   Error: Invalid API key
   ```

   **Solução**: Verifique a chave de API e as permissões

3. **Recurso Não Encontrado**
   ```
   Error: Resource not found
   ```
   **Solução**: Verifique os IDs de recursos e certifique-se de que o recurso existe

### Modo Debug

Habilite o log detalhado:

```bash
export TF_LOG=DEBUG
terraform apply
```

### Verificação de Versão

Verifique sua configuração:

```bash
# Verificar versão do Terraform
terraform version

# Verificar versão do provedor
terraform providers

# Validar configuração
terraform validate
```
