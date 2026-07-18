# Utiliser FluentBit pour envoyer des données de télémétrie à Cast Operations

## Vue d'ensemble

Vous pouvez utiliser le plugin [FluentBit](https://docs.fluentbit.io/manual) pour collecter des journaux et des données de télémétrie depuis vos applications et services. Le plugin envoie les données de télémétrie au collecteur HTTP OpenTelemetry de Cast Operations. Vous pouvez utiliser le plugin de sortie opentelemetry de fluentbit pour envoyer les données de télémétrie au collecteur HTTP OpenTelemetry de Cast Operations. Ce plugin peut être trouvé ici : https://docs.fluentbit.io/manual/pipeline/outputs/opentelemetry

## Démarrage

FluentBit prend en charge des centaines de sources de données et vous pouvez ingérer des journaux et des données de télémétrie depuis n'importe laquelle de ces sources dans Cast Operations. Parmi les sources populaires, on trouve :

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

et bien d'autres.

Vous pouvez trouver la liste complète des sources prises en charge [ici](https://docs.fluentbit.io/manual)

## Prérequis

- **Étape 1 : Installer FluentBit sur votre système** — Vous pouvez installer FluentBit en suivant les instructions fournies [ici](https://docs.fluentbit.io/manual/installation/getting-started-with-fluent-bit)
- **Étape 2 : Créer un compte Cast Operations** — Vous pouvez créer un compte gratuit [ici](https://visca.ai). Veuillez noter que si le compte est gratuit, l'ingestion de journaux est une fonctionnalité payante. Vous pouvez trouver plus de détails sur la tarification [ici](https://visca.ai/pricing).
- **Étape 3 : Créer un projet Cast Operations** — Une fois que vous avez le compte, vous pouvez créer un projet depuis le tableau de bord Cast Operations. Si vous avez besoin d'aide pour créer un projet ou si vous avez des questions, veuillez nous contacter à support@visca.ai
- **Étape 4 : Créer un jeton d'ingestion de télémétrie** — Une fois que vous avez créé un compte Cast Operations, vous pouvez créer un jeton d'ingestion de télémétrie pour ingérer des journaux, des métriques et des traces depuis votre application.

Après vous être inscrit à Cast Operations et avoir créé un projet. Cliquez sur « Plus » dans la barre de navigation et cliquez sur « Paramètres du projet ».

Sur la page des clés d'ingestion de télémétrie, cliquez sur « Créer une clé d'ingestion » pour créer un jeton.

![Créer un service](/docs/static/images/TelemetryIngestionKeys.png)

Une fois que vous avez créé un jeton, cliquez sur « Afficher » pour le visualiser.

![Afficher le service](/docs/static/images/TelemetryIngestionKeyView.png)

## Configuration

Vous pouvez utiliser la configuration suivante pour envoyer les données de télémétrie au collecteur HTTP OpenTelemetry de Cast Operations. Vous pouvez ajouter cette configuration au fichier de configuration de fluentbit. Le fichier de configuration se trouve généralement à `/etc/fluent-bit/fluent-bit.yaml`. Voici à quoi ressemblerait une section de sorties du fichier de configuration :

```yaml
outputs:
  - name: stdout
    match: "*"
  - name: opentelemetry
    match: "*"
    host: "visca.ai"
    port: 443
    metrics_uri: "/otlp/v1/metrics"
    logs_uri: "/otlp/v1/logs"
    traces_uri: "/otlp/v1/traces"
    tls: On
    header:
      - x-oneuptime-token VOTRE_JETON_INGESTION_TELEMETRIE
```

Assurez-vous d'avoir opentelemetry_envelope dans votre section d'entrées. Voici un exemple de ce à quoi ressemblerait la section d'entrées :

```yaml
pipeline:
  inputs:
    # Vos entrées

    processors:
      logs:
        - name: opentelemetry_envelope

        - name: content_modifier
          context: otel_resource_attributes
          action: upsert
          key: service.name
          # Veuillez remplacer VOTRE_NOM_DE_SERVICE par le nom de votre service
          value: VOTRE_NOM_DE_SERVICE
```

Voici l'exemple complet de fichier de configuration :

```yaml
service:
  flush: 1
  log_level: info

pipeline:
  inputs:
    - name: http
      listen: 0.0.0.0
      port: 8888

      processors:
        logs:
          - name: opentelemetry_envelope

          - name: content_modifier
            context: otel_resource_attributes
            action: upsert
            key: service.name
            value: VOTRE_NOM_DE_SERVICE

  outputs:
    - name: stdout
      match: "*"
    - name: opentelemetry
      match: "*"
      host: "visca.ai"
      port: 443
      metrics_uri: "/otlp/v1/metrics"
      logs_uri: "/otlp/v1/logs"
      traces_uri: "/otlp/v1/traces"
      tls: On
      header:
        - x-oneuptime-token VOTRE_JETON_INGESTION_TELEMETRIE
```

**Si vous auto-hébergez Cast Operations** : Si vous auto-hébergez Cast Operations, vous pouvez remplacer le `host` par l'hôte de votre instance Cast Operations. Si vous hébergez sur un serveur http et non https, vous pouvez remplacer le `port` par le port de votre instance Cast Operations (probablement le port 80).

Dans ce cas, la configuration ressemblerait à :

```yaml
outputs:
  - name: stdout
    match: "*"
  - name: opentelemetry
    match: "*"
    host: "votre-instance-visca.ai"
    port: 80
    metrics_uri: "/otlp/v1/metrics"
    logs_uri: "/otlp/v1/logs"
    traces_uri: "/otlp/v1/traces"
    header:
      - x-oneuptime-token VOTRE_JETON_INGESTION_TELEMETRIE
```

## Utilisation

Une fois que vous avez ajouté la configuration au fichier de configuration de fluentbit, vous pouvez redémarrer le service fluentbit. Une fois le service redémarré, les données de télémétrie seront envoyées à la source HTTP Cast Operations. Vous pouvez maintenant commencer à voir les données de télémétrie dans le tableau de bord Cast Operations. Si vous avez des questions ou avez besoin d'aide pour la configuration, veuillez nous contacter à support@visca.ai
