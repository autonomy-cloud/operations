import PageComponentProps from "../PageComponentProps";
import React, { FunctionComponent, ReactElement } from "react";
import MetricsViewer from "../../Components/Metrics/MetricsViewer";

const MetricsPage: FunctionComponent<PageComponentProps> = (): ReactElement => {
  return <MetricsViewer />;
};

export default MetricsPage;
