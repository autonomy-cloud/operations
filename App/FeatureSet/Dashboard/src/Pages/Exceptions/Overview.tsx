import PageComponentProps from "../PageComponentProps";
import React, { FunctionComponent, ReactElement } from "react";
import ExceptionsDashboard from "../../Components/Exceptions/ExceptionsDashboard";

const ExceptionsOverviewPage: FunctionComponent<
  PageComponentProps
> = (): ReactElement => {
  return <ExceptionsDashboard />;
};

export default ExceptionsOverviewPage;
