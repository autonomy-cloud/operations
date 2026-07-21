import User from "Common/Models/DatabaseModels/User";
import UserOidcIdentity from "Common/Models/DatabaseModels/UserOidcIdentity";
import TeamMember from "Common/Models/DatabaseModels/TeamMember";
import Team from "Common/Models/DatabaseModels/Team";
import PostgresAppInstance, {
  DatabaseQueryRunner,
  DatabaseSource,
} from "Common/Server/Infrastructure/PostgresDatabase";
import Redis from "Common/Server/Infrastructure/Redis";
import AccessTokenService from "Common/Server/Services/AccessTokenService";
import TeamMemberService from "Common/Server/Services/TeamMemberService";
import TeamService from "Common/Server/Services/TeamService";
import UserOidcIdentityService from "Common/Server/Services/UserOidcIdentityService";
import UserService from "Common/Server/Services/UserService";
import OperationsDate from "Common/Types/Date";
import Email from "Common/Types/Email";
import BadDataException from "Common/Types/Exception/BadDataException";
import NotAuthorizedException from "Common/Types/Exception/NotAuthorizedException";
import Name from "Common/Types/Name";
import ObjectID from "Common/Types/ObjectID";
import axios, { AxiosResponse } from "axios";
import crypto from "crypto";
import jwt, { Jwt, JwtHeader, JwtPayload } from "jsonwebtoken";

const OPERATIONS_APP_AUDIENCE: string = "cfbee3be-a307-4e55-be94-bd3ab0bc8e6f";
const TOKEN_REPLAY_TTL_SECONDS: number = 20 * 60;
const JWKS_CACHE_TTL_MS: number = 5 * 60 * 1000;

export type CastInstallationIdentityConfig = {
  _id: string;
  allowAccountLinkingByVerifiedEmail: boolean;
  appAudience: string;
  castIssuer: string;
  castWorkspaceId: string;
};

export type ValidatedCastIdentity = {
  appUniversalIdentifier: string;
  email: Email;
  emailVerified: boolean;
  firstName: string;
  isWorkspaceAdmin: boolean;
  issuer: string;
  jti: string;
  lastName: string;
  subject: string;
  workspaceId: string;
};

type CachedJwks = {
  expiresAt: number;
  keys: Array<Record<string, unknown>>;
};

type CastManagedMembershipRow = {
  _id: string;
  role: string;
  teamMemberId: string;
};

type ProjectTeamMember = {
  id: ObjectID;
  teamId: ObjectID;
};

export default class CastConsoleIdentityService {
  private static readonly jwksCache: Map<string, CachedJwks> = new Map();

  public static normalizeIssuer(value: unknown): string {
    if (typeof value !== "string" || value.length > 2048) {
      throw new BadDataException("castIssuer must be a valid URL origin");
    }

    let issuer: globalThis.URL;
    try {
      issuer = new globalThis.URL(value);
    } catch {
      throw new BadDataException("castIssuer must be a valid URL origin");
    }

    const isLocalDevelopmentHost: boolean =
      issuer.hostname === "localhost" ||
      issuer.hostname === "127.0.0.1" ||
      issuer.hostname.endsWith(".localhost");
    const allowsInsecureLoopback: boolean =
      process.env["CAST_INTEGRATION_ALLOW_INSECURE_LOCALHOST"] === "true" &&
      issuer.protocol === "http:" &&
      isLocalDevelopmentHost;

    if (issuer.protocol !== "https:" && !allowsInsecureLoopback) {
      throw new BadDataException("castIssuer must use HTTPS");
    }
    if (
      issuer.username ||
      issuer.password ||
      issuer.search ||
      issuer.hash ||
      (issuer.pathname !== "/" && issuer.pathname !== "")
    ) {
      throw new BadDataException(
        "castIssuer must be an origin without credentials or a path",
      );
    }

    return issuer.origin;
  }

  public static assertOperationsAudience(value: unknown): string {
    if (value !== OPERATIONS_APP_AUDIENCE) {
      throw new BadDataException(
        "appAudience is not the Cast Operations application",
      );
    }
    return value;
  }

