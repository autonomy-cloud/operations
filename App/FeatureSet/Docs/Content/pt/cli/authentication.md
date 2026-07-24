# Autenticação

O CLI do Cast Operations suporta várias formas de autenticação com sua instância do Cast Operations. Você pode usar contextos nomeados, variáveis de ambiente ou passar credenciais diretamente como flags.

## Login

Autentique-se com sua instância do Cast Operations usando uma chave de API:

```bash
cast-operations login <api-key> <instance-url>
```

**Argumentos:**

| Argumento        | Descrição                                                          |
| ---------------- | ------------------------------------------------------------------ |
| `<api-key>`      | Sua chave de API do Cast Operations (ex.: `sk-sua-chave-de-api`)         |
| `<instance-url>` | A URL da sua instância do Cast Operations (ex.: `https://latticeruntime.com`) |

**Opções:**

| Opção                   | Descrição                                     |
| ----------------------- | --------------------------------------------- |
| `--context-name <name>` | Nome para este contexto (padrão: `"default"`) |

**Exemplos:**

```bash
# Login com contexto padrão
cast-operations login sk-abc123 https://latticeruntime.com

# Login com um contexto nomeado
cast-operations login sk-abc123 https://latticeruntime.com --context-name production

# Configurar múltiplos ambientes
cast-operations login sk-prod-key https://latticeruntime.com --context-name production
cast-operations login sk-staging-key https://staging.latticeruntime.com --context-name staging
```

## Contextos

Os contextos permitem que você salve e alterne entre múltiplos ambientes do Cast Operations (ex.: produção, staging, desenvolvimento).

### Listar Contextos

```bash
cast-operations context list
```

Exibe todos os contextos configurados. O contexto atual é marcado com `*`.

### Alternar Contexto

```bash
cast-operations context use <name>
```

Alterne para um contexto nomeado diferente para todos os comandos subsequentes.

```bash
# Alternar para staging
cast-operations context use staging

# Alternar para produção
cast-operations context use production
```

### Ver Contexto Atual

```bash
cast-operations context current
```

Exibe o contexto ativo atualmente, incluindo a URL da instância e uma chave de API mascarada.

### Excluir um Contexto

```bash
cast-operations context delete <name>
```

Remove um contexto nomeado. Se o contexto excluído for o atual, o CLI alterna automaticamente para o primeiro contexto restante.

## Resolução de Credenciais

As credenciais são resolvidas na seguinte ordem de prioridade:

1. **Flags de CLI** (`--api-key` e `--url`)
2. **Variáveis de ambiente** (`CAST_OPERATIONS_API_KEY` e `CAST_OPERATIONS_URL`)
3. **Contexto nomeado** (via flag `--context`)
4. **Contexto atual** (da configuração salva)

Você pode misturar fontes — por exemplo, usar uma variável de ambiente para a chave de API e um contexto salvo para a URL.

### Usando Flags de CLI

```bash
cast-operations --api-key sk-abc123 --url https://latticeruntime.com incident list
```

### Usando Variáveis de Ambiente

```bash
export CAST_OPERATIONS_API_KEY=sk-abc123
export CAST_OPERATIONS_URL=https://latticeruntime.com

cast-operations incident list
```

### Usando um Contexto Específico

```bash
cast-operations --context production incident list
```

## Verificar Autenticação

Verifique seu status de autenticação atual:

```bash
cast-operations whoami
```

Isso exibe:

- URL da instância
- Chave de API mascarada
- Nome do contexto atual (exibido apenas se um contexto salvo estiver ativo)

Se não estiver autenticado, o comando exibe uma mensagem útil sugerindo que você execute `cast-operations login`.

## Arquivo de Configuração

As credenciais são armazenadas em `~/.cast-operations/config.json` com permissões restritas (`0600`).

```json
{
  "currentContext": "production",
  "contexts": {
    "production": {
      "name": "production",
      "apiUrl": "https://latticeruntime.com",
      "apiKey": "sk-..."
    },
    "staging": {
      "name": "staging",
      "apiUrl": "https://staging.latticeruntime.com",
      "apiKey": "sk-..."
    }
  },
  "defaults": {
    "output": "table",
    "limit": 10
  }
}
```
