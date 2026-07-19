import PageComponentProps from "../PageComponentProps";
import React, { FunctionComponent, ReactElement } from "react";
import DashboardLogsViewer from "../../Components/Logs/LogsViewer";

const LogsPage: FunctionComponent<PageComponentProps> = (): ReactElement => {
  return (
    <DashboardLogsViewer
      showFilters={true}
      serviceIds={[]}
      limit={100}
      enableRealtime={true}
      id="logs"
      syncUrlState={true}
    />
  );
};

export default LogsPage;
