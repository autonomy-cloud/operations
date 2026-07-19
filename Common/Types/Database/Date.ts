import InBetween from "../BaseDatabase/InBetween";
import OperationsDate from "../Date";

export default class DatabaseDate {
  public static asDateStartOfTheDayEndOfTheDayForDatabaseQuery(
    date: string | Date,
  ): InBetween<string> {
    let startValue: string | Date = date;

    if (!(startValue instanceof Date)) {
      startValue = OperationsDate.fromString(startValue);
    }

    let endValue: string | Date = date;

    if (!(endValue instanceof Date)) {
      endValue = OperationsDate.fromString(endValue);
    }

    startValue = OperationsDate.getStartOfDay(startValue);
    endValue = OperationsDate.getEndOfDay(endValue);

    return new InBetween(
      OperationsDate.toDatabaseDate(startValue),
      OperationsDate.toDatabaseDate(endValue),
    );
  }
}
