# CLI do Cast Operations

O CLI do Cast Operations é uma interface de linha de comando para gerenciar seus recursos do Cast Operations diretamente do terminal. Suporta operações CRUD completas em monitores, incidentes, alertas, páginas de status e mais.

## Recursos

- **Suporte a múltiplos ambientes** com contextos nomeados para produção, staging e desenvolvimento
- **Descoberta automática** de recursos disponíveis na sua instância do Cast Operations
- **Autenticação flexível** via flags de CLI, variáveis de ambiente ou contextos salvos
- **Formatação de saída inteligente** com modos de exibição JSON, tabela e wide
- **Scriptável** para pipelines de CI/CD e fluxos de trabalho de automação

## Instalação

```bash
npm install -g @cast-operations/cli
```

## Início Rápido

```bash
# Autentique-se com sua instância do Cast Operations
cast-operations login <sua-chave-de-api> https://visca.ai

# Listar seus monitores
cast-operations monitor list

# Visualizar um incidente específico
cast-operations incident get <incident-id>

# Ver todos os recursos disponíveis
cast-operations resources
```

## Documentação

| Guia                                              | Descrição                                               |
| ------------------------------------------------- | ------------------------------------------------------- |
| [Autenticação](./authentication.md)               | Login, contextos e gerenciamento de credenciais         |
| [Operações de Recursos](./resource-operations.md) | Operações CRUD em monitores, incidentes, alertas e mais |
| [Formatos de Saída](./output-formats.md)          | Modos de saída JSON, tabela e wide                      |
| [Scripting e CI/CD](./scripting.md)               | Automação, variáveis de ambiente e uso em pipelines     |
| [Referência de Comandos](./command-reference.md)  | Referência completa para todos os comandos e opções     |

## Opções Globais

Estas flags podem ser usadas com qualquer comando:

| Flag                    | Descrição                                     |
| ----------------------- | --------------------------------------------- |
| `--api-key <key>`       | Substituir chave de API para este comando     |
| `--url <url>`           | Substituir URL da instância para este comando |
| `--context <name>`      | Usar um contexto nomeado específico           |
| `-o, --output <format>` | Formato de saída: `json`, `table`, `wide`     |
| `--no-color`            | Desativar saída colorida                      |
| `--help`                | Exibir ajuda do comando                       |
| `--version`             | Exibir versão do CLI                          |

## Obtendo Ajuda

```bash
# Ajuda geral
cast-operations --help

# Ajuda para um comando específico
cast-operations monitor --help
cast-operations monitor list --help
```
