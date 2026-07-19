import PageComponentProps from "../PageComponentProps";
import React, { FunctionComponent, ReactElement } from "react";
import ExceptionsViewer from "../../Components/Exceptions/ExceptionsViewer";

const ArchivedExceptionsPage: FunctionComponent<
  PageComponentProps
> = (): ReactElement => {
  return <ExceptionsViewer defaultStatus="archived" />;
};

export default ArchivedExceptionsPage;
