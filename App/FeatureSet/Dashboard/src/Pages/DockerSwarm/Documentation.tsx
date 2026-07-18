import PageComponentProps from "../PageComponentProps";
import React, { Fragment, FunctionComponent, ReactElement } from "react";
import DockerSwarmDocumentationCard from "../../Components/DockerSwarm/DocumentationCard";

const DockerSwarmDocumentation: FunctionComponent<
  PageComponentProps
> = (): ReactElement => {
  return (
    <Fragment>
      <DockerSwarmDocumentationCard
        title="Agent Installation Guide"
        description="Install the Cast Operations Docker Swarm Agent to connect your Docker Swarm cluster. Once installed, the cluster will appear automatically."
      />
    </Fragment>
  );
};

export default DockerSwarmDocumentation;
