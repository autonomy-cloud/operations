import DatabaseRequestType from "../../BaseDatabase/DatabaseRequestType";
import { DatabaseBaseModelType } from "../../../../Models/DatabaseModels/DatabaseBaseModel/DatabaseBaseModel";
import DatabaseCommonInteractionProps from "../../../../Types/BaseDatabase/DatabaseCommonInteractionProps";
import CaptureSpan from "../../../Utils/Telemetry/CaptureSpan";

export default class BillingPermissions {
  @CaptureSpan()
  public static checkBillingPermissions(
    _modelType: DatabaseBaseModelType,
    _props: DatabaseCommonInteractionProps,
    _type: DatabaseRequestType,
  ): void {
    // Cast Operations has no plans, invoices, or paid capability gates.
    return;
  }
}
