import OIDCUtil, {
  OidcCallbackResult,
} from "../../FeatureSet/Identity/Utils/OIDC";
import URL from "Common/Types/API/URL";
import { describe, expect, jest, test } from "@jest/globals";
import type { Mock } from "jest-mock";
import type { Client, TokenSet } from "openid-client";

function tokenSetWithClaims(claims: Record<string, unknown>): TokenSet {
  return {
    claims: () => {
      return claims;
    },
    access_token: "test-access-token",
  } as unknown as TokenSet;
}

describe("OIDCUtil.exchangeCodeAndValidate", () => {
  test("returns immutable issuer and subject from validated claims", async () => {
    const callback: Mock<() => Promise<TokenSet>> = jest.fn(async () => {
      return tokenSetWithClaims({
        iss: "https://identity.cast.example",
        sub: "user-immutable-123",
        email: "operator@example.com",
        email_verified: true,
        name: "Operator",
      });
    });

    const result: OidcCallbackResult = await OIDCUtil.exchangeCodeAndValidate({
      client: { callback } as unknown as Client,
      redirectUri: URL.fromString("https://operations.example/callback"),
      expectedIssuer: "https://identity.cast.example",
      expectedNonce: "nonce",
      expectedState: "state",
      codeVerifier: "verifier",
      callbackParams: { code: "code", state: "state" },
      emailClaimName: "email",
      nameClaimName: "name",
    });

    expect(result.issuer).toBe("https://identity.cast.example");
    expect(result.subject).toBe("user-immutable-123");
    expect(result.email.toString()).toBe("operator@example.com");
    expect(result.emailVerified).toBe(true);
  });

  test("rejects a token without a subject", async () => {
    const callback: Mock<() => Promise<TokenSet>> = jest.fn(async () => {
      return tokenSetWithClaims({
        iss: "https://identity.cast.example",
        email: "operator@example.com",
      });
    });

    await expect(
      OIDCUtil.exchangeCodeAndValidate({
        client: { callback } as unknown as Client,
        redirectUri: URL.fromString("https://operations.example/callback"),
        expectedIssuer: "https://identity.cast.example",
        expectedNonce: "nonce",
        expectedState: "state",
        codeVerifier: "verifier",
        callbackParams: { code: "code", state: "state" },
        emailClaimName: "email",
        nameClaimName: "name",
      }),
    ).rejects.toThrow("usable 'sub' claim");
  });
});
