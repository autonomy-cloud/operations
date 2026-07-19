import PageComponentProps from "../PageComponentProps";
import React, { FunctionComponent, ReactElement } from "react";
import LogsDashboard from "../../Components/Logs/LogsDashboard";

const LogsInsightsPage: FunctionComponent<
  PageComponentProps
> = (): ReactElement => {
  return <LogsDashboard />;
};

export default LogsInsightsPage;
