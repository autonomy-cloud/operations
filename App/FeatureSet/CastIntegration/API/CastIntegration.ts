import Project from "Common/Models/DatabaseModels/Project";
import User from "Common/Models/DatabaseModels/User";
import { ClusterKey, HasClusterKey } from "Common/Server/EnvironmentConfig";
import PostgresAppInstance, {
  DatabaseQueryRunner,
  DatabaseSource,
} from "Common/Server/Infrastructure/PostgresDatabase";
import Redis from "Common/Server/Infrastructure/Redis";
import ProjectService from "Common/Server/Services/ProjectService";
import TeamMemberService from "Common/Server/Services/TeamMemberService";
import UserSessionService, {
  SessionMetadata,
} from "Common/Server/Services/UserSessionService";
import CookieUtil from "Common/Server/Utils/Cookie";
import Encryption from "Common/Server/Utils/Encryption";
import Express, {
  ExpressRequest,
  ExpressResponse,
  ExpressRouter,
  NextFunction,
  OperationsRequest,
  extractDeviceInfo,
  getClientIp,
  headerValueToString,
} from "Common/Server/Utils/Express";
import Response from "Common/Server/Utils/Response";
import UserService from "Common/Server/Services/UserService";
import BadDataException from "Common/Types/Exception/BadDataException";
import OperationsDate from "Common/Types/Date";
import Email from "Common/Types/Email";
import Name from "Common/Types/Name";
import NotAuthorizedException from "Common/Types/Exception/NotAuthorizedException";
import ObjectID from "Common/Types/ObjectID";
import SsoProviderType from "Common/Types/SSO/SsoProviderType";
import crypto from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import CastConsoleIdentityService, {
  CastInstallationIdentityConfig,
  ValidatedCastIdentity,
} from "../Services/CastConsoleIdentity";
import CastManagedResourceService from "../Services/CastManagedResource";

const MAX_BODY_BYTES: number = 1_048_576;
const SIGNATURE_TOLERANCE_MS: number = 5 * 60 * 1000;
const REPLAY_TTL_SECONDS: number = 10 * 60;
const PROCESSING_LEASE_SECONDS: number = 5 * 60;
const CAST_CONSOLE_SESSION_TTL_MINUTES: number = 15;
const SUPPORTED_EVENT_TYPES: ReadonlySet<string> = new Set([
  "CONNECTION_PROVISION_REQUESTED",
  "CONNECTION_DELETE_REQUESTED",
  "CONNECTION_STATUS_CHANGED",
  "BINDING_PROVISION_REQUESTED",
  "BINDING_STATUS_CHANGED",
  "BINDING_DELETE_REQUESTED",
]);

type InstallationRow = {
  _id: string;
  allowAccountLinkingByVerifiedEmail: boolean;
  appAudience: string;
  castIssuer: string;
  castWorkspaceId: string;
  connectionId: string;
  serviceUserId: string;
  sharedSecret: string;
  status: string;
};

export type IntegrationEnvelope = {
  aggregate: { id: string; type: string; version: number };
  bindingId: string | null;
  connectionId: string;
  eventId: string;
  eventType: string;
  idempotencyKey: string;
  occurredAt: string;
  payload: Record<string, unknown>;
  schemaVersion: number;
  workspaceId: string;
};

type IntegrationResponse = {
  capabilities: string[];
  externalResourceId?: string;
  externalScopeId?: string;
  remoteInstallationId: string;
  remoteVersion: string;
  status: "ACTIVE" | "DELETED";
};

type InboxEventRow = {
  _id: string;
  attemptCount: number;
  eventId: string;
  idempotencyKey: string;
  lockedAt: Date;
  maxAttempts: number;
  response: IntegrationResponse | null;
  status: string;
};

const returnedRows: <Row>(result: unknown) => Row[] = <Row>(
  result: unknown,
): Row[] => {
  if (!Array.isArray(result)) {
    return [];
  }

  /*
   * TypeORM's Postgres driver returns UPDATE ... RETURNING as
   * [rows, affectedCount], while INSERT/SELECT return rows directly.
   */
  if (Array.isArray(result[0]) && typeof result[1] === "number") {
    return result[0] as Row[];
  }

  return result as Row[];
};

const INTEGRATION_NONCE_PATTERN: RegExp = new RegExp("^[0-9a-f-]{36}$", "i");

export default class CastIntegrationAPI {
  public router: ExpressRouter;

