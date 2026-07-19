# Agente Docker de Cast Operations

## Descripción general

El Agente Docker de Cast Operations es una imagen de contenedor predefinida que incluye una configuración optimizada del OpenTelemetry Collector. Ejecútalo junto a tus contenedores existentes y detectará automáticamente cada contenedor del host, recopilará métricas de CPU / memoria / red / E/S de bloques además de los registros de los contenedores, y reenviará todo a Cast Operations mediante OTLP. Una sola imagen, un solo comando.

Esta página es la **guía de instalación**. Para configurar monitores y alertas de Docker sobre los datos que recopila el agente, consulta [Docker Monitor](/docs/monitor/docker-monitor).

## Requisitos previos

- Docker Engine 20.10+
- Acceso a `/var/run/docker.sock` en el host
- Un **Token de Ingesta de Telemetría de Cast Operations** — crea uno desde _Project Settings → Telemetry Ingestion Keys_ y copia el valor

## Inicio rápido (un comando)

Reemplaza `YOUR_CAST_OPERATIONS_URL`, `YOUR_TELEMETRY_INGESTION_TOKEN` y el nombre del host con los valores de tu entorno. El nombre del host es la forma en que este host de Docker aparecerá en Cast Operations — elige algo como `prod-docker-01`.

```bash
docker run -d \
  --name cast-operations-docker-agent \
  --user 0:0 \
  --restart unless-stopped \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -v /var/lib/docker/containers:/var/lib/docker/containers:ro \
  -e CAST_OPERATIONS_URL="YOUR_CAST_OPERATIONS_URL" \
  -e CAST_OPERATIONS_SERVICE_TOKEN="YOUR_TELEMETRY_INGESTION_TOKEN" \
  -e DOCKER_HOST_NAME="my-docker-host" \
  cast-operations/docker-agent:release
```

Eso es todo. Una vez que el agente se conecte, tu host de Docker aparecerá automáticamente en la sección **Docker** del panel de Cast Operations.

## Alternativa — Docker Compose

Si prefieres Docker Compose, coloca lo siguiente en un archivo `docker-compose.yml`:

```yaml
services:
  cast-operations-docker-agent:
    image: cast-operations/docker-agent:release
    container_name: cast-operations-docker-agent
    user: "0:0"
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
    environment:
      - CAST_OPERATIONS_URL=YOUR_CAST_OPERATIONS_URL
      - CAST_OPERATIONS_SERVICE_TOKEN=YOUR_TELEMETRY_INGESTION_TOKEN
      - DOCKER_HOST_NAME=my-docker-host
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

Inícialo:

```bash
docker compose up -d
```

## Variables de entorno

| Variable                  | Obligatoria | Descripción                                                                                                                                  |
| ------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `CAST_OPERATIONS_URL`           | Sí          | La URL de tu instancia de Cast Operations (por ejemplo `https://visca.ai` o tu host autoalojado)                                              |
| `CAST_OPERATIONS_SERVICE_TOKEN` | Sí          | Token de ingesta de telemetría de _Project Settings → Telemetry Ingestion Keys_                                                              |
| `DOCKER_HOST_NAME`        | No          | Nombre descriptivo para este host. El valor predeterminado es `docker-host`. Configúralo con algo estable por host (p. ej. `prod-docker-01`) |

## Verificar la instalación

Comprueba que el agente está en ejecución:

```bash
docker ps --filter name=cast-operations-docker-agent
```

Revisa los registros del agente:

```bash
docker logs -f cast-operations-docker-agent
```

Busca: `"Everything is ready. Begin running and processing data."`

En aproximadamente un minuto, el host debería aparecer en el panel de Cast Operations con métricas y registros fluyendo.

## Actualizar el agente

```bash
docker pull cast-operations/docker-agent:release
docker rm -f cast-operations-docker-agent
# Vuelve a ejecutar el comando `docker run` anterior
```

O con Docker Compose:

```bash
docker compose pull
docker compose up -d
```

## Desinstalar el agente

```bash
docker rm -f cast-operations-docker-agent
```

Si usaste Docker Compose:

```bash
docker compose down
```

## Qué se recopila

| Categoría                      | Datos                                                                            |
| ------------------------------ | -------------------------------------------------------------------------------- |
| **Métricas de CPU**            | Uso total, porcentaje de uso, tiempo de limitación (throttling) (por contenedor) |
| **Métricas de memoria**        | Uso, límite, porcentaje, RSS, caché (por contenedor)                             |
| **Métricas de red**            | Bytes y paquetes recibidos / transmitidos (por contenedor)                       |
| **Métricas de E/S de bloques** | Bytes y operaciones de lectura / escritura (por contenedor)                      |
| **Información del contenedor** | Tiempo de actividad, recuento de reinicios, recuento de procesos                 |
| **Registros del contenedor**   | Registros stdout / stderr de todos los contenedores                              |

## Cast Operations autoalojado

Si estás autoalojando Cast Operations, configura `CAST_OPERATIONS_URL` con tu propia instancia:

```bash
-e CAST_OPERATIONS_URL="https://your-operations-host.example.com"
```

Si tu instancia es solo HTTP, usa `http://` y el puerto correspondiente.

## Solución de problemas

### Permiso denegado para el socket de Docker

El contenedor del agente debe ejecutarse como root (`--user 0:0`) para acceder a `/var/run/docker.sock`. Asegúrate de que esté presente el indicador `--user 0:0` (o `user: "0:0"` en Compose).

### El agente aparece como desconectado

1. Comprueba que el agente está en ejecución: `docker ps --filter name=cast-operations-docker-agent`
2. Revisa los registros del agente: `docker logs cast-operations-docker-agent | grep -i error`
3. Verifica que tu URL de Cast Operations y el token de servicio sean correctos
4. Asegúrate de que tu host de Docker pueda alcanzar la instancia de Cast Operations a través de la red

### No aparecen métricas

1. Verifica que el socket de Docker sea accesible dentro del agente: `docker exec cast-operations-docker-agent ls -la /var/run/docker.sock`
2. Revisa los registros del collector en busca de errores de exportación: `docker logs cast-operations-docker-agent | tail -100`
3. Asegúrate de que tu token de servicio sea válido y no haya caducado

### El nombre del host aparece como un ID de contenedor

Configura la variable de entorno `DOCKER_HOST_NAME` con un nombre descriptivo y vuelve a crear el contenedor.

## Próximos pasos

- Configura **Docker Monitors** para alertar sobre condiciones de CPU / memoria / reinicio de contenedores — consulta [Docker Monitor](/docs/monitor/docker-monitor).
- Para clústeres de Kubernetes en lugar de hosts de Docker independientes, usa el [Agente Kubernetes de Cast Operations](/docs/telemetry/kubernetes-agent).
- Para hosts no contenedorizados (VMs y servidores físicos de Linux / macOS / Windows), usa el [Host OpenTelemetry Collector](/docs/telemetry/host-otel-collector).
