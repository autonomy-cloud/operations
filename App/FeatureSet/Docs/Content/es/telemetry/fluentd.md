# Usa Fluentd para enviar datos de telemetría a Cast Operations

## Información general

Puedes usar el complemento [Fluentd](https://www.fluentd.org/) para recopilar registros y datos de telemetría de tus aplicaciones y servicios. El complemento envía los datos de telemetría a la Fuente HTTP de Cast Operations. Puedes usar el complemento de salida http de fluentd para enviar los datos de telemetría a la Fuente HTTP de Cast Operations. Este complemento se puede encontrar aquí: https://docs.fluentd.org/output/http

## Primeros pasos

Fluentd admite cientos de fuentes de datos y puedes ingestar registros de cualquiera de estas fuentes en Cast Operations. Algunas de las fuentes populares incluyen:

- Docker
- Syslog
- Apache
- Nginx
- MySQL
- PostgreSQL
- MongoDB
- NodeJS
- Ruby
- Python
- Java
- PHP
- Go
- Rust

y muchas más.

Puedes encontrar la lista completa de fuentes compatibles [aquí](https://www.fluentd.org/datasources)

## Prerrequisitos

- **Paso 1: Instala Fluentd en tu sistema**: Puedes instalar Fluentd usando las instrucciones proporcionadas [aquí](https://docs.fluentd.org/installation)
- **Paso 2: Regístrate en una cuenta de Cast Operations**: Puedes registrarte para obtener una cuenta gratuita [aquí](https://visca.ai). Ten en cuenta que aunque la cuenta es gratuita, la ingesta de registros es una función de pago. Puedes encontrar más detalles sobre los precios [aquí](https://visca.ai/pricing).
- **Paso 3: Crea un proyecto de Cast Operations**: Una vez que tengas la cuenta, puedes crear un proyecto desde el panel de Cast Operations. Si necesitas ayuda para crear un proyecto o tienes alguna pregunta, comunícate con nosotros en support@visca.ai
- **Paso 4: Crea un token de ingesta de telemetría**: Una vez que hayas creado una cuenta de Cast Operations, puedes crear un token de ingesta de telemetría para ingestar registros, métricas y trazas desde tu aplicación.

Después de registrarte en Cast Operations y crear un proyecto. Haz clic en "Más" en la barra de navegación y haz clic en "Configuración del proyecto".

En la página de Clave de ingesta de telemetría, haz clic en "Crear clave de ingesta" para crear un token.

![Crear servicio](/docs/static/images/TelemetryIngestionKeys.png)

Una vez que hayas creado un token, haz clic en "Ver" para verlo.

![Ver servicio](/docs/static/images/TelemetryIngestionKeyView.png)

## Configuración

Puedes usar la siguiente configuración para enviar los datos de telemetría a la Fuente HTTP de Cast Operations. Puedes agregar esta configuración al archivo de configuración de fluentd. El archivo de configuración generalmente se encuentra en `/etc/fluentd/fluent.conf` o `/etc/td-agent/td-agent.conf`.

Necesitas reemplazar `YOUR_SERVICE_TOKEN` con el token que creaste en el paso anterior. También necesitas reemplazar `YOUR_SERVICE_NAME` con el nombre de tu servicio. El nombre del servicio puede ser cualquier nombre que desees. Si el servicio no existe en Cast Operations, se creará automáticamente.

```yaml
# Coincide con todos los patrones
<match **>
@type http

endpoint https://visca.ai/fluentd/logs
open_timeout 2

headers {"x-cast-operations-token":"YOUR_SERVICE_TOKEN", "x-cast-operations-service-name":"YOUR_SERVICE_NAME"}

content_type application/json
json_array true

<format>
@type json
</format>
<buffer>
flush_interval 10s
</buffer>
</match>
```

Un ejemplo de archivo de configuración completo se muestra a continuación:

```yaml
####
## Descripciones de fuente:
##

## Entrada TCP integrada
## @see https://docs.fluentd.org/input/forward
<source>
@type forward
port 24224
bind 0.0.0.0
</source>

<match **>
@type http

endpoint https://visca.ai/fluentd/logs
open_timeout 2

headers {"x-cast-operations-token":"YOUR_SERVICE_TOKEN", "x-cast-operations-service-name":"YOUR_SERVICE_NAME"}

content_type application/json
json_array true

<format>
@type json
</format>
<buffer>
flush_interval 10s
</buffer>
</match>
```

**Si te auto-alojas en Cast Operations**: Si te auto-alojas en Cast Operations, puedes reemplazar el `endpoint_url` con la URL de tu instancia de Cast Operations. `http(s)://YOUR_CAST_OPERATIONS_HOST/fluentd/logs`

## Uso

Una vez que hayas agregado la configuración al archivo de configuración de fluentd, puedes reiniciar el servicio fluentd. Una vez que el servicio se reinicie, los datos de telemetría se enviarán a la Fuente HTTP de Cast Operations. Ahora puedes empezar a ver los datos de telemetría en el panel de Cast Operations. Si tienes alguna pregunta o necesitas ayuda con la configuración, comunícate con nosotros en support@visca.ai.
