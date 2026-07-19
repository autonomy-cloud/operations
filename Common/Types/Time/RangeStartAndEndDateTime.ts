import InBetween from "../BaseDatabase/InBetween";
import TimeRange from "./TimeRange";
import OperationsDate from "../Date";

export default interface RangeStartAndEndDateTime {
  startAndEndDate?: InBetween<Date> | undefined;
  range: TimeRange;
}

export class RangeStartAndEndDateTimeUtil {
  public static getStartAndEndDate(
    dashboardStartAndEndDate: RangeStartAndEndDateTime,
  ): InBetween<Date> {
    const currentDate: Date = OperationsDate.getCurrentDate();

    // 5 mins.
    if (dashboardStartAndEndDate.range === TimeRange.PAST_FIVE_MINS) {
      return new InBetween<Date>(
        OperationsDate.addRemoveMinutes(currentDate, -5),
        currentDate,
      );
    }

    // 15 mins.
    if (dashboardStartAndEndDate.range === TimeRange.PAST_FIFTEEN_MINS) {
      return new InBetween<Date>(
        OperationsDate.addRemoveMinutes(currentDate, -15),
        currentDate,
      );
    }

    // 30 mins.
    if (dashboardStartAndEndDate.range === TimeRange.PAST_THIRTY_MINS) {
      return new InBetween<Date>(
        OperationsDate.addRemoveMinutes(currentDate, -30),
        currentDate,
      );
    }

    if (dashboardStartAndEndDate.range === TimeRange.PAST_ONE_HOUR) {
      return new InBetween<Date>(
        OperationsDate.addRemoveHours(currentDate, -1),
        currentDate,
      );
    }

    // two hours.
    if (dashboardStartAndEndDate.range === TimeRange.PAST_TWO_HOURS) {
      return new InBetween<Date>(
        OperationsDate.addRemoveHours(currentDate, -2),
        currentDate,
      );
    }

    // three hours
    if (dashboardStartAndEndDate.range === TimeRange.PAST_THREE_HOURS) {
      return new InBetween<Date>(
        OperationsDate.addRemoveHours(currentDate, -3),
        currentDate,
      );
    }

    if (dashboardStartAndEndDate.range === TimeRange.PAST_ONE_DAY) {
      return new InBetween<Date>(
        OperationsDate.addRemoveDays(currentDate, -1),
        currentDate,
      );
    }

    // two days .
    if (dashboardStartAndEndDate.range === TimeRange.PAST_TWO_DAYS) {
      return new InBetween<Date>(
        OperationsDate.addRemoveDays(currentDate, -2),
        currentDate,
      );
    }

    if (dashboardStartAndEndDate.range === TimeRange.PAST_ONE_WEEK) {
      return new InBetween<Date>(
        OperationsDate.addRemoveDays(currentDate, -7),
        currentDate,
      );
    }

    // two weeks.
    if (dashboardStartAndEndDate.range === TimeRange.PAST_TWO_WEEKS) {
      return new InBetween<Date>(
        OperationsDate.addRemoveDays(currentDate, -14),
        currentDate,
      );
    }

    if (dashboardStartAndEndDate.range === TimeRange.PAST_ONE_MONTH) {
      return new InBetween<Date>(
        OperationsDate.addRemoveMonths(currentDate, -1),
        currentDate,
      );
    }

    // three months.
    if (dashboardStartAndEndDate.range === TimeRange.PAST_THREE_MONTHS) {
      return new InBetween<Date>(
        OperationsDate.addRemoveMonths(currentDate, -3),
        currentDate,
      );
    }

    // custom
    return (
      dashboardStartAndEndDate.startAndEndDate ||
      new InBetween<Date>(currentDate, currentDate)
    );
  }
}
