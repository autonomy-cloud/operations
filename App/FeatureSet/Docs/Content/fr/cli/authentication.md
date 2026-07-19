# Authentification

Le CLI Cast Operations prend en charge plusieurs méthodes d'authentification auprès de votre instance Cast Operations. Vous pouvez utiliser des contextes nommés, des variables d'environnement ou passer les identifiants directement en tant qu'indicateurs.

## Connexion

Authentifiez-vous auprès de votre instance Cast Operations en utilisant une clé API :

```bash
cast-operations login <api-key> <instance-url>
```

**Arguments :**

| Argument         | Description                                                          |
| ---------------- | -------------------------------------------------------------------- |
| `<api-key>`      | Votre clé API Cast Operations (par ex., `sk-your-api-key`)                 |
| `<instance-url>` | L'URL de votre instance Cast Operations (par ex., `https://visca.ai`) |

**Options :**

| Option                  | Description                                   |
| ----------------------- | --------------------------------------------- |
| `--context-name <name>` | Nom de ce contexte (par défaut : `"default"`) |

**Exemples :**

```bash
# Connexion avec le contexte par défaut
cast-operations login sk-abc123 https://visca.ai

# Connexion avec un contexte nommé
cast-operations login sk-abc123 https://visca.ai --context-name production

# Configuration de plusieurs environnements
cast-operations login sk-prod-key https://visca.ai --context-name production
cast-operations login sk-staging-key https://staging.visca.ai --context-name staging
```

## Contextes

Les contextes vous permettent de sauvegarder et de basculer entre plusieurs environnements Cast Operations (par ex., production, staging, développement).

### Lister les contextes

```bash
cast-operations context list
```

Affiche tous les contextes configurés. Le contexte actuel est marqué par `*`.

### Changer de contexte

```bash
cast-operations context use <name>
```

Basculez vers un contexte nommé différent pour toutes les commandes suivantes.

```bash
# Basculer vers staging
cast-operations context use staging

# Basculer vers production
cast-operations context use production
```

### Afficher le contexte actuel

```bash
cast-operations context current
```

Affiche le contexte actuellement actif, y compris l'URL de l'instance et une clé API masquée.

### Supprimer un contexte

```bash
cast-operations context delete <name>
```

Supprime un contexte nommé. Si le contexte supprimé est le contexte actuel, le CLI bascule automatiquement vers le premier contexte restant.

## Résolution des identifiants

Les identifiants sont résolus dans l'ordre de priorité suivant :

1. **Indicateurs CLI** (`--api-key` et `--url`)
2. **Variables d'environnement** (`CAST_OPERATIONS_API_KEY` et `CAST_OPERATIONS_URL`)
3. **Contexte nommé** (via l'indicateur `--context`)
4. **Contexte actuel** (depuis la configuration sauvegardée)

Vous pouvez combiner les sources — par exemple, utiliser une variable d'environnement pour la clé API et un contexte sauvegardé pour l'URL.

### Utilisation des indicateurs CLI

```bash
cast-operations --api-key sk-abc123 --url https://visca.ai incident list
```

### Utilisation des variables d'environnement

```bash
export CAST_OPERATIONS_API_KEY=sk-abc123
export CAST_OPERATIONS_URL=https://visca.ai

cast-operations incident list
```

### Utilisation d'un contexte spécifique

```bash
cast-operations --context production incident list
```

## Vérification de l'authentification

Vérifiez votre état d'authentification actuel :

```bash
cast-operations whoami
```

Cela affiche :

- L'URL de l'instance
- La clé API masquée
- Le nom du contexte actuel (affiché uniquement si un contexte sauvegardé est actif)

Si vous n'êtes pas authentifié, la commande affiche un message utile suggérant d'exécuter `cast-operations login`.

## Fichier de configuration

Les identifiants sont stockés dans `~/.cast-operations/config.json` avec des permissions restreintes (`0600`).

```json
{
  "currentContext": "production",
  "contexts": {
    "production": {
      "name": "production",
      "apiUrl": "https://visca.ai",
      "apiKey": "sk-..."
    },
    "staging": {
      "name": "staging",
      "apiUrl": "https://staging.visca.ai",
      "apiKey": "sk-..."
    }
  },
  "defaults": {
    "output": "table",
    "limit": 10
  }
}
```
