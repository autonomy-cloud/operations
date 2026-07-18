import React, { FunctionComponent, ReactElement } from "react";

// Cast Operations has one complete feature set, so AI is never plan-gated.
export function isAIAccessibleOnCurrentPlan(): boolean {
  return true;
}

const AIPlanGate: FunctionComponent = (): ReactElement => {
  return <></>;
};

export default AIPlanGate;
