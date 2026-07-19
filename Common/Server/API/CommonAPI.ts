import { ExpressRequest, OperationsRequest } from "../Utils/Express";
import DatabaseCommonInteractionProps from "../../Types/BaseDatabase/DatabaseCommonInteractionProps";
import UserType from "../../Types/UserType";
import CaptureSpan from "../Utils/Telemetry/CaptureSpan";
import SpanUtil from "../Utils/Telemetry/SpanUtil";

export default class CommonAPI {
  @CaptureSpan()
  public static async getDatabaseCommonInteractionProps(
    req: ExpressRequest,
  ): Promise<DatabaseCommonInteractionProps> {
    const props: DatabaseCommonInteractionProps = {
      tenantId: undefined,
      userGlobalAccessPermission: undefined,
      userTenantAccessPermission: undefined,
      userId: undefined,
      userType: (req as OperationsRequest).userType,
      isMultiTenantRequest: undefined,
    };

    if (
      (req as OperationsRequest).userAuthorization &&
      (req as OperationsRequest).userAuthorization?.userId
    ) {
      props.userId = (req as OperationsRequest).userAuthorization!.userId;
    }

    if ((req as OperationsRequest).userGlobalAccessPermission) {
      props.userGlobalAccessPermission = (
        req as OperationsRequest
      ).userGlobalAccessPermission;
    }

    if ((req as OperationsRequest).userTenantAccessPermission) {
      props.userTenantAccessPermission = (
        req as OperationsRequest
      ).userTenantAccessPermission;
    }

    if ((req as OperationsRequest).userTeamIds) {
      props.userTeamIds = (req as OperationsRequest).userTeamIds;
    }

    if ((req as OperationsRequest).tenantId) {
      props.tenantId = (req as OperationsRequest).tenantId || undefined;
    }

    if (req.headers["is-multi-tenant-query"]) {
      props.isMultiTenantRequest = true;
    }

    // check for root permissions.

    if (props.userType === UserType.MasterAdmin) {
      props.isMasterAdmin = true;
    }

    // Add context attributes to the current span for observability
    SpanUtil.addAttributesToCurrentSpan({
      ...(props.tenantId ? { projectId: props.tenantId.toString() } : {}),
      ...(props.userId ? { userId: props.userId.toString() } : {}),
      ...(props.userType ? { userType: props.userType } : {}),
      ...((req as OperationsRequest).requestId
        ? { requestId: (req as OperationsRequest).requestId }
        : {}),
    });

    return props;
  }
}
