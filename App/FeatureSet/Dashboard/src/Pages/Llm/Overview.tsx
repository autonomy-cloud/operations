import PageComponentProps from "../PageComponentProps";
import React, { FunctionComponent, ReactElement } from "react";
import LlmOverview from "../../Components/AI/LlmOverview";

const LlmOverviewPage: FunctionComponent<
  PageComponentProps
> = (): ReactElement => {
  return <LlmOverview />;
};

export default LlmOverviewPage;