  public static async verifyToken(data: {
    installation: CastInstallationIdentityConfig;
    token: string;
  }): Promise<ValidatedCastIdentity> {
    if (!data.token || data.token.length > 32_768) {
      throw new NotAuthorizedException(
        "Cast identity token is missing or too large",
      );
    }

    const decoded: Jwt | null = jwt.decode(data.token, { complete: true });
    if (!decoded) {
      throw new NotAuthorizedException("Cast identity token is malformed");
    }
    const header: JwtHeader = decoded.header;
    const untrustedPayload: JwtPayload = decoded.payload as JwtPayload;
    if (header.alg !== "ES256" || typeof header.kid !== "string") {
      throw new NotAuthorizedException(
        "Cast identity token uses an unsupported signing key",
      );
    }

    const keys: Array<Record<string, unknown>> = await this.getJwks(
      data.installation.castIssuer,
    );
    const jwk: Record<string, unknown> | undefined = keys.find(
      (candidate: Record<string, unknown>) => {
        return (
          candidate["kid"] === header.kid &&
          candidate["alg"] === "ES256" &&
          candidate["use"] === "sig"
        );
      },
    );
    if (!jwk) {
      this.jwksCache.delete(data.installation.castIssuer);
      const refreshed: Array<Record<string, unknown>> = await this.getJwks(
        data.installation.castIssuer,
      );
      const refreshedJwk: Record<string, unknown> | undefined = refreshed.find(
        (candidate: Record<string, unknown>) => {
          return (
            candidate["kid"] === header.kid &&
            candidate["alg"] === "ES256" &&
            candidate["use"] === "sig"
          );
        },
      );
      if (!refreshedJwk) {
        throw new NotAuthorizedException(
          "Cast identity signing key is unknown",
        );
      }
      return this.verifyWithJwk(data, refreshedJwk);
    }

    if (
      untrustedPayload.iss !== data.installation.castIssuer ||
      untrustedPayload.aud !== data.installation.appAudience
    ) {
      throw new NotAuthorizedException(
        "Cast identity issuer or audience is invalid",
      );
    }
    return this.verifyWithJwk(data, jwk);
  }

  private static async verifyWithJwk(
    data: { installation: CastInstallationIdentityConfig; token: string },
    jwk: Record<string, unknown>,
  ): Promise<ValidatedCastIdentity> {
    let publicKey: string;
    try {
      publicKey = crypto
        .createPublicKey({
          key: jwk as crypto.JsonWebKey,
          format: "jwk",
        })
        .export({ format: "pem", type: "spki" })
        .toString();
    } catch {
      throw new NotAuthorizedException("Cast identity signing key is invalid");
    }

    let payload: JwtPayload;
    try {
      payload = jwt.verify(data.token, publicKey, {
        algorithms: ["ES256"],
        audience: data.installation.appAudience,
        issuer: data.installation.castIssuer,
        clockTolerance: 30,
      }) as JwtPayload;
    } catch {
      throw new NotAuthorizedException(
        "Cast identity token signature is invalid",
      );
    }

    const requiredString: (name: string) => string = (name: string): string => {
      const value: unknown = payload[name];
      if (
        typeof value !== "string" ||
        value.length === 0 ||
        value.length > 2048
      ) {
        throw new NotAuthorizedException(
          `Cast identity ${name} claim is invalid`,
        );
      }
      return value;
    };

    const workspaceId: string = requiredString("workspaceId");
    const subject: string = requiredString("sub");
    const jti: string = requiredString("jti");
    const email: Email = new Email(requiredString("email"));
    const appUniversalIdentifier: string = requiredString(
      "appUniversalIdentifier",
    );
    if (
      payload["type"] !== "CONSOLE_IDENTITY" ||
      workspaceId !== data.installation.castWorkspaceId ||
      appUniversalIdentifier !== data.installation.appAudience ||
      payload["userId"] !== subject ||
      typeof payload["emailVerified"] !== "boolean" ||
      typeof payload["isWorkspaceAdmin"] !== "boolean"
    ) {
      throw new NotAuthorizedException(
        "Cast identity claims do not match the installation",
      );
    }

    const redisClient: ReturnType<typeof Redis.getClient> = Redis.getClient();
    if (!redisClient) {
      throw new Error(
        "Redis is unavailable; Cast identity replay protection is fail-closed",
      );
    }
    const replayResult: string | null = await redisClient.set(
      `cast:console-identity:jti:${data.installation._id}:${jti}`,
      subject,
      "EX",
      TOKEN_REPLAY_TTL_SECONDS,
      "NX",
    );
    if (replayResult !== "OK") {
      throw new NotAuthorizedException(
        "Cast identity token has already been exchanged",
      );
    }

    return {
      appUniversalIdentifier,
      email,
      emailVerified: payload["emailVerified"],
      firstName:
        typeof payload["firstName"] === "string" ? payload["firstName"] : "",
      isWorkspaceAdmin: payload["isWorkspaceAdmin"],
      issuer: data.installation.castIssuer,
      jti,
      lastName:
        typeof payload["lastName"] === "string" ? payload["lastName"] : "",
      subject,
      workspaceId,
    };
  }

