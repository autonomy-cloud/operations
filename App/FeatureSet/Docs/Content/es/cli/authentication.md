# Autenticación

La CLI de Cast Operations admite múltiples formas de autenticarse con tu instancia de Cast Operations. Puedes usar contextos con nombre, variables de entorno o pasar credenciales directamente como indicadores.

## Inicio de sesión

Autentícate con tu instancia de Cast Operations usando una clave de API:

```bash
cast-operations login <api-key> <instance-url>
```

**Argumentos:**

| Argumento        | Descripción                                                                |
| ---------------- | -------------------------------------------------------------------------- |
| `<api-key>`      | Tu clave de API de Cast Operations (por ejemplo, `sk-your-api-key`)              |
| `<instance-url>` | La URL de tu instancia de Cast Operations (por ejemplo, `https://latticeruntime.com`) |

**Opciones:**

| Opción                  | Descripción                                             |
| ----------------------- | ------------------------------------------------------- |
| `--context-name <name>` | Nombre para este contexto (predeterminado: `"default"`) |

**Ejemplos:**

```bash
# Iniciar sesión con el contexto predeterminado
cast-operations login sk-abc123 https://latticeruntime.com

# Iniciar sesión con un contexto con nombre
cast-operations login sk-abc123 https://latticeruntime.com --context-name production

# Configurar múltiples entornos
cast-operations login sk-prod-key https://latticeruntime.com --context-name production
cast-operations login sk-staging-key https://staging.latticeruntime.com --context-name staging
```

## Contextos

Los contextos te permiten guardar y cambiar entre múltiples entornos de Cast Operations (por ejemplo, producción, staging, desarrollo).

### Listar contextos

```bash
cast-operations context list
```

Muestra todos los contextos configurados. El contexto actual está marcado con `*`.

### Cambiar de contexto

```bash
cast-operations context use <name>
```

Cambia a un contexto con nombre diferente para todos los comandos posteriores.

```bash
# Cambiar a staging
cast-operations context use staging

# Cambiar a producción
cast-operations context use production
```

### Ver el contexto actual

```bash
cast-operations context current
```

Muestra el contexto activo actual, incluyendo la URL de instancia y una clave de API enmascarada.

### Eliminar un contexto

```bash
cast-operations context delete <name>
```

Elimina un contexto con nombre. Si el contexto eliminado es el actual, la CLI cambia automáticamente al primer contexto restante.

## Resolución de credenciales

Las credenciales se resuelven en el siguiente orden de prioridad:

1. **Indicadores de CLI** (`--api-key` y `--url`)
2. **Variables de entorno** (`CAST_OPERATIONS_API_KEY` y `CAST_OPERATIONS_URL`)
3. **Contexto con nombre** (a través del indicador `--context`)
4. **Contexto actual** (desde la configuración guardada)

Puedes mezclar fuentes; por ejemplo, usar una variable de entorno para la clave de API y un contexto guardado para la URL.

### Uso de indicadores de CLI

```bash
cast-operations --api-key sk-abc123 --url https://latticeruntime.com incident list
```

### Uso de variables de entorno

```bash
export CAST_OPERATIONS_API_KEY=sk-abc123
export CAST_OPERATIONS_URL=https://latticeruntime.com

cast-operations incident list
```

### Uso de un contexto específico

```bash
cast-operations --context production incident list
```

## Verificar la autenticación

Verifica tu estado de autenticación actual:

```bash
cast-operations whoami
```

Esto muestra:

- URL de instancia
- Clave de API enmascarada
- Nombre del contexto actual (solo se muestra si hay un contexto guardado activo)

Si no estás autenticado, el comando muestra un mensaje útil sugiriendo que ejecutes `cast-operations login`.

## Archivo de configuración

Las credenciales se almacenan en `~/.cast-operations/config.json` con permisos restringidos (`0600`).

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
