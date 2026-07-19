import PageComponentProps from "../PageComponentProps";
import React, { FunctionComponent, ReactElement } from "react";
import ExceptionsViewer from "../../Components/Exceptions/ExceptionsViewer";

const UnresolvedExceptionsPage: FunctionComponent<
  PageComponentProps
> = (): ReactElement => {
  return <ExceptionsViewer defaultStatus="unresolved" />;
};

export default UnresolvedExceptionsPage;
