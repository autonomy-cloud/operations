import OperationsDate from "Common/Types/Date";
import Timezone from "Common/Types/Timezone";
import React, { FunctionComponent, ReactElement } from "react";

export interface ComponentProps {
  timezone: Timezone;
}

const TimezoneElement: FunctionComponent<ComponentProps> = (
  props: ComponentProps,
): ReactElement => {
  return (
    <p>{OperationsDate.getGmtOffsetFriendlyStringByTimezone(props.timezone)}</p>
  );
};

export default TimezoneElement;
