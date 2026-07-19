import InBetween from "../BaseDatabase/InBetween";
import OperationsDate from "../Date";
import RollingTime from "./RollingTime";

export default class RollingTimeUtil {
  public static getDefault(): RollingTime {
    return RollingTime.Past1Minute;
  }

  public static convertToStartAndEndDate(
    rollingTime: RollingTime,
  ): InBetween<Date> {
    const endDate: Date = OperationsDate.getCurrentDate();
    let startDate: Date = OperationsDate.getCurrentDate();

    if (rollingTime === RollingTime.Past1Minute) {
      startDate = OperationsDate.addRemoveMinutes(endDate, -1);
    }

    if (rollingTime === RollingTime.Past5Minutes) {
      startDate = OperationsDate.addRemoveMinutes(endDate, -5);
    }

    if (rollingTime === RollingTime.Past10Minutes) {
      startDate = OperationsDate.addRemoveMinutes(endDate, -10);
    }

    if (rollingTime === RollingTime.Past15Minutes) {
      startDate = OperationsDate.addRemoveMinutes(endDate, -15);
    }

    if (rollingTime === RollingTime.Past30Minutes) {
      startDate = OperationsDate.addRemoveMinutes(endDate, -30);
    }

    if (rollingTime === RollingTime.Past1Hour) {
      startDate = OperationsDate.addRemoveHours(endDate, -1);
    }

    if (rollingTime === RollingTime.Past2Hours) {
      startDate = OperationsDate.addRemoveHours(endDate, -2);
    }

    if (rollingTime === RollingTime.Past3Hours) {
      startDate = OperationsDate.addRemoveHours(endDate, -3);
    }

    if (rollingTime === RollingTime.Past6Hours) {
      startDate = OperationsDate.addRemoveHours(endDate, -6);
    }

    if (rollingTime === RollingTime.Past12Hours) {
      startDate = OperationsDate.addRemoveHours(endDate, -12);
    }

    if (rollingTime === RollingTime.Past1Hours) {
      startDate = OperationsDate.addRemoveDays(endDate, -1);
    }

    if (rollingTime === RollingTime.Past2Days) {
      startDate = OperationsDate.addRemoveDays(endDate, -2);
    }

    if (rollingTime === RollingTime.Past3Days) {
      startDate = OperationsDate.addRemoveDays(endDate, -3);
    }

    if (rollingTime === RollingTime.Past7Days) {
      startDate = OperationsDate.addRemoveDays(endDate, -7);
    }

    if (rollingTime === RollingTime.Past14Days) {
      startDate = OperationsDate.addRemoveDays(endDate, -14);
    }

    if (rollingTime === RollingTime.Past30Days) {
      startDate = OperationsDate.addRemoveDays(endDate, -30);
    }

    if (rollingTime === RollingTime.Past60Days) {
      startDate = OperationsDate.addRemoveDays(endDate, -60);
    }

    if (rollingTime === RollingTime.Past90Days) {
      startDate = OperationsDate.addRemoveDays(endDate, -90);
    }

    if (rollingTime === RollingTime.Past180Days) {
      startDate = OperationsDate.addRemoveDays(endDate, -180);
    }

    if (rollingTime === RollingTime.Past365Days) {
      startDate = OperationsDate.addRemoveDays(endDate, -365);
    }

    return new InBetween(startDate, endDate);
  }
}
