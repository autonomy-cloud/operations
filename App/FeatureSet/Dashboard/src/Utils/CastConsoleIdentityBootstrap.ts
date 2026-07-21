const OPERATIONS_APP_AUDIENCE: string = "cfbee3be-a307-4e55-be94-bd3ab0bc8e6f";
const REQUEST_TYPE: string = "cast:request-console-identity";
const RESPONSE_TYPE: string = "cast:console-identity";
const HANDSHAKE_TIMEOUT_MS: number = 10_000;

type ConsoleIdentityResponse = {
  app: string;
  expiresAt: string;
  token: string;
  type: string;
};

type IdentityResponseGuard = (
  value: unknown,
) => value is ConsoleIdentityResponse;

type ResolveIdentityToken = (value: string | PromiseLike<string>) => void;
type RejectIdentityToken = (reason?: unknown) => void;

export const getTrustedCastParentOrigin: () => string | null = ():
  | string
  | null => {
  if (window.parent === window || !document.referrer) {
    return null;
  }

  try {
    const referrer: URL = new URL(document.referrer);
    const isLocalDevelopmentHost: boolean =
      referrer.hostname === "localhost" ||
      referrer.hostname === "127.0.0.1" ||
      referrer.hostname.endsWith(".localhost");
    const allowsLocalDevelopment: boolean =
      referrer.protocol === "http:" && isLocalDevelopmentHost;

    if (referrer.protocol !== "https:" && !allowsLocalDevelopment) {
      return null;
    }
    return referrer.origin;
  } catch {
    return null;
  }
};

const isIdentityResponse: IdentityResponseGuard = (
  value: unknown,
): value is ConsoleIdentityResponse => {
  return Boolean(
    value &&
      typeof value === "object" &&
      (value as { type?: unknown }).type === RESPONSE_TYPE &&
      (value as { app?: unknown }).app === OPERATIONS_APP_AUDIENCE &&
      typeof (value as { token?: unknown }).token === "string" &&
      typeof (value as { expiresAt?: unknown }).expiresAt === "string",
  );
};

export const bootstrapCastConsoleIdentity: (
  parentOrigin: string,
) => Promise<void> = async (parentOrigin: string): Promise<void> => {
  const token: string = await new Promise<string>(
    (resolve: ResolveIdentityToken, reject: RejectIdentityToken): void => {
      const timeout: number = window.setTimeout(() => {
        window.removeEventListener("message", onMessage);
        reject(new Error("Cast identity handshake timed out"));
      }, HANDSHAKE_TIMEOUT_MS);

      const onMessage: (event: MessageEvent<unknown>) => void = (
        event: MessageEvent<unknown>,
      ): void => {
        if (
          event.source !== window.parent ||
          event.origin !== parentOrigin ||
          !isIdentityResponse(event.data)
        ) {
          return;
        }

        window.clearTimeout(timeout);
        window.removeEventListener("message", onMessage);
        resolve(event.data.token);
      };

      window.addEventListener("message", onMessage);
      window.parent.postMessage(
        {
          type: REQUEST_TYPE,
          app: OPERATIONS_APP_AUDIENCE,
        },
        parentOrigin,
      );
    },
  );

  const response: Response = await fetch("/api/cast/v1/session", {
    method: "POST",
    credentials: "include",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`Cast identity exchange failed (${response.status})`);
  }
};
