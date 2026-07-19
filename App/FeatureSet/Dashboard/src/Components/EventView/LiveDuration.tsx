import OperationsDate from "Common/Types/Date";
import React, {
  FunctionComponent,
  ReactElement,
  useEffect,
  useState,
} from "react";

export interface ComponentProps {
  startDate: Date;
  endDate?: Date | undefined; // when undefined, ticks live against "now".
}

const LiveDuration: FunctionComponent<ComponentProps> = (
  props: ComponentProps,
): ReactElement => {
  const [now, setNow] = useState<Date>(OperationsDate.getCurrentDate());

  useEffect(() => {
    if (props.endDate) {
      return () => {};
    }

    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      setNow(OperationsDate.getCurrentDate());
    }, 30 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [props.endDate]);

  const endDate: Date = props.endDate || now;

  const minutes: number = Math.abs(
    OperationsDate.getDifferenceInMinutes(endDate, props.startDate),
  );

  const text: string =
    minutes < 1
      ? "less than a minute"
      : OperationsDate.convertMinutesToDaysHoursAndMinutes(minutes);

  return <span>{text}</span>;
};

export default LiveDuration;
