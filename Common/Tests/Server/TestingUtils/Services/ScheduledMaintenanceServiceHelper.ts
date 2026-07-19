import ObjectID from "../../../../Types/ObjectID";
import Faker from "../../../../Utils/Faker";
import ScheduledMaintenance from "../../../../Models/DatabaseModels/ScheduledMaintenance";
import OperationsDate from "../../../../Types/Date";

export default class ScheduledMaintenanceTestService {
  public static generateRandomScheduledMaintenance(data: {
    projectId: ObjectID;
    currentScheduledMaintenanceStateId: ObjectID;
  }): ScheduledMaintenance {
    const maintenance: ScheduledMaintenance = new ScheduledMaintenance();

    // required fields
    maintenance.projectId = data.projectId;
    maintenance.currentScheduledMaintenanceStateId =
      data.currentScheduledMaintenanceStateId;
    maintenance.title = Faker.generateName();
    maintenance.description = Faker.generateName();
    maintenance.startsAt = OperationsDate.getCurrentDate();
    maintenance.endsAt = OperationsDate.addRemoveDays(
      OperationsDate.getCurrentDate(),
      2,
    );
    maintenance.isOwnerNotifiedOfResourceCreation = false;
    maintenance.slug = maintenance.title;

    return maintenance;
  }
}
