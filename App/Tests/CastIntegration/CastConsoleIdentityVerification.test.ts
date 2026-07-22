import CastConsoleIdentityService, {
  CastInstallationIdentityConfig,
} from "../../FeatureSet/CastIntegration/Services/CastConsoleIdentity";
import Redis from "Common/Server/Infrastructure/Redis";
import NotAuthorizedException from "Common/Types/Exception/NotAuthorizedException";
import axios from "axios";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { afterEach, describe, expect, jest, test } from "@jest/globals";
import type { Mock } from "jest-mock";

const OPERATIONS_AUDIENCE: string = "cfbee3be-a307-4e55-be94-bd3ab0bc8e6f";
const WORKSPACE_ID: string = "11111111-1111-4111-8111-111111111111";
const USER_ID: string = "22222222-2222-4222-8222-222222222222";
const INSTALLATION_ID: string = "33333333-3333-4333-8333-333333333333";

const PUBLIC_JWK: crypto.JsonWebKey = {
  crv: "P-256",
  kty: "EC",
  x: "eCCBVqyIWvBA_Rwrgfe691o44R00e4LHqmY0j7mPux0",
  y: "B48FRT6E4twW-WkytV_Z_AKk53Jp4_8eYM0dwLRlzZI",
};
const PRIVATE_KEY_PEM: string = `-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgfLwrDsOzO87Cidnk
hcYnb9+YzIqfhvlC6Cqwqt1NTTGhRANCAAR4IIFWrIha8ED9HCuB97r3WjjhHTR7
gseqZjSPuY+7HQePBUU+hOLcFvlpMrVf2fwCpOdyaeP/HmDNHcC0Zc2S
-----END PRIVATE KEY-----`;

type RedisSet = (
  key: string,
  value: string,
  expiryMode: string,
  ttl: number,
  setMode: string,
) => Promise<string | null>;

function installation(issuer: string): CastInstallationIdentityConfig {
  return {
    _id: INSTALLATION_ID,
    allowAccountLinkingByVerifiedEmail: false,
    appAudience: OPERATIONS_AUDIENCE,
    castIssuer: issuer,
    castWorkspaceId: WORKSPACE_ID,
  };
}

function token(data?: {
  audience?: string;
  issuer?: string;
  jti?: string;
  keyId?: string;
  workspaceId?: string;
}): string {
  const issuer: string = data?.issuer || "https://cast.example.test";
  return jwt.sign(
    {
      appUniversalIdentifier: OPERATIONS_AUDIENCE,
      email: "operator@example.test",
      emailVerified: true,
      firstName: "Cast",
      isWorkspaceAdmin: false,
      lastName: "Operator",
      type: "CONSOLE_IDENTITY",
      userId: USER_ID,
      workspaceId: data?.workspaceId || WORKSPACE_ID,
    },
    PRIVATE_KEY_PEM,
    {
      algorithm: "ES256",
      audience: data?.audience || OPERATIONS_AUDIENCE,
      expiresIn: "15m",
      issuer,
      jwtid: data?.jti || crypto.randomUUID(),
      keyid: data?.keyId || "cast-signing-key",
      subject: USER_ID,
    },
  );
}

function mockTrustInfrastructure(replayResult: string | null = "OK"): {
  redisSet: Mock<RedisSet>;
} {
  jest.spyOn(axios, "get").mockResolvedValue({
    data: {
      keys: [
        {
          ...PUBLIC_JWK,
          alg: "ES256",
          kid: "cast-signing-key",
          use: "sig",
        },
      ],
    },
  });
  const redisSet: Mock<RedisSet> = jest
    .fn<RedisSet>()
    .mockResolvedValue(replayResult);
  jest.spyOn(Redis, "getClient").mockReturnValue({
    set: redisSet,
  } as unknown as ReturnType<typeof Redis.getClient>);
  return { redisSet };
}

describe("Cast Console Operations identity verification", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env["CAST_INTEGRATION_ALLOW_INSECURE_LOCALHOST"];
  });

  test("accepts a signed, audience-bound identity and consumes its JTI once", async () => {
    const issuer: string = "https://cast-valid.example.test";
    const { redisSet } = mockTrustInfrastructure();

    await expect(
      CastConsoleIdentityService.verifyToken({
        installation: installation(issuer),
        token: token({ issuer, jti: "44444444-4444-4444-8444-444444444444" }),
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        appUniversalIdentifier: OPERATIONS_AUDIENCE,
        issuer,
        subject: USER_ID,
        workspaceId: WORKSPACE_ID,
      }),
    );
    expect(axios.get).toHaveBeenCalledWith(
      `${issuer}/console-identity/jwks.json`,
      expect.objectContaining({ maxRedirects: 0, timeout: 5_000 }),
    );
    expect(redisSet).toHaveBeenCalledWith(
      `cast:console-identity:jti:${INSTALLATION_ID}:44444444-4444-4444-8444-444444444444`,
      USER_ID,
      "EX",
      20 * 60,
      "NX",
    );
  });

  test("rejects a token issued for another application", async () => {
    const issuer: string = "https://cast-audience.example.test";
    mockTrustInfrastructure();

    await expect(
      CastConsoleIdentityService.verifyToken({
        installation: installation(issuer),
        token: token({ audience: "another-application", issuer }),
      }),
    ).rejects.toBeInstanceOf(NotAuthorizedException);
  });

  test("rejects a token bound to another Cast workspace", async () => {
    const issuer: string = "https://cast-workspace.example.test";
    mockTrustInfrastructure();

    await expect(
      CastConsoleIdentityService.verifyToken({
        installation: installation(issuer),
        token: token({
          issuer,
          workspaceId: "55555555-5555-4555-8555-555555555555",
        }),
      }),
    ).rejects.toBeInstanceOf(NotAuthorizedException);
  });

  test("rejects replay when Redis reports that the JTI already exists", async () => {
    const issuer: string = "https://cast-replay.example.test";
    mockTrustInfrastructure(null);

    await expect(
      CastConsoleIdentityService.verifyToken({
        installation: installation(issuer),
        token: token({ issuer }),
      }),
    ).rejects.toThrow("already been exchanged");
  });

  test("requires HTTPS except for an explicitly enabled local loopback", () => {
    expect(() => {
      return CastConsoleIdentityService.normalizeIssuer(
        "http://cast.example.test",
      );
    }).toThrow("castIssuer must use HTTPS");
    expect(() => {
      return CastConsoleIdentityService.normalizeIssuer(
        "https://cast.example.test/path",
      );
    }).toThrow("origin without credentials or a path");

    process.env["CAST_INTEGRATION_ALLOW_INSECURE_LOCALHOST"] = "true";
    expect(
      CastConsoleIdentityService.normalizeIssuer("http://localhost:3000"),
    ).toBe("http://localhost:3000");
  });
});
