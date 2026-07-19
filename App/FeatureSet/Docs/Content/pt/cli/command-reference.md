# Referência de Comandos

Referência completa para todos os comandos do CLI do Cast Operations.

## Comandos de Autenticação

### `cast-operations login`

Autentique-se com uma instância do Cast Operations.

```bash
cast-operations login <api-key> <instance-url> [--context-name <name>]
```

| Parâmetro        | Tipo      | Obrigatório | Descrição                              |
| ---------------- | --------- | ----------- | -------------------------------------- |
| `<api-key>`      | argumento | Sim         | Chave de API para autenticação         |
| `<instance-url>` | argumento | Sim         | URL da instância do Cast Operations          |
| `--context-name` | opção     | Não         | Nome do contexto (padrão: `"default"`) |

---

### `cast-operations context list`

Listar todos os contextos salvos.

```bash
cast-operations context list
```

---

### `cast-operations context use`

Alternar para um contexto nomeado.

```bash
cast-operations context use <name>
```

| Parâmetro | Tipo      | Obrigatório | Descrição                      |
| --------- | --------- | ----------- | ------------------------------ |
| `<name>`  | argumento | Sim         | Nome do contexto a ser ativado |

---

### `cast-operations context current`

Exibir o contexto ativo com chave de API mascarada.

```bash
cast-operations context current
```

---

### `cast-operations context delete`

Remover um contexto salvo.

```bash
cast-operations context delete <name>
```

| Parâmetro | Tipo      | Obrigatório | Descrição                       |
| --------- | --------- | ----------- | ------------------------------- |
| `<name>`  | argumento | Sim         | Nome do contexto a ser excluído |

---

## Comandos de Recursos

Todos os comandos de recursos seguem o mesmo padrão. Substitua `<resource>` por qualquer nome de recurso suportado (ex.: `incident`, `monitor`, `alert`, `status-page`).

### `cast-operations <resource> list`

Listar recursos com filtragem e paginação.

```bash
cast-operations <resource> list [options]
```

| Opção            | Tipo   | Padrão  | Descrição                        |
| ---------------- | ------ | ------- | -------------------------------- |
| `--query <json>` | string | Nenhum  | Critérios de filtro como JSON    |
| `--limit <n>`    | number | `10`    | Máximo de resultados             |
| `--skip <n>`     | number | `0`     | Resultados a ignorar             |
| `--sort <json>`  | string | Nenhum  | Ordem de classificação como JSON |
| `-o, --output`   | string | `table` | Formato de saída                 |

---

### `cast-operations <resource> get`

Obter um único recurso por ID.

```bash
cast-operations <resource> get <id> [-o <format>]
```

| Parâmetro      | Tipo      | Obrigatório | Descrição            |
| -------------- | --------- | ----------- | -------------------- |
| `<id>`         | argumento | Sim         | ID do recurso (UUID) |
| `-o, --output` | opção     | Não         | Formato de saída     |

---

### `cast-operations <resource> create`

Criar um novo recurso.

```bash
cast-operations <resource> create [--data <json> | --file <path>] [-o <format>]
```

| Opção           | Tipo   | Obrigatório                | Descrição                  |
| --------------- | ------ | -------------------------- | -------------------------- |
| `--data <json>` | string | Um de `--data` ou `--file` | Dados do recurso como JSON |
| `--file <path>` | string | Um de `--data` ou `--file` | Caminho para arquivo JSON  |
| `-o, --output`  | string | Não                        | Formato de saída           |

---

### `cast-operations <resource> update`

Atualizar um recurso existente.

```bash
cast-operations <resource> update <id> --data <json> [-o <format>]
```

| Parâmetro       | Tipo      | Obrigatório | Descrição                    |
| --------------- | --------- | ----------- | ---------------------------- |
| `<id>`          | argumento | Sim         | ID do recurso                |
| `--data <json>` | opção     | Sim         | Campos a atualizar como JSON |
| `-o, --output`  | opção     | Não         | Formato de saída             |

---

### `cast-operations <resource> delete`

Excluir um recurso.

```bash
cast-operations <resource> delete <id> [--force]
```

| Parâmetro | Tipo      | Obrigatório | Descrição           |
| --------- | --------- | ----------- | ------------------- |
| `<id>`    | argumento | Sim         | ID do recurso       |
| `--force` | opção     | Não         | Ignorar confirmação |

---

### `cast-operations <resource> count`

Contar recursos que correspondem a um filtro.

```bash
cast-operations <resource> count [--query <json>]
```

| Opção            | Tipo   | Padrão | Descrição                     |
| ---------------- | ------ | ------ | ----------------------------- |
| `--query <json>` | string | Nenhum | Critérios de filtro como JSON |

---

## Comandos Utilitários

### `cast-operations version`

Exibir a versão do CLI.

```bash
cast-operations version
```

---

### `cast-operations whoami`

Mostrar detalhes de autenticação atuais.

```bash
cast-operations whoami
```

Exibe a URL da instância e a chave de API mascarada. Se um contexto salvo estiver ativo, o nome do contexto também é exibido.

---

### `cast-operations resources`

Listar todos os tipos de recursos disponíveis.

```bash
cast-operations resources [--type <type>]
```

| Opção           | Tipo   | Padrão | Descrição                             |
| --------------- | ------ | ------ | ------------------------------------- |
| `--type <type>` | string | Nenhum | Filtrar por `database` ou `analytics` |

---

## Opções Globais

Estas flags estão disponíveis em todos os comandos:

| Opção                   | Descrição                                 |
| ----------------------- | ----------------------------------------- |
| `--api-key <key>`       | Substituir chave de API                   |
| `--url <url>`           | Substituir URL da instância               |
| `--context <name>`      | Usar um contexto específico               |
| `-o, --output <format>` | Formato de saída: `json`, `table`, `wide` |
| `--no-color`            | Desativar saída colorida                  |
| `--help`                | Exibir ajuda                              |
| `--version`             | Exibir versão                             |

## Rotas de API

Para referência, o CLI mapeia comandos para estes endpoints de API:

| Comando  | Método | Endpoint                        |
| -------- | ------ | ------------------------------- |
| `list`   | POST   | `/api/<resource>/get-list`      |
| `get`    | POST   | `/api/<resource>/<id>/get-item` |
| `create` | POST   | `/api/<resource>`               |
| `update` | PUT    | `/api/<resource>/<id>/`         |
| `delete` | DELETE | `/api/<resource>/<id>/`         |
| `count`  | POST   | `/api/<resource>/count`         |

Todas as requisições incluem o cabeçalho `APIKey` para autenticação.