  public constructor() {
    this.router = Express.getRouter();
    this.router.post("/installations", this.enrollInstallation.bind(this));
    this.router.post("/integration-events", this.receiveEvent.bind(this));
    this.router.post("/session", this.exchangeConsoleIdentity.bind(this));
  }

  public async enrollInstallation(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction,
  ): Promise<void> {
    try {
      CastIntegrationAPI.assertBootstrapAuthorization(req);
      const body: Record<string, unknown> = (req.body || {}) as Record<
        string,
        unknown
      >;
      const connectionId: string = CastIntegrationAPI.requiredUuid(
        body["connectionId"],
        "connectionId",
      );
      const workspaceId: string = CastIntegrationAPI.requiredUuid(
        body["workspaceId"],
        "workspaceId",
      );
      const sharedSecret: string = CastIntegrationAPI.requiredString(
        body["sharedSecret"],
        "sharedSecret",
        32,
        4096,
      );
      const castIssuer: string = CastConsoleIdentityService.normalizeIssuer(
        body["castIssuer"],
      );
      const appAudience: string =
        CastConsoleIdentityService.assertOperationsAudience(
          body["appAudience"],
        );
      if (body["allowAccountLinkingByVerifiedEmail"] === true) {
        throw new BadDataException(
          "Cast-managed identity must be linked by issuer and subject, not by email",
        );
      }
      const dataSource: DatabaseSource = CastIntegrationAPI.getDataSource();
      const serviceUserId: string =
        await CastIntegrationAPI.ensureInstallationActor(connectionId);

      const encryptedSecret: string = await Encryption.encrypt(sharedSecret);
      const rows: InstallationRow[] = await dataSource.query(
        `INSERT INTO "CastIntegrationInstallation"
          ("connectionId", "castWorkspaceId", "sharedSecret", "serviceUserId", "castIssuer", "appAudience", "allowAccountLinkingByVerifiedEmail", "status")
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'ACTIVE')
         ON CONFLICT ("connectionId") DO UPDATE SET
           "sharedSecret" = EXCLUDED."sharedSecret",
           "serviceUserId" = EXCLUDED."serviceUserId",
           "allowAccountLinkingByVerifiedEmail" = EXCLUDED."allowAccountLinkingByVerifiedEmail",
           "status" = 'ACTIVE',
           "updatedAt" = now()
         WHERE "CastIntegrationInstallation"."castWorkspaceId" = EXCLUDED."castWorkspaceId"
           AND "CastIntegrationInstallation"."castIssuer" = EXCLUDED."castIssuer"
           AND "CastIntegrationInstallation"."appAudience" = EXCLUDED."appAudience"
         RETURNING *`,
        [
          connectionId,
          workspaceId,
          encryptedSecret,
          serviceUserId,
          castIssuer,
          appAudience,
          false,
        ],
      );

      if (!rows[0]) {
        throw new BadDataException(
          "Cast connection identity cannot be reassigned to another workspace, issuer, or application",
        );
      }

      return Response.sendJsonObjectResponse(req, res, {
        installationId: rows[0]!._id,
        status: rows[0]!.status,
      });
    } catch (error) {
      next(error);
    }
  }

  private static async ensureInstallationActor(
    connectionId: string,
  ): Promise<string> {
    const email: Email = new Email(
      `cast-integration-${connectionId}@system.invalid`,
    );
    let user: User | null = await UserService.findByEmail(email, {
      isRoot: true,
    });

    if (!user) {
      try {
        user = await UserService.createByEmail({
          email,
          generateRandomPassword: true,
          isEmailVerified: true,
          name: new Name("Cast Integration"),
          props: { isRoot: true },
        });
      } catch (error) {
        /*
         * Enrollment is idempotent and may race during a rollout. If another
         * replica created the actor first, reuse that row; otherwise preserve
         * the original failure.
         */
        user = await UserService.findByEmail(email, { isRoot: true });
        if (!user) {
          throw error;
        }
      }
    }

    if (!user.id) {
      throw new Error("Cast integration actor has no persistent identifier");
    }

    return user.id.toString();
  }

