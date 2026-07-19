import PageComponentProps from "../PageComponentProps";
import React, { FunctionComponent, ReactElement } from "react";
import LlmCallsTable from "../../Components/AI/LlmCallsTable";

const LlmCallsPage: FunctionComponent<
  PageComponentProps
> = (): ReactElement => {
  return <LlmCallsTable />;
};

export default LlmCallsPage;
