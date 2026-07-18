import { DatabaseBaseModelType } from "../../../../Models/DatabaseModels/DatabaseBaseModel/DatabaseBaseModel";
import DatabaseCommonInteractionProps from "../../../../Types/BaseDatabase/DatabaseCommonInteractionProps";
import CaptureSpan from "../../../Utils/Telemetry/CaptureSpan";

export default class EditionPermissions {
  // Retained as a compatibility hook for decorated models. Cast Operations is
  // single-edition, so edition metadata never restricts database access.
  @CaptureSpan()
  public static checkEditionPermissions(
    _modelType: DatabaseBaseModelType,
    _props: DatabaseCommonInteractionProps,
  ): void {
    return;
  }
}
