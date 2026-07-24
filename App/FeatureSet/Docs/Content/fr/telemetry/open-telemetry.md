# Intégrer OpenTelemetry (journaux, métriques et traces) avec Cast Operations.

### Étape 1 - Créer un jeton d'ingestion de télémétrie.

Une fois que vous avez créé un compte Cast Operations, vous pouvez créer un jeton d'ingestion de télémétrie pour ingérer des journaux, des métriques et des traces depuis votre application.

Après vous être inscrit à Cast Operations et avoir créé un projet. Cliquez sur « Plus » dans la barre de navigation et cliquez sur « Paramètres du projet ».

Sur la page des clés d'ingestion de télémétrie, cliquez sur « Créer une clé d'ingestion » pour créer un jeton.

![Créer un service](/docs/static/images/TelemetryIngestionKeys.png)

Une fois que vous avez créé un jeton, cliquez sur « Afficher » pour le visualiser.

![Afficher le service](/docs/static/images/TelemetryIngestionKeyView.png)

### Étape 2

#### Configurer le service de télémétrie dans votre application.

#### Journaux d'application

Nous utilisons OpenTelemetry pour collecter les journaux d'application. Cast Operations prend actuellement en charge l'ingestion de journaux depuis ces SDK OpenTelemetry. Veuillez suivre les instructions pour configurer le service de télémétrie dans votre application.

- [C++](https://opentelemetry.io/docs/instrumentation/cpp/)
- [Go](https://opentelemetry.io/docs/instrumentation/go/)
- [Java](https://opentelemetry.io/docs/instrumentation/java/)
- [JavaScript / Typescript / NodeJS / Navigateur](https://opentelemetry.io/docs/instrumentation/js/)
- [Python](https://opentelemetry.io/docs/instrumentation/python/)
- [Ruby](https://opentelemetry.io/docs/instrumentation/ruby/)
- [PHP](https://opentelemetry.io/docs/instrumentation/php/)
- [Erlang](https://opentelemetry.io/docs/instrumentation/erlang/)
- [Rust](https://opentelemetry.io/docs/instrumentation/rust/)
- [.NET / C#](https://opentelemetry.io/docs/instrumentation/net/)
- [Swift](https://opentelemetry.io/docs/instrumentation/swift/)

**Intégrer avec Cast Operations**

Une fois que vous avez configuré le service de télémétrie dans votre application, vous pouvez l'intégrer avec Cast Operations en définissant les variables d'environnement suivantes.

| Variable d'environnement    | Valeur                                          |
| --------------------------- | ----------------------------------------------- |
| OTEL_EXPORTER_OTLP_HEADERS  | x-cast-operations-token=VOTRE_JETON_SERVICE_CAST_OPERATIONS |
| OTEL_EXPORTER_OTLP_ENDPOINT | https://latticeruntime.com/otlp                      |
| OTEL_SERVICE_NAME           | NOM_DE_VOTRE_SERVICE                            |

**Exemple**

```bash
export OTEL_EXPORTER_OTLP_HEADERS=x-cast-operations-token=9c8806e0-a4aa-11ee-be95-010d5967b068
export OTEL_EXPORTER_OTLP_ENDPOINT=https://latticeruntime.com/otlp
export OTEL_SERVICE_NAME=mon-service
```

**Cast Operations auto-hébergé**

Si vous auto-hébergez Cast Operations, cela peut être remplacé par le point d'accès de votre collecteur OpenTelemetry auto-hébergé (ex. : `http(s)://VOTRE-HÔTE-CAST_OPERATIONS/otlp`)

Une fois que vous exécutez votre application, vous devriez voir les journaux dans la page du service de télémétrie Cast Operations. Veuillez contacter support@latticeruntime.com si vous avez besoin d'aide.

#### Utilisation du collecteur OpenTelemetry

Vous pouvez également utiliser le collecteur OpenTelemetry au lieu d'envoyer les données de télémétrie directement depuis votre application.
Si vous utilisez le collecteur OpenTelemetry, vous pouvez configurer l'exportateur Cast Operations dans le fichier de configuration du collecteur.

Voici l'exemple de configuration pour le collecteur OpenTelemetry.

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

exporters:
  # Exporter via HTTP
  otlphttp:
    endpoint: "https://latticeruntime.com/otlp"
    # Nécessite l'utilisation de l'encodeur JSON au lieu du Proto(buf) par défaut
    encoding: json
    headers:
      "Content-Type": "application/json"
      "x-cast-operations-token": "JETON_CAST_OPERATIONS" # Votre jeton Cast Operations

service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [otlphttp]
    metrics:
      receivers: [otlp]
      exporters: [otlphttp]
    logs:
      receivers: [otlp]
      exporters: [otlphttp]
```
