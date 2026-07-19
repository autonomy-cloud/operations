import PageComponentProps from "../PageComponentProps";
import React, { FunctionComponent, ReactElement } from "react";
import TracesViewer from "../../Components/Traces/TracesViewer";

const TracesPage: FunctionComponent<PageComponentProps> = (): ReactElement => {
  return <TracesViewer />;
};

export default TracesPage;