  private static async getJwks(
    issuer: string,
  ): Promise<Array<Record<string, unknown>>> {
    const cached: CachedJwks | undefined = this.jwksCache.get(issuer);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.keys;
    }

    const response: AxiosResponse<unknown> = await axios.get<unknown>(
      `${issuer}/console-identity/jwks.json`,
      {
        maxBodyLength: 256 * 1024,
        maxContentLength: 256 * 1024,
        maxRedirects: 0,
        timeout: 5_000,
        validateStatus: (status: number) => {
          return status === 200;
        },
      },
    );
    const body: unknown = response.data;
    if (
      !body ||
      typeof body !== "object" ||
      !Array.isArray((body as { keys?: unknown }).keys) ||
      (body as { keys: unknown[] }).keys.length > 20
    ) {
      throw new NotAuthorizedException("Cast JWKS response is invalid");
    }
    const keys: Array<Record<string, unknown>> = (
      body as { keys: unknown[] }
    ).keys.filter((key: unknown): key is Record<string, unknown> => {
      return Boolean(key) && typeof key === "object" && !Array.isArray(key);
    });
    this.jwksCache.set(issuer, {
      expiresAt: Date.now() + JWKS_CACHE_TTL_MS,
      keys,
    });
    return keys;
  }

  public static async resolveUser(data: {
    identity: ValidatedCastIdentity;
    installation: CastInstallationIdentityConfig;
  }): Promise<User> {
    const existingIdentity: UserOidcIdentity | null =
      await UserOidcIdentityService.findOneBy({
        query: {
          issuer: data.identity.issuer,
          subject: data.identity.subject,
        },
        select: { userId: true },
        props: { isRoot: true },
      });

    let user: User | null = null;
    if (existingIdentity?.userId) {
      user = await this.findLoginUser({ _id: existingIdentity.userId });
      if (!user) {
        throw new NotAuthorizedException(
          "Cast identity is linked to an unavailable account",
        );
      }
      return user;
    }

    if (!data.identity.emailVerified) {
      throw new NotAuthorizedException(
        "A verified Cast email is required for first login",
      );
    }
    const conflictingUser: User | null = await this.findLoginUser({
      email: data.identity.email,
    });
    if (conflictingUser) {
      if (
        !data.installation.allowAccountLinkingByVerifiedEmail ||
        !conflictingUser.isEmailVerified
      ) {
        throw new NotAuthorizedException(
          "An Operations account with this email exists but automatic linking is disabled",
        );
      }
      user = conflictingUser;
    } else {
      const displayName: string =
        `${data.identity.firstName} ${data.identity.lastName}`.trim() ||
        data.identity.email.toString();
      user = await UserService.createByEmail({
        email: data.identity.email,
        name: new Name(displayName),
        isEmailVerified: true,
        generateRandomPassword: true,
        props: { isRoot: true },
      });
    }

    const identity: UserOidcIdentity = new UserOidcIdentity();
    identity.userId = user.id!;
    identity.issuer = data.identity.issuer;
    identity.subject = data.identity.subject;
    identity.providerType = "CAST_CONSOLE";
    identity.providerId = new ObjectID(data.installation.appAudience);
    await UserOidcIdentityService.create({
      data: identity,
      props: { isRoot: true },
    });
    return user;
  }

  private static async findLoginUser(query: {
    _id?: ObjectID;
    email?: Email;
  }): Promise<User | null> {
    return await UserService.findOneBy({
      query,
      select: {
        _id: true,
        email: true,
        isEmailVerified: true,
        isMasterAdmin: true,
        name: true,
        timezone: true,
      },
      props: { isRoot: true },
    });
  }

  public static async ensureProjectMembership(data: {
    installationId: string;
    isWorkspaceAdmin: boolean;
    projectId: ObjectID;
    userId: ObjectID;
  }): Promise<void> {
    const dataSource: DatabaseSource | null =
      PostgresAppInstance.getDataSource();
    if (!dataSource) {
      throw new Error("Postgres is not connected");
    }

    const lockKey: string = [
      "cast-membership",
      data.installationId,
      data.projectId.toString(),
      data.userId.toString(),
    ].join(":");
    const runner: DatabaseQueryRunner = dataSource.createQueryRunner();
    await runner.connect();
    await runner.query(`SELECT pg_advisory_lock(hashtext($1))`, [lockKey]);

    try {
      const targetTeamName: string = data.isWorkspaceAdmin
        ? "Owners"
        : "Members";
      const targetRole: string = data.isWorkspaceAdmin ? "OWNER" : "MEMBER";
      const team: Team | null = await TeamService.findOneBy({
        query: { name: targetTeamName, projectId: data.projectId },
        select: { _id: true },
        props: { isRoot: true },
      });
      if (!team?.id) {
        throw new Error(`Operations ${targetTeamName} team is unavailable`);
      }

      const managedRows: CastManagedMembershipRow[] = await dataSource.query(
        `SELECT "_id", "role", "teamMemberId"
         FROM "CastIntegrationMembership"
         WHERE "installationId" = $1 AND "projectId" = $2 AND "userId" = $3
         LIMIT 1`,
        [
          data.installationId,
          data.projectId.toString(),
          data.userId.toString(),
        ],
      );
      const managed: CastManagedMembershipRow | undefined = managedRows[0];

      const existingMemberships: Array<TeamMember> =
        await TeamMemberService.findBy({
          query: {
            projectId: data.projectId,
            userId: data.userId,
          },
          select: { _id: true, teamId: true },
          limit: 100,
          skip: 0,
          props: { isRoot: true },
        });
      const projectTeamMembers: Array<ProjectTeamMember> =
        existingMemberships.flatMap((membership: TeamMember) => {
          return membership.id && membership.teamId
            ? [{ id: membership.id, teamId: membership.teamId }]
            : [];
        });
      let targetMember: ProjectTeamMember | undefined =
        projectTeamMembers.find((membership: ProjectTeamMember) => {
          return (
            managed?.role === targetRole &&
            membership.id.toString() === managed.teamMemberId &&
            membership.teamId.toString() === team.id!.toString()
          );
        }) ||
        projectTeamMembers.find((membership: ProjectTeamMember) => {
          return membership.teamId.toString() === team.id!.toString();
        });

      for (const membership of projectTeamMembers) {
        if (membership.id.toString() === targetMember?.id.toString()) {
          continue;
        }
        await TeamMemberService.deleteOneById({
          id: membership.id,
          props: { isRoot: true },
        });
      }

      const managedMatchesTarget: boolean = Boolean(
        managed &&
          targetMember &&
          managed.role === targetRole &&
          managed.teamMemberId === targetMember.id.toString(),
      );
      if (managed && !managedMatchesTarget) {
        await dataSource.query(
          `DELETE FROM "CastIntegrationMembership" WHERE "_id" = $1`,
          [managed._id],
        );
      }

      if (!targetMember) {
        const teamMember: TeamMember = new TeamMember();
        teamMember.projectId = data.projectId;
        teamMember.userId = data.userId;
        teamMember.teamId = team.id;
        teamMember.hasAcceptedInvitation = true;
        teamMember.invitationAcceptedAt = OperationsDate.getCurrentDate();
        const created: TeamMember = await TeamMemberService.create({
          data: teamMember,
          props: { isRoot: true, ignoreHooks: true },
        });
        if (!created.id) {
          throw new Error("Cast-managed Operations membership has no ID");
        }
        targetMember = { id: created.id, teamId: team.id };
      }

      if (!managedMatchesTarget) {
        await dataSource.query(
          `INSERT INTO "CastIntegrationMembership"
            ("installationId", "projectId", "userId", "teamMemberId", "role")
           VALUES ($1, $2, $3, $4, $5)`,
          [
            data.installationId,
            data.projectId.toString(),
            data.userId.toString(),
            targetMember.id.toString(),
            targetRole,
          ],
        );
      }

      await AccessTokenService.refreshUserAllPermissions(data.userId);
    } finally {
      await runner.query(`SELECT pg_advisory_unlock(hashtext($1))`, [lockKey]);
      await runner.release();
    }
  }
}
