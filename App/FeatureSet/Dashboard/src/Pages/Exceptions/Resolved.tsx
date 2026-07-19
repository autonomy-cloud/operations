import PageComponentProps from "../PageComponentProps";
import React, { FunctionComponent, ReactElement } from "react";
import ExceptionsViewer from "../../Components/Exceptions/ExceptionsViewer";

const ResolvedExceptionsPage: FunctionComponent<
  PageComponentProps
> = (): ReactElement => {
  return <ExceptionsViewer defaultStatus="resolved" />;
};

export default ResolvedExceptionsPage;
