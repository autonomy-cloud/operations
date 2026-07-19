import NotAuthenticatedException from "../../Types/Exception/NotAuthenticatedException";
import ProductType from "../../Types/Telemetry/ProductType";
import ObjectID from "../../Types/ObjectID";
import {
  ExpressRequest,
  ExpressResponse,
  NextFunction,
} from "../../Server/Utils/Express";
import TelemetryIngestionKeyService from "../../Server/Services/TelemetryIngestionKeyService";
import Response from "../Utils/Response";
import logger, { getLogAttributesFromRequest } from "../Utils/Logger";
import CaptureSpan from "../Utils/Telemetry/CaptureSpan";
import SpanUtil from "../Utils/Telemetry/SpanUtil";

export interface TelemetryRequest extends ExpressRequest {
  projectId: ObjectID; // Project ID
  productType: ProductType; // what is the product type of the request - logs, metrics or traces.
}

export default class TelemetryIngest {
  @CaptureSpan()
  public static async isAuthorizedServiceMiddleware(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction,
  ): Promise<void> {
    try {
      // check header.

      let castOperationsToken: string | undefined = req.headers[
        "x-cast-operations-token"
      ] as string | undefined;

      // if x-cast-operations-service-token header is present then use that as token.
      if (!castOperationsToken) {
        castOperationsToken = req.headers["x-cast-operations-service-token"] as
          | string
          | undefined;
      }

      // if x-cast-operations-ingestion-key header is present then use that as token.
      if (!castOperationsToken) {
        castOperationsToken = req.headers["x-cast-operations-ingestion-key"] as
          | string
          | undefined;
      }

      if (!castOperationsToken) {
        logger.error(
          "Missing header: x-cast-operations-token",
          getLogAttributesFromRequest(req as any),
        );

        /*
         * 401 is deliberate: the OTLP spec classifies it as
         * non-retryable, so compliant SDKs / collectors surface the
         * error in their own logs instead of retry-storming. A silent
         * 200 here would make the client believe the data landed and
         * leave the user staring at empty dashboards with no clue why.
         */
        return Response.sendErrorResponse(
          req,
          res,
          new NotAuthenticatedException(
            "Missing ingestion token. Send your Cast Operations telemetry ingestion key in the x-cast-operations-token header.",
          ),
        );
      }

      const projectId: ObjectID | null =
        await TelemetryIngestionKeyService.getProjectIdFromSecretKey(
          castOperationsToken.toString(),
        );

      if (!projectId) {
        logger.error(
          "Invalid service token: " + castOperationsToken,
          getLogAttributesFromRequest(req as any),
        );

        /*
         * 401 is deliberate (see the missing-token branch above): a
         * silent 200 drops the payload while the client believes the
         * export succeeded. The token value is logged server-side but
         * intentionally not echoed back in the response body.
         */
        return Response.sendErrorResponse(
          req,
          res,
          new NotAuthenticatedException(
            "Invalid ingestion token. Send a valid Cast Operations telemetry ingestion key in the x-cast-operations-token header.",
          ),
        );
      }

      (req as TelemetryRequest).projectId = projectId;

      // Tag span with project context for telemetry ingestion observability
      SpanUtil.addAttributesToCurrentSpan({
        projectId: projectId.toString(),
      });

      next();
    } catch (err) {
      return next(err);
    }
  }
}
