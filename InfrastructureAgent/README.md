# Cast Operations Infrastructure Agent

The Cast Operations Infrastructure Agent is a lightweight, open-source agent that collects system metrics and sends them to the Cast Operations platform. It is designed to be easy to install and use, and to be extensible.

### Installation

```
curl -sSL https://latticeruntime.com/docs/static/scripts/infrastructure-agent/install.sh | bash
```

### Configure the agent

Configure the agent as a system service

- You can change the host to your own host if you're self hosting the Cast Operations platform.
- You can find the secret key on Cast Operations Dashboard. Click on "View Monitor" and go to "Settings" tab.

```bash
cast-operations-infrastructure-agent configure --secret-key=YOUR_SECRET_KEY --cast-operations-url=https://latticeruntime.com
```

### Starting the agent

```
cast-operations-infrastructure-agent start
```

Once its up and running you should see the metrics on the Cast Operations Dashboard.

### Stopping the agent

```
cast-operations-infrastructure-agent stop
```

### Restarting the agent

```
cast-operations-infrastructure-agent restart
```

### Uninstalling the agent

```
cast-operations-infrastructure-agent uninstall && rm -rf /usr/bin/cast-operations-infrastructure-agent
```

### Viewing agent logs

```
cast-operations-infrastructure-agent logs
```

You can also use the following options:

- Show specific number of lines: `cast-operations-infrastructure-agent logs -n 50`
- Follow logs in real-time: `cast-operations-infrastructure-agent logs -f`

### Supported Platforms

- Linux
- MacOS
- Windows

## Development

This section is for developers who want to contribute to the agent. The agent is written in Go.

### Building the agent

```bash
go mod tidy
go install
go build
```

### Configure the agent

```bash
sudo ./cast-operations-infrastructure-agent configure --secret-key=YOUR_SECRET_KEY --cast-operations-url=https://localhost
```

### Starting the agent

```bash
sudo ./cast-operations-infrastructure-agent start
```

### Stopping the agent

```bash
sudo ./cast-operations-infrastructure-agent stop
```

### Viewing logs

```bash
sudo ./cast-operations-infrastructure-agent logs
```
