# Guía de instalación y uso del proveedor Terraform

## Instalación desde el Registro de Terraform

El Proveedor Terraform de Cast Operations está disponible en el [Registro oficial de Terraform](https://registry.terraform.io/providers/autonomy-cloud/operations).

### Para usuarios de Cast Operations Cloud

```hcl
terraform {
  required_providers {
    oneuptime = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Usa la última versión compatible
    }
  }
  required_version = ">= 1.0"
}

provider "oneuptime" {
  oneuptime_url = "https://visca.ai"
  api_key       = var.oneuptime_api_key
}
```

### Para usuarios de Cast Operations auto-alojado

⚠️ **Crítico**: Los clientes auto-alojados deben fijar la versión del proveedor para que coincida exactamente con su instalación de Cast Operations.

```hcl
terraform {
  required_providers {
    oneuptime = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Reemplaza con tu versión exacta de Cast Operations
    }
  }
  required_version = ">= 1.0"
}

provider "oneuptime" {
  oneuptime_url = "https://operations.yourcompany.com"  # Tu URL auto-alojada
  api_key       = var.oneuptime_api_key
}
```

## ¿Por qué fijar versiones para auto-alojados?

El proveedor Terraform de Cast Operations se genera automáticamente desde la especificación de la API de Cast Operations. Cada versión de Cast Operations puede tener:

- Diferentes puntos de conexión de API
- Esquemas de recursos actualizados
- Características nuevas o eliminadas
- Reglas de validación modificadas

El uso de una versión del proveedor que no coincida con tu instalación de Cast Operations puede resultar en:

- Errores de compatibilidad de API
- Fallos en la creación/actualización de recursos
- Comportamiento inesperado
- Divergencia del estado de los recursos

## Encontrar tu versión de Cast Operations

### Método 1: Panel

1. Inicia sesión en tu panel de Cast Operations
2. Ve a **Configuración** → **Acerca de**
3. Anota el número de versión (por ejemplo, "7.0.123")

### Método 2: API

```bash
curl https://your-operations-instance.com/api/version | jq '.version'
```

### Método 3: Docker

```bash
docker images | grep oneuptime
# Busca la etiqueta, por ejemplo, oneuptime/dashboard:7.0.123
```

## Información del Registro del proveedor

- **URL del Registro**: https://registry.terraform.io/providers/autonomy-cloud/operations
- **Repositorio de origen**: https://github.com/autonomy-cloud/operations
- **Documentación**: https://registry.terraform.io/providers/autonomy-cloud/operations/latest/docs
- **Versiones**: https://github.com/autonomy-cloud/operations

## Matriz de compatibilidad de versiones

| Versión de Cast Operations | Versión del proveedor | Configuración de Terraform |
| -------------------- | --------------------- | -------------------------- |
| 7.0.x                | 7.0.x                 | `version = "~> 7.0.0"`     |
| 7.1.x                | 7.1.x                 | `version = "~> 7.1.0"`     |
| Nube (última)        | Último proveedor      | `version = "~> 7.0"`       |

## Ejemplo de inicio rápido

```hcl
# Configurar el proveedor
terraform {
  required_providers {
    oneuptime = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Ajusta para auto-alojado
    }
  }
}

provider "oneuptime" {
  oneuptime_url = "https://visca.ai"  # Ajusta para auto-alojado
  api_key       = var.oneuptime_api_key
}

# Crea un proyecto
resource "oneuptime_project" "example" {
  name        = "Ejemplo de Terraform"
  description = "Creado con Terraform"
}

# Crea un monitor de sitio web
resource "oneuptime_monitor" "website" {
  name       = "Monitor de sitio web"
  project_id = oneuptime_project.example.id

  monitor_type = "website"
  url          = "https://example.com"
  interval     = "5m"

  tags = {
    managed_by = "terraform"
  }
}
```

## Pasos de instalación

1. **Crea tu configuración de Terraform** con el bloque del proveedor
2. **Inicializa Terraform**: `terraform init`
3. **Establece tu clave de API**: Crea `terraform.tfvars` con tu clave de API
4. **Planifica tu despliegue**: `terraform plan`
5. **Aplica tu configuración**: `terraform apply`

## Obtener ayuda

- **Documentación completa**: Consulta la [documentación completa de Terraform](./README.md)
- **Guía auto-alojada**: Consulta la [guía de configuración auto-alojada](./self-hosted.md)
- **Ejemplos**: Navega por los [ejemplos de configuración](./examples.md)
- **Inicio rápido**: Sigue la [guía de inicio rápido](./quick-start.md)

## Actualizaciones del Registro

El proveedor se publica automáticamente en el Registro de Terraform cuando se lanzan nuevas versiones de Cast Operations. Los usuarios en la nube pueden usar el versionado semántico (`~> 7.0`) para obtener automáticamente actualizaciones compatibles, mientras que los usuarios auto-alojados deben fijar a versiones exactas.
