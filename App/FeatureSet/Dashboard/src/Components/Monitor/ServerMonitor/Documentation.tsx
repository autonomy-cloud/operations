import ObjectID from "Common/Types/ObjectID";
import Card from "Common/UI/Components/Card/Card";
import CodeBlock from "Common/UI/Components/CodeBlock/CodeBlock";
import { HOST, HTTP_PROTOCOL } from "Common/UI/Config";
import React, { FunctionComponent, ReactElement } from "react";

export interface ComponentProps {
  secretKey: ObjectID;
}

const ServerMonitorDocumentation: FunctionComponent<ComponentProps> = (
  props: ComponentProps,
): ReactElement => {
  const host: string = `${HTTP_PROTOCOL}${HOST}`;

  return (
    <>
      <Card
        title={`Set up your Server Monitor (Linux/Mac)`}
        description={
          <div className="space-y-2 w-full mt-5">
            <CodeBlock
              language="bash"
              code={`
# Install the agent
curl -sSL ${HTTP_PROTOCOL}${HOST.toString()}/docs/static/scripts/infrastructure-agent/install.sh | sudo bash 

# Configure the agent (without proxy)
sudo cast-operations-infrastructure-agent configure --secret-key=${props.secretKey.toString()} --cast-operations-url=${host}

# Configure the agent (with proxy - optional)
# If you're using a proxy, you can set the proxy by running the following command
sudo cast-operations-infrastructure-agent configure --proxy-url=http://proxy.example.com:8080  --secret-key=${props.secretKey.toString()} --cast-operations-url=${host}

# To Start
sudo cast-operations-infrastructure-agent start



# To Stop
sudo cast-operations-infrastructure-agent stop

# To Uninstall
sudo cast-operations-infrastructure-agent uninstall
`}
            />
          </div>
        }
      />

      <Card
        title={`Set up your Server Monitor (Windows)`}
        description={
          <div className="space-y-2 w-full mt-5">
            <CodeBlock
              language="bash"
              code={`
# Step 1: Download the agent from GitHub https://github.com/autonomy-cloud/operations/releases/latest
# You should see a file named cast-operations-infrastructure-agent_windows_amd64.zip (if you're using x64) or cast-operations-infrastructure-agent_windows_arm64.zip (if you're using arm64)
# Extract the zip file, and you should see a file named cast-operations-infrastructure-agent.exe

# Command Line: Configure the agent in cmd (Run as Administrator)
cast-operations-infrastructure-agent configure --secret-key=${props.secretKey.toString()} --cast-operations-url=${host}

# Using a proxy (optional)
# If you're using a proxy, you can set the proxy by running the following command
cast-operations-infrastructure-agent configure --proxy-url=http://proxy.example.com:8080  --secret-key=${props.secretKey.toString()} --cast-operations-url=${host}

# To Start
cast-operations-infrastructure-agent start

# To Stop
cast-operations-infrastructure-agent stop

# To Uninstall
cast-operations-infrastructure-agent uninstall
`}
            />
          </div>
        }
      />
    </>
  );
};

export default ServerMonitorDocumentation;
