import PageMap from "../../Utils/PageMap";
import RouteMap from "../../Utils/RouteMap";
import HealthPage from "./HealthPage";
import InstanceHealthLogs from "./InstanceHealthLogs";
import Route from "Common/Types/API/Route";
import React, { FunctionComponent, ReactElement } from "react";

const HealthInstanceLogs: FunctionComponent = (): ReactElement => {
  return (
    <HealthPage
      title="Instance Logs"
      currentRoute={RouteMap[PageMap.HEALTH_INSTANCE_LOGS] as Route}
    >
      <InstanceHealthLogs />
    </HealthPage>
  );
};

export default HealthInstanceLogs;
