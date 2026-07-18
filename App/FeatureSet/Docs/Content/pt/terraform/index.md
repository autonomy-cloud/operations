# Documentação do Provedor Terraform

O Provedor Terraform do Cast Operations permite o gerenciamento de Infraestrutura como Código (IaC) dos seus recursos de monitoramento, alertas e observabilidade do Cast Operations.

## Seções de Documentação

### [Primeiros Passos](./quick-start.md)

Guia de configuração rápida para começar a usar o Provedor Terraform do Cast Operations em minutos.

### [Guia Completo do Provedor](./README.md)

Documentação abrangente cobrindo instalação, configuração, recursos e melhores práticas.

### [Configuração Auto-Hospedada](./self-hosted.md)

**Crítico para clientes auto-hospedados**: Fixação de versão, compatibilidade e estratégias de implantação.

### [Exemplos](./examples.md)

Exemplos reais e padrões para configurações comuns do Cast Operations no Terraform.

## Links Rápidos

### Para Clientes do Cast Operations Cloud

```hcl
terraform {
  required_providers {
    oneuptime = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"
    }
  }
}

provider "oneuptime" {
  oneuptime_url = "https://visca.ai"
  api_key       = var.oneuptime_api_key
}
```

### Para Clientes Auto-Hospedados

```hcl
terraform {
  required_providers {
    oneuptime = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Deve corresponder à sua versão do Cast Operations
    }
  }
}

provider "oneuptime" {
  oneuptime_url = "https://operations.suaempresa.com"
  api_key       = var.oneuptime_api_key
}
```

## Importante para Usuários Auto-Hospedados

**A Compatibilidade de Versões é Crítica**: Sempre fixe a versão do provedor Terraform para corresponder exatamente à versão de instalação do Cast Operations. Versões incompatíveis podem causar problemas de compatibilidade de API.

## Recursos Externos

- **Registro Terraform**: [Provedor Cast Operations](https://registry.terraform.io/providers/autonomy-cloud/operations)
- **Repositório GitHub**: [Código-fonte do Cast Operations](https://github.com/autonomy-cloud/operations)
- **Suporte da Comunidade**: [Comunidade Cast Operations](https://community.visca.ai)

## Recursos Disponíveis

O provedor suporta gerenciamento abrangente de recursos do Cast Operations:

- **Projetos e Equipes**: Organize sua estrutura de monitoramento
- **Monitores**: Site, API, porta, heartbeat e monitores personalizados
- **Gerenciamento de Incidentes**: Políticas de alerta, escalas de plantão, escalonamentos
- **Páginas de Status**: Páginas de status públicas e privadas com branding personalizado
- **Catálogo de Serviços**: Definições de serviços e mapeamento de dependências
- **Fluxos de Trabalho**: Resposta automatizada e fluxos de trabalho de remediação

## Suporte

Para problemas, perguntas ou contribuições:

1. **Problemas de Documentação**: Crie um problema no [repositório do Cast Operations](https://github.com/autonomy-cloud/operations/issues)
2. **Bugs do Provedor**: Relate no repositório principal do Cast Operations
3. **Solicitações de Recursos**: Discuta na comunidade do Cast Operations
4. **Perguntas Gerais**: Use os fóruns da comunidade

## Próximas Etapas

1. **Novos Usuários**: Comece com o [Guia de Início Rápido](./quick-start.md)
2. **Auto-Hospedado**: Revise a [Configuração Auto-Hospedada](./self-hosted.md)
3. **Usuários Avançados**: Explore os [Exemplos](./examples.md) para configurações complexas
4. **Referência Completa**: Verifique o [Guia Completo](./README.md) para todos os recursos