  public async exchangeConsoleIdentity(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authorization: string =
        headerValueToString(req.headers["authorization"]) || "";
      if (!authorization.startsWith("Bearer ")) {
        throw new NotAuthorizedException(
          "Cast identity bearer token is required",
        );
      }
      const token: string = authorization.slice("Bearer ".length).trim();
      const untrusted: string | JwtPayload | null = jwt.decode(token);
      if (!untrusted || typeof untrusted === "string") {
        throw new NotAuthorizedException("Cast identity token is malformed");
      }
      const workspaceId: unknown = untrusted["workspaceId"];
      const audience: unknown = untrusted.aud;
      if (typeof workspaceId !== "string" || typeof audience !== "string") {
        throw new NotAuthorizedException(
          "Cast identity routing claims are invalid",
        );
      }

      const dataSource: DatabaseSource = CastIntegrationAPI.getDataSource();
      const installations: InstallationRow[] = await dataSource.query(
        `SELECT * FROM "CastIntegrationInstallation"
         WHERE "castWorkspaceId" = $1 AND "appAudience" = $2 AND "status" = 'ACTIVE'`,
        [workspaceId, audience],
      );
      if (installations.length !== 1) {
        throw new NotAuthorizedException(
          "No unique active Cast Operations installation matches this identity",
        );
      }
      const installation: InstallationRow = installations[0]!;
      const identity: ValidatedCastIdentity =
        await CastConsoleIdentityService.verifyToken({
          installation: installation as CastInstallationIdentityConfig,
          token,
        });
      const user: User = await CastConsoleIdentityService.resolveUser({
        identity,
        installation: installation as CastInstallationIdentityConfig,
      });
      const project: Project | null = await ProjectService.findOneBy({
        query: { castWorkspaceId: new ObjectID(workspaceId) },
        select: { _id: true },
        props: { isRoot: true },
      });
      if (!project?.id || !user.id) {
        throw new NotAuthorizedException(
          "Cast workspace has not been provisioned as an Operations project",
        );
      }

      await CastConsoleIdentityService.ensureProjectMembership({
        installationId: installation._id,
        isWorkspaceAdmin: identity.isWorkspaceAdmin,
        projectId: project.id,
        userId: user.id,
      });
      const sessionMetadata: SessionMetadata =
        await UserSessionService.createSession({
          userId: user.id,
          isGlobalLogin: false,
          ipAddress: getClientIp(req),
          userAgent: headerValueToString(req.headers["user-agent"]),
          ...extractDeviceInfo(req),
          additionalInfo: {
            authSource: "CAST_CONSOLE",
            castInstallationId: installation._id,
            projectId: project.id.toString(),
          },
          refreshTokenExpiresAt: OperationsDate.getSomeMinutesAfter(
            CAST_CONSOLE_SESSION_TTL_MINUTES,
          ),
        });
      CookieUtil.setSSOCookie({
        user,
        projectId: project.id,
        expressResponse: res,
        ssoProviderId: new ObjectID(installation._id),
        ssoProviderType: SsoProviderType.CastConsole,
        expiresInSeconds: CAST_CONSOLE_SESSION_TTL_MINUTES * 60,
      });
      CookieUtil.setUserCookie({
        expressResponse: res,
        user,
        isGlobalLogin: false,
        sessionId: sessionMetadata.session.id!,
        refreshToken: sessionMetadata.refreshToken,
        refreshTokenExpiresAt: sessionMetadata.refreshTokenExpiresAt,
      });

      return Response.sendJsonObjectResponse(req, res, {
        projectId: project.id.toString(),
        status: "AUTHENTICATED",
        userId: user.id.toString(),
      });
    } catch (error) {
      next(error);
    }
  }

  public async receiveEvent(
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction,
  ): Promise<void> {
    try {
      const envelope: IntegrationEnvelope =
        CastIntegrationAPI.parseEnvelope(req);
      const dataSource: DatabaseSource = CastIntegrationAPI.getDataSource();
      const installations: InstallationRow[] = await dataSource.query(
        `SELECT * FROM "CastIntegrationInstallation" WHERE "connectionId" = $1 LIMIT 1`,
        [envelope.connectionId],
      );
      const installation: InstallationRow | undefined = installations[0];

      if (
        !installation ||
        (installation.status !== "ACTIVE" &&
          !(
            installation.status === "REVOKED" &&
            envelope.eventType === "CONNECTION_DELETE_REQUESTED"
          ))
      ) {
        throw new NotAuthorizedException(
          "Cast integration installation is not active",
        );
      }

      if (installation.castWorkspaceId !== envelope.workspaceId) {
        throw new NotAuthorizedException(
          "Cast workspace does not match installation",
        );
      }

      await CastIntegrationAPI.verifySignature(req, installation.sharedSecret);
      const redisClient: ReturnType<typeof Redis.getClient> = Redis.getClient();
      if (!redisClient) {
        throw new Error(
          "Redis is unavailable; integration replay protection is fail-closed",
        );
      }
      const replayKey: string = `cast:integration:nonce:${envelope.connectionId}:${CastIntegrationAPI.requiredHeader(req, "x-cast-nonce")}`;
      const replayResult: string | null = await redisClient.set(
        replayKey,
        envelope.eventId,
        "EX",
        REPLAY_TTL_SECONDS,
        "NX",
      );

      if (replayResult !== "OK") {
        const cached: Array<{
          response: IntegrationResponse | null;
          status: string;
        }> = await dataSource.query(
          `SELECT "response", "status" FROM "CastIntegrationInbox" WHERE "eventId" = $1 OR "idempotencyKey" = $2 LIMIT 1`,
          [envelope.eventId, envelope.idempotencyKey],
        );
        if (cached[0]?.status === "PROCESSED" && cached[0].response) {
          return Response.sendJsonObjectResponse(req, res, cached[0].response);
        }
        throw new BadDataException("Duplicate or in-flight integration event");
      }

      let claimed: Array<{ _id: string }> = returnedRows(
        await dataSource.query(
          `INSERT INTO "CastIntegrationInbox"
          ("eventId", "idempotencyKey", "connectionId", "castWorkspaceId", "eventType", "aggregateVersion", "payload")
         VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
         ON CONFLICT DO NOTHING RETURNING "_id"`,
          [
            envelope.eventId,
            envelope.idempotencyKey,
            envelope.connectionId,
            envelope.workspaceId,
            envelope.eventType,
            envelope.aggregate.version,
            JSON.stringify(envelope),
          ],
        ),
      );

      if (claimed.length === 0) {
        const existing: InboxEventRow[] = await dataSource.query(
          `SELECT "_id", "attemptCount", "eventId", "idempotencyKey", "lockedAt", "maxAttempts", "response", "status"
           FROM "CastIntegrationInbox"
           WHERE "eventId" = $1 OR "idempotencyKey" = $2
           LIMIT 1`,
          [envelope.eventId, envelope.idempotencyKey],
        );
        const inboxEvent: InboxEventRow | undefined = existing[0];
        if (
          inboxEvent?.eventId !== envelope.eventId ||
          inboxEvent.idempotencyKey !== envelope.idempotencyKey
        ) {
          throw new BadDataException(
            "Integration event identity conflicts with an existing event",
          );
        }
        if (inboxEvent.status === "PROCESSED" && inboxEvent.response) {
          return Response.sendJsonObjectResponse(req, res, inboxEvent.response);
        }
        const leaseExpired: boolean =
          inboxEvent.status === "PROCESSING" &&
          new Date(inboxEvent.lockedAt).getTime() <
            Date.now() - PROCESSING_LEASE_SECONDS * 1000;
        if (inboxEvent.status === "FAILED" || leaseExpired) {
          claimed = returnedRows(
            await dataSource.query(
              `UPDATE "CastIntegrationInbox"
             SET "status" = 'PROCESSING', "errorCode" = NULL,
                 "errorMessage" = NULL, "processedAt" = NULL,
                 "attemptCount" = "attemptCount" + 1,
                 "lockedAt" = now(), "updatedAt" = now()
             WHERE "_id" = $1
               AND "attemptCount" < "maxAttempts"
               AND (
                 "status" = 'FAILED'
                 OR ("status" = 'PROCESSING' AND "lockedAt" < now() - ($2 * interval '1 second'))
             )
             RETURNING "_id"`,
              [inboxEvent._id, PROCESSING_LEASE_SECONDS],
            ),
          );
        }
        if (claimed.length === 1) {
          // A failed delivery was atomically reclaimed for this signed retry.
        } else {
          throw new BadDataException(
            "Integration event is already being processed",
          );
        }
      }

      try {
        const response: IntegrationResponse = await this.processEvent(
          envelope,
          installation,
        );
        await dataSource.query(
          `UPDATE "CastIntegrationInbox" SET "status" = 'PROCESSED', "response" = $2::jsonb, "processedAt" = now(), "updatedAt" = now() WHERE "eventId" = $1`,
          [envelope.eventId, JSON.stringify(response)],
        );
        await dataSource.query(
          `UPDATE "CastIntegrationInstallation" SET "lastEventAt" = now(), "updatedAt" = now() WHERE "connectionId" = $1`,
          [envelope.connectionId],
        );
        return Response.sendJsonObjectResponse(req, res, response);
      } catch (error) {
        await dataSource.query(
          `UPDATE "CastIntegrationInbox" SET "status" = 'FAILED', "errorCode" = $2, "errorMessage" = $3, "processedAt" = now(), "updatedAt" = now() WHERE "eventId" = $1`,
          [
            envelope.eventId,
            "INTEGRATION_EVENT_PROCESSING_FAILED",
            error instanceof Error
              ? error.message.slice(0, 2000)
              : "Unknown processing error",
          ],
        );
        throw error;
      }
    } catch (error) {
      next(error);
    }
  }

  private async processEvent(
    envelope: IntegrationEnvelope,
    installation: InstallationRow,
  ): Promise<IntegrationResponse> {
    const baseResponse: IntegrationResponse = {
      capabilities: ["incidents", "monitors", "on-call", "telemetry"],
      remoteInstallationId: installation._id,
      remoteVersion: "1",
      status: "ACTIVE",
    };

    if (envelope.eventType === "CONNECTION_PROVISION_REQUESTED") {
      return baseResponse;
    }

    if (envelope.eventType === "CONNECTION_DELETE_REQUESTED") {
      await this.revokeInstallationAccess(installation._id);
      await this.deleteManagedProject(
        envelope.workspaceId,
        installation.serviceUserId,
      );
      await CastIntegrationAPI.getDataSource().query(
        `UPDATE "CastIntegrationInstallation"
         SET "status" = 'REVOKED', "updatedAt" = now()
         WHERE "connectionId" = $1 AND "castWorkspaceId" = $2`,
        [envelope.connectionId, envelope.workspaceId],
      );
      return { ...baseResponse, status: "DELETED" };
    }

    if (
      envelope.eventType === "CONNECTION_STATUS_CHANGED" ||
      envelope.eventType === "BINDING_STATUS_CHANGED"
    ) {
      return baseResponse;
    }

    const payload: Record<string, unknown> = envelope.payload;
    const isWorkspaceProject: boolean =
      payload["localResourceType"] === "WORKSPACE" &&
      payload["externalResourceType"] === "PROJECT" &&
      payload["localRecordId"] === envelope.workspaceId &&
      payload["relationshipRole"] === "DEFAULT";
    const externalResourceType: unknown = payload["externalResourceType"];
    const localObjectUniversalIdentifier: unknown =
      payload["localObjectUniversalIdentifier"];
    const isManagedRecord: boolean =
      payload["localResourceType"] === "RECORD" &&
      payload["relationshipRole"] === "PROJECTION" &&
      ((externalResourceType === "SERVICE" &&
        localObjectUniversalIdentifier ===
          "e6883b46-23cf-5c82-8e79-41e2e8436292") ||
        (externalResourceType === "INCIDENT" &&
          localObjectUniversalIdentifier ===
            "6c3bfcd8-3eba-5917-8571-b14d6a9322af"));

    if (!isWorkspaceProject && !isManagedRecord) {
      throw new BadDataException("Unsupported Operations resource binding");
    }

    if (envelope.eventType === "BINDING_DELETE_REQUESTED") {
      if (isManagedRecord) {
        await CastManagedResourceService.delete({
          bindingId: envelope.bindingId!,
          castWorkspaceId: envelope.workspaceId,
          installationId: installation._id,
          serviceUserId: installation.serviceUserId,
        });
      } else {
        await this.revokeInstallationAccess(installation._id);
        await this.deleteManagedProject(
          envelope.workspaceId,
          installation.serviceUserId,
        );
      }
      return { ...baseResponse, status: "DELETED" };
    }

    if (isManagedRecord) {
      const project: Project | null = await ProjectService.findOneBy({
        query: {
          _id: CastIntegrationAPI.requiredUuid(
            payload["externalScopeId"],
            "payload.externalScopeId",
          ),
          castWorkspaceId: new ObjectID(envelope.workspaceId),
        },
        select: { _id: true, castWorkspaceId: true },
        props: { isRoot: true },
      });
      if (!project?.id) {
        throw new BadDataException(
          "The managed Operations resource scope is not this Cast workspace project",
        );
      }
      const record: unknown = payload["record"];
      if (!record || typeof record !== "object" || Array.isArray(record)) {
        throw new BadDataException("payload.record must be an object");
      }
      const remoteId: string = await CastManagedResourceService.provision({
        bindingId: envelope.bindingId!,
        castWorkspaceId: envelope.workspaceId,
        externalResourceType: externalResourceType as "INCIDENT" | "SERVICE",
        installationId: installation._id,
        localObjectUniversalIdentifier:
          localObjectUniversalIdentifier as string,
        localRecordId: CastIntegrationAPI.requiredUuid(
          payload["localRecordId"],
          "payload.localRecordId",
        ),
        projectId: project.id.toString(),
        record: record as Record<string, unknown>,
        serviceUserId: installation.serviceUserId,
      });
      return {
        ...baseResponse,
        externalResourceId: remoteId,
        externalScopeId: project.id.toString(),
      };
    }

    const projectId: string = await this.findOrCreateProject(
      envelope.workspaceId,
      installation.serviceUserId,
      installation._id,
      CastIntegrationAPI.optionalDisplayName(payload["displayName"]),
    );
    return {
      ...baseResponse,
      externalResourceId: projectId,
      externalScopeId: projectId,
    };
  }

  private async findOrCreateProject(
    workspaceId: string,
    serviceUserId: string,
    installationId: string,
    displayName?: string,
  ): Promise<string> {
    const dataSource: DatabaseSource = CastIntegrationAPI.getDataSource();
    const runner: DatabaseQueryRunner = dataSource.createQueryRunner();
    await runner.connect();
    await runner.query(`SELECT pg_advisory_lock(hashtext($1))`, [workspaceId]);

    try {
      const existing: Project | null = await ProjectService.findOneBy({
        query: { castWorkspaceId: new ObjectID(workspaceId) },
        select: {
          _id: true,
          castWorkspaceId: true,
          requireSsoForLogin: true,
          requireSsoWithSsoProviderId: true,
        },
        props: { isRoot: true },
      });
      if (existing?.id) {
        if (
          existing.requireSsoForLogin !== true ||
          existing.requireSsoWithSsoProviderId?.toString() !== installationId
        ) {
          await ProjectService.updateOneById({
            id: existing.id,
            data: {
              requireSsoForLogin: true,
              requireSsoWithSsoProviderId: new ObjectID(installationId),
            },
            props: { isRoot: true },
          });
        }
        return existing.id.toString();
      }

      const project: Project = new Project();
      project.name = displayName
        ? `${displayName.slice(0, 72)} Operations ${workspaceId.slice(0, 8)}`
        : `Cast Workspace ${workspaceId.slice(0, 8)}`;
      project.castWorkspaceId = new ObjectID(workspaceId);
      /*
       * A Cast-managed project must only accept the short-lived, project-bound
       * SSO token minted by the matching Cast installation. Without this
       * project policy, a Cast-created Operations user could use a password
       * reset or an unrelated identity provider to retain access after Cast
       * membership was revoked.
       */
      project.requireSsoForLogin = true;
      project.requireSsoWithSsoProviderId = new ObjectID(installationId);
      const created: Project = await ProjectService.create({
        data: project,
        props: {
          isRoot: true,
          userId: new ObjectID(serviceUserId),
        },
      });

      if (!created.id) {
        throw new Error("Operations project creation returned no ID");
      }
      return created.id.toString();
    } finally {
      await runner.query(`SELECT pg_advisory_unlock(hashtext($1))`, [
        workspaceId,
      ]);
      await runner.release();
    }
  }

  private async revokeInstallationAccess(
    installationId: string,
  ): Promise<void> {
    const dataSource: DatabaseSource = CastIntegrationAPI.getDataSource();

    await dataSource.query(
      `UPDATE "UserSession"
       SET "isRevoked" = true, "revokedAt" = now(),
           "revokedReason" = 'Cast installation access was revoked',
           "updatedAt" = now()
       WHERE "isRevoked" = false
         AND "additionalInfo" ->> 'authSource' = 'CAST_CONSOLE'
         AND "additionalInfo" ->> 'castInstallationId' = $1`,
      [installationId],
    );

    const memberships: Array<{ _id: string; teamMemberId: string }> =
      await dataSource.query(
        `SELECT "_id", "teamMemberId"
         FROM "CastIntegrationMembership"
         WHERE "installationId" = $1`,
        [installationId],
      );

    for (const membership of memberships) {
      await TeamMemberService.deleteOneById({
        id: new ObjectID(membership.teamMemberId),
        props: { isRoot: true },
      });
      await dataSource.query(
        `DELETE FROM "CastIntegrationMembership" WHERE "_id" = $1`,
        [membership._id],
      );
    }
  }

  private async deleteManagedProject(
    workspaceId: string,
    serviceUserId: string,
  ): Promise<void> {
    const dataSource: DatabaseSource = CastIntegrationAPI.getDataSource();
    const runner: DatabaseQueryRunner = dataSource.createQueryRunner();
    await runner.connect();
    await runner.query(`SELECT pg_advisory_lock(hashtext($1))`, [workspaceId]);

    try {
      const existing: Project | null = await ProjectService.findOneBy({
        query: { castWorkspaceId: new ObjectID(workspaceId) },
        select: { _id: true, castWorkspaceId: true },
        props: { isRoot: true },
      });

      if (!existing?.id) {
        return;
      }

      await ProjectService.deleteOneById({
        id: existing.id,
        props: {
          isRoot: true,
          userId: new ObjectID(serviceUserId),
        },
      });
    } finally {
      await runner.query(`SELECT pg_advisory_unlock(hashtext($1))`, [
        workspaceId,
      ]);
      await runner.release();
    }
  }

  public static parseEnvelope(req: ExpressRequest): IntegrationEnvelope {
    const rawBody: string = (req as OperationsRequest).rawBody || "";
    if (rawBody.length === 0) {
      throw new BadDataException("Integration event raw body is required");
    }
    if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
      throw new BadDataException("Integration event exceeds 1 MiB");
    }
    const body: Record<string, unknown> = (req.body || {}) as Record<
      string,
      unknown
    >;
    const eventId: string = this.requiredUuid(body["eventId"], "eventId");
    const connectionId: string = this.requiredUuid(
      body["connectionId"],
      "connectionId",
    );
    const workspaceId: string = this.requiredUuid(
      body["workspaceId"],
      "workspaceId",
    );
    const eventType: string = this.requiredString(
      body["eventType"],
      "eventType",
      1,
      100,
    );
    if (!SUPPORTED_EVENT_TYPES.has(eventType)) {
      throw new BadDataException("Unsupported integration event type");
    }
    if (body["schemaVersion"] !== 1) {
      throw new BadDataException("Unsupported integration schema version");
    }
    const aggregate: Record<string, unknown> = (body["aggregate"] ||
      {}) as Record<string, unknown>;
    if (
      !Number.isInteger(aggregate["version"]) ||
      (aggregate["version"] as number) < 1
    ) {
      throw new BadDataException("Invalid aggregate version");
    }
    const headerEventId: string = this.requiredHeader(req, "x-cast-event-id");
    const headerIdempotencyKey: string = this.requiredHeader(
      req,
      "x-cast-idempotency-key",
    );
    const idempotencyKey: string = this.requiredString(
      body["idempotencyKey"],
      "idempotencyKey",
      1,
      255,
    );
    if (headerEventId !== eventId || headerIdempotencyKey !== idempotencyKey) {
      throw new NotAuthorizedException(
        "Integration identity headers do not match body",
      );
    }
    const occurredAt: string = this.requiredString(
      body["occurredAt"],
      "occurredAt",
      1,
      100,
    );
    if (!Number.isFinite(Date.parse(occurredAt))) {
      throw new BadDataException("occurredAt must be an ISO timestamp");
    }
    const bindingId: string | null =
      body["bindingId"] === null
        ? null
        : this.requiredUuid(body["bindingId"], "bindingId");
    const isBindingEvent: boolean = eventType.startsWith("BINDING_");
    if (isBindingEvent && bindingId === null) {
      throw new BadDataException("bindingId is required for binding events");
    }
    if (!isBindingEvent && bindingId !== null) {
      throw new BadDataException(
        "bindingId must be null for connection events",
      );
    }
    const aggregateId: string = this.requiredUuid(
      aggregate["id"],
      "aggregate.id",
    );
    const aggregateType: string = this.requiredString(
      aggregate["type"],
      "aggregate.type",
      1,
      100,
    );
    const expectedAggregateType: "BINDING" | "CONNECTION" = isBindingEvent
      ? "BINDING"
      : "CONNECTION";
    if (
      (isBindingEvent && aggregateId !== bindingId) ||
      (!isBindingEvent && aggregateId !== connectionId) ||
      aggregateType !== expectedAggregateType
    ) {
      throw new BadDataException(
        "Aggregate identity does not match the integration event",
      );
    }
    const payload: unknown = body["payload"];
    if (
      typeof payload !== "object" ||
      payload === null ||
      Array.isArray(payload)
    ) {
      throw new BadDataException("Integration payload must be an object");
    }
    return {
      aggregate: {
        id: aggregateId,
        type: aggregateType,
        version: aggregate["version"] as number,
      },
      bindingId,
      connectionId,
      eventId,
      eventType,
      idempotencyKey,
      occurredAt,
      payload: payload as Record<string, unknown>,
      schemaVersion: 1,
      workspaceId,
    };
  }

  public static async verifySignature(
    req: ExpressRequest,
    encryptedSecret: string,
  ): Promise<void> {
    const timestamp: string = this.requiredHeader(req, "x-cast-timestamp");
    const nonce: string = this.requiredHeader(req, "x-cast-nonce");
    const signature: string = this.requiredHeader(req, "x-cast-signature");
    const timestampMs: number = Date.parse(timestamp);
    if (
      !Number.isFinite(timestampMs) ||
      Math.abs(Date.now() - timestampMs) > SIGNATURE_TOLERANCE_MS
    ) {
      throw new NotAuthorizedException(
        "Integration signature timestamp is stale",
      );
    }
    if (!INTEGRATION_NONCE_PATTERN.test(nonce)) {
      throw new NotAuthorizedException("Invalid integration nonce");
    }
    const rawBody: string = (req as OperationsRequest).rawBody || "";
    const secret: string = await Encryption.decrypt(encryptedSecret);
    const expected: string = `sha256=${crypto
      .createHmac("sha256", secret)
      .update(`${timestamp}.${nonce}.${rawBody}`)
      .digest("hex")}`;
    const actualBuffer: Buffer = Buffer.from(signature, "utf8");
    const expectedBuffer: Buffer = Buffer.from(expected, "utf8");
    if (
      actualBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(
        new Uint8Array(actualBuffer),
        new Uint8Array(expectedBuffer),
      )
    ) {
      throw new NotAuthorizedException("Invalid integration signature");
    }
  }

  private static assertBootstrapAuthorization(req: ExpressRequest): void {
    if (!HasClusterKey) {
      throw new NotAuthorizedException(
        "Installation enrollment is disabled until CAST_OPERATIONS_SECRET is explicitly configured",
      );
    }
    const authorization: string = this.requiredHeader(req, "authorization");
    if (!authorization.startsWith("Bearer ")) {
      throw new NotAuthorizedException("Bearer authorization is required");
    }
    const actual: Buffer = Buffer.from(authorization.slice(7), "utf8");
    const expected: Buffer = Buffer.from(ClusterKey.toString(), "utf8");
    if (
      actual.length !== expected.length ||
      !crypto.timingSafeEqual(new Uint8Array(actual), new Uint8Array(expected))
    ) {
      throw new NotAuthorizedException(
        "Invalid installation enrollment credential",
      );
    }
  }

  private static getDataSource(): DatabaseSource {
    const dataSource: DatabaseSource | null =
      PostgresAppInstance.getDataSource();
    if (!dataSource) {
      throw new Error("Postgres is not connected");
    }
    return dataSource;
  }

  private static requiredHeader(req: ExpressRequest, name: string): string {
    const value: string | undefined = headerValueToString(req.headers[name]);
    if (!value) {
      throw new NotAuthorizedException(`${name} header is required`);
    }
    return value;
  }

  private static requiredUuid(value: unknown, label: string): string {
    if (typeof value !== "string" || !ObjectID.isValidUUID(value)) {
      throw new BadDataException(`${label} must be a UUID`);
    }
    return value;
  }

  private static requiredString(
    value: unknown,
    label: string,
    minLength: number,
    maxLength: number,
  ): string {
    if (
      typeof value !== "string" ||
      value.length < minLength ||
      value.length > maxLength
    ) {
      throw new BadDataException(`${label} has an invalid length`);
    }
    return value;
  }

  private static optionalDisplayName(value: unknown): string | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }
    if (typeof value !== "string") {
      throw new BadDataException("payload.displayName must be a string");
    }
    const normalized: string = value.trim();
    if (normalized.length === 0 || normalized.length > 255) {
      throw new BadDataException("payload.displayName has an invalid length");
    }
    return normalized;
  }
}
