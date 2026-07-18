# Fluentd

This guide will help you test fluentd logs with Cast Operations.

## Prerequisites

- Fluentd installed on your system
- Cast Operations account
- Cast Operations project
- Telemetry Ingestion Key (Create one from the Cast Operations dashboard, Click on More -> Project Settings -> Telemetry Ingestion Key)

## Configuration and Testing

- Please make sure the correct token and url is in the configuration file located at `Fluentd/fluent.conf`.
- Build the docker image using the command `npm run force-build fluentd`
- Run the docker image using the command `npm run dev fluentd`
- Send logs to the Fluentd container using the curl command

```bash
curl -X POST -d 'json={"action":"login","user":2}' http://localhost:8888/test.tag.here;
```

You should be able to see the logs in the Cast Operations dashboard.
