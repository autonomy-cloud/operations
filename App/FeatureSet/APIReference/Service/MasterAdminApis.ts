import {
  Host,
  HttpProtocol,
  IsBillingEnabled,
} from "Common/Server/EnvironmentConfig";
import { ViewsPath } from "../Utils/Config";
import ResourceUtil, { ModelDocumentation } from "../Utils/Resources";
import DataTypeUtil, { DataTypeDocumentation } from "../Utils/DataTypes";
import { buildRenderContext } from "../Utils/RenderContext";
import { ExpressRequest, ExpressResponse } from "Common/Server/Utils/Express";
import URL from "Common/Types/API/URL";
import Dictionary from "Common/Types/Dictionary";

const Resources: Array<ModelDocumentation> = ResourceUtil.getResources();
const DataTypes: Array<DataTypeDocumentation> = DataTypeUtil.getDataTypes();

export interface MasterAdminApiDocumentation {
  // Path relative to the /api/admin/health mount point.
  path: string;
  /*
   * Suffix of the `pages.masterAdminApis.<endpoint>Desc` translation key that
   * describes this endpoint.
   */
  key: string;
}

/*
 * The master-admin health endpoints that accept the instance master API key —
 * i.e. every route in App/API/AdminHealth.ts guarded by
 * MasterAdminAuthorization.isAuthorizedMasterAdminOrMasterApiKeyMiddleware.
 *
 * The read/write query console routes (POST /query/postgres, /query/clickhouse,
 * /query/redis) are deliberately absent: they stay on the JWT-only middleware so
 * a leaked static key cannot execute arbitrary queries headlessly.
 */
const MasterAdminApis: Array<MasterAdminApiDocumentation> = [
  { path: "/overview", key: "overview" },
  { path: "/queues", key: "queues" },
  {
    path: "/queues/{queueName}/failed-jobs",
    key: "failedJobs",
  },
  {
    path: "/clickhouse-capacity",
    key: "clickhouseCapacity",
  },
  {
    path: "/clickhouse-cluster",
    key: "clickhouseCluster",
  },
  {
    path: "/clickhouse-telemetry-ingestion",
    key: "clickhouseTelemetryIngestion",
  },
  {
    path: "/postgres-cluster",
    key: "postgresCluster",
  },
  { path: "/redis", key: "redis" },
  {
    path: "/instance-health-logs",
    key: "instanceHealthLogs",
  },
  { path: "/logs", key: "logs" },
  { path: "/migrations", key: "migrations" },
  { path: "/support-bundle", key: "supportBundle" },
];

export default class ServiceHandler {
  public static async executeResponse(
    req: ExpressRequest,
    res: ExpressResponse,
  ): Promise<void> {
    const ctx: ReturnType<typeof buildRenderContext> = buildRenderContext(req);

    const pageData: Dictionary<unknown> = {
      hostUrl: new URL(HttpProtocol, Host).toString(),
      basePath: "/api/admin/health",
      endpoints: MasterAdminApis,
    };

    res.status(200);

    return res.render(`${ViewsPath}/pages/index`, {
      page: "master-admin-apis",
      resources: Resources,
      dataTypes: DataTypes,
      pageTitle: ctx.t("pages.masterAdminApis.metaTitle"),
      enableGoogleTagManager: IsBillingEnabled,
      pageDescription: ctx.t("pages.masterAdminApis.metaDescription"),
      pageData: pageData,
      lang: ctx.lang,
      t: ctx.t,
      supportedLanguages: ctx.supportedLanguages,
      currentPath: ctx.currentPath,
      showMasterAdminApis: ctx.showMasterAdminApis,
    });
  }
}
