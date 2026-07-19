# Référence des commandes

Référence complète de toutes les commandes du CLI Cast Operations.

## Commandes d'authentification

### `cast-operations login`

S'authentifier auprès d'une instance Cast Operations.

```bash
cast-operations login <api-key> <instance-url> [--context-name <name>]
```

| Paramètre        | Type     | Requis | Description                                |
| ---------------- | -------- | ------ | ------------------------------------------ |
| `<api-key>`      | argument | Oui    | Clé API pour l'authentification            |
| `<instance-url>` | argument | Oui    | URL de l'instance Cast Operations                |
| `--context-name` | option   | Non    | Nom du contexte (par défaut : `"default"`) |

---

### `cast-operations context list`

Lister tous les contextes sauvegardés.

```bash
cast-operations context list
```

---

### `cast-operations context use`

Basculer vers un contexte nommé.

```bash
cast-operations context use <name>
```

| Paramètre | Type     | Requis | Description               |
| --------- | -------- | ------ | ------------------------- |
| `<name>`  | argument | Oui    | Nom du contexte à activer |

---

### `cast-operations context current`

Afficher le contexte actif avec la clé API masquée.

```bash
cast-operations context current
```

---

### `cast-operations context delete`

Supprimer un contexte sauvegardé.

```bash
cast-operations context delete <name>
```

| Paramètre | Type     | Requis | Description                 |
| --------- | -------- | ------ | --------------------------- |
| `<name>`  | argument | Oui    | Nom du contexte à supprimer |

---

## Commandes de ressources

Toutes les commandes de ressources suivent le même schéma. Remplacez `<resource>` par n'importe quel nom de ressource pris en charge (par ex., `incident`, `monitor`, `alert`, `status-page`).

### `cast-operations <resource> list`

Lister les ressources avec filtrage et pagination.

```bash
cast-operations <resource> list [options]
```

| Option           | Type   | Défaut  | Description                       |
| ---------------- | ------ | ------- | --------------------------------- |
| `--query <json>` | chaîne | Aucun   | Critères de filtre au format JSON |
| `--limit <n>`    | nombre | `10`    | Nombre maximum de résultats       |
| `--skip <n>`     | nombre | `0`     | Résultats à ignorer               |
| `--sort <json>`  | chaîne | Aucun   | Ordre de tri au format JSON       |
| `-o, --output`   | chaîne | `table` | Format de sortie                  |

---

### `cast-operations <resource> get`

Obtenir une seule ressource par identifiant.

```bash
cast-operations <resource> get <id> [-o <format>]
```

| Paramètre      | Type     | Requis | Description                        |
| -------------- | -------- | ------ | ---------------------------------- |
| `<id>`         | argument | Oui    | Identifiant de la ressource (UUID) |
| `-o, --output` | option   | Non    | Format de sortie                   |

---

### `cast-operations <resource> create`

Créer une nouvelle ressource.

```bash
cast-operations <resource> create [--data <json> | --file <path>] [-o <format>]
```

| Option          | Type   | Requis                       | Description                            |
| --------------- | ------ | ---------------------------- | -------------------------------------- |
| `--data <json>` | chaîne | L'un de `--data` ou `--file` | Données de la ressource au format JSON |
| `--file <path>` | chaîne | L'un de `--data` ou `--file` | Chemin vers le fichier JSON            |
| `-o, --output`  | chaîne | Non                          | Format de sortie                       |

---

### `cast-operations <resource> update`

Mettre à jour une ressource existante.

```bash
cast-operations <resource> update <id> --data <json> [-o <format>]
```

| Paramètre       | Type     | Requis | Description                           |
| --------------- | -------- | ------ | ------------------------------------- |
| `<id>`          | argument | Oui    | Identifiant de la ressource           |
| `--data <json>` | option   | Oui    | Champs à mettre à jour au format JSON |
| `-o, --output`  | option   | Non    | Format de sortie                      |

---

### `cast-operations <resource> delete`

Supprimer une ressource.

```bash
cast-operations <resource> delete <id> [--force]
```

| Paramètre | Type     | Requis | Description                        |
| --------- | -------- | ------ | ---------------------------------- |
| `<id>`    | argument | Oui    | Identifiant de la ressource        |
| `--force` | option   | Non    | Ignorer la demande de confirmation |

---

### `cast-operations <resource> count`

Compter les ressources correspondant à un filtre.

```bash
cast-operations <resource> count [--query <json>]
```

| Option           | Type   | Défaut | Description                       |
| ---------------- | ------ | ------ | --------------------------------- |
| `--query <json>` | chaîne | Aucun  | Critères de filtre au format JSON |

---

## Commandes utilitaires

### `cast-operations version`

Afficher la version du CLI.

```bash
cast-operations version
```

---

### `cast-operations whoami`

Afficher les détails d'authentification actuels.

```bash
cast-operations whoami
```

Affiche l'URL de l'instance et la clé API masquée. Si un contexte sauvegardé est actif, le nom du contexte est également affiché.

---

### `cast-operations resources`

Lister tous les types de ressources disponibles.

```bash
cast-operations resources [--type <type>]
```

| Option          | Type   | Défaut | Description                           |
| --------------- | ------ | ------ | ------------------------------------- |
| `--type <type>` | chaîne | Aucun  | Filtrer par `database` ou `analytics` |

---

## Options globales

Ces indicateurs sont disponibles sur toutes les commandes :

| Option                  | Description                                |
| ----------------------- | ------------------------------------------ |
| `--api-key <key>`       | Remplacer la clé API                       |
| `--url <url>`           | Remplacer l'URL de l'instance              |
| `--context <name>`      | Utiliser un contexte spécifique            |
| `-o, --output <format>` | Format de sortie : `json`, `table`, `wide` |
| `--no-color`            | Désactiver la sortie colorée               |
| `--help`                | Afficher l'aide                            |
| `--version`             | Afficher la version                        |

## Routes API

Pour référence, le CLI associe les commandes à ces points de terminaison API :

| Commande | Méthode | Point de terminaison            |
| -------- | ------- | ------------------------------- |
| `list`   | POST    | `/api/<resource>/get-list`      |
| `get`    | POST    | `/api/<resource>/<id>/get-item` |
| `create` | POST    | `/api/<resource>`               |
| `update` | PUT     | `/api/<resource>/<id>/`         |
| `delete` | DELETE  | `/api/<resource>/<id>/`         |
| `count`  | POST    | `/api/<resource>/count`         |

Toutes les requêtes incluent l'en-tête `APIKey` pour l'authentification.
