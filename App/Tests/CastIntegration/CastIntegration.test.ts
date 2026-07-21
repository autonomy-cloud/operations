import CastIntegrationAPI, {
  IntegrationEnvelope,
} from "../../FeatureSet/CastIntegration/API/CastIntegration";
import Encryption from "Common/Server/Utils/Encryption";
import { ExpressRequest, OperationsRequest } from "Common/Server/Utils/Express";
import crypto from "crypto";
import { describe, expect, test } from "@jest/globals";

const CONNECTION_ID: string = "11111111-1111-4111-8111-111111111111";
const WORKSPACE_ID: string = "22222222-2222-4222-8222-222222222222";
const EVENT_ID: string = "33333333-3333-4333-8333-333333333333";
const BINDING_ID: string = "44444444-4444-4444-8444-444444444444";

function requestFor(body: Record<string, unknown>): ExpressRequest {
  const rawBody: string = JSON.stringify(body);
  return {
    body,
    headers: {
      "x-cast-event-id": body["eventId"],
      "x-cast-idempotency-key": body["idempotencyKey"],
    },
    rawBody,
  } as unknown as ExpressRequest & OperationsRequest;
}

function connectionEnvelope(): Record<string, unknown> {
  return {
    aggregate: { id: CONNECTION_ID, type: "CONNECTION", version: 1 },
    bindingId: null,
    connectionId: CONNECTION_ID,
    eventId: EVENT_ID,
    eventType: "CONNECTION_PROVISION_REQUESTED",
    idempotencyKey: `${EVENT_ID}:1`,
    occurredAt: new Date().toISOString(),
    payload: {},
    schemaVersion: 1,
    workspaceId: WORKSPACE_ID,
  };
}

describe("CastIntegrationAPI integration event validation", () => {
  test("accepts a valid connection provisioning envelope", () => {
    const envelope: IntegrationEnvelope = CastIntegrationAPI.parseEnvelope(
      requestFor(connectionEnvelope()),
    );

    expect(envelope.connectionId).toBe(CONNECTION_ID);
    expect(envelope.bindingId).toBeNull();
  });

  test("accepts a connection teardown envelope without a binding identity", () => {
    const envelope: IntegrationEnvelope = CastIntegrationAPI.parseEnvelope(
      requestFor({
        ...connectionEnvelope(),
        eventType: "CONNECTION_DELETE_REQUESTED",
      }),
    );

    expect(envelope.eventType).toBe("CONNECTION_DELETE_REQUESTED");
    expect(envelope.bindingId).toBeNull();
  });

  test("requires a binding identity for binding events", () => {
    const body: Record<string, unknown> = {
      ...connectionEnvelope(),
      aggregate: { id: CONNECTION_ID, type: "BINDING", version: 1 },
      eventType: "BINDING_PROVISION_REQUESTED",
    };

    expect(() => {
      return CastIntegrationAPI.parseEnvelope(requestFor(body));
    }).toThrow("bindingId is required");
  });

  test("rejects an aggregate identity that differs from the binding", () => {
    const body: Record<string, unknown> = {
      ...connectionEnvelope(),
      aggregate: { id: CONNECTION_ID, type: "BINDING", version: 1 },
      bindingId: BINDING_ID,
      eventType: "BINDING_PROVISION_REQUESTED",
    };

    expect(() => {
      return CastIntegrationAPI.parseEnvelope(requestFor(body));
    }).toThrow("Aggregate identity does not match");
  });

  test("rejects an aggregate type that differs from the event scope", () => {
    const body: Record<string, unknown> = {
      ...connectionEnvelope(),
      aggregate: { id: CONNECTION_ID, type: "BINDING", version: 1 },
    };

    expect(() => {
      return CastIntegrationAPI.parseEnvelope(requestFor(body));
    }).toThrow("Aggregate identity does not match");
  });

  test("rejects a non-object payload", () => {
    const body: Record<string, unknown> = {
      ...connectionEnvelope(),
      payload: "not-an-object",
    };

    expect(() => {
      return CastIntegrationAPI.parseEnvelope(requestFor(body));
    }).toThrow("Integration payload must be an object");
  });

  test("rejects a request when the exact raw body is unavailable", () => {
    const request: OperationsRequest = requestFor(
      connectionEnvelope(),
    ) as OperationsRequest;
    request.rawBody = "";

    expect(() => {
      return CastIntegrationAPI.parseEnvelope(request as ExpressRequest);
    }).toThrow("raw body is required");
  });
});

describe("CastIntegrationAPI request signatures", () => {
  test("accepts an HMAC over timestamp, nonce, and the exact raw body", async () => {
    const request: OperationsRequest = requestFor(
      connectionEnvelope(),
    ) as OperationsRequest;
    const timestamp: string = new Date().toISOString();
    const nonce: string = "55555555-5555-4555-8555-555555555555";
    const secret: string = "a-production-length-shared-secret-value";
    request.headers["x-cast-timestamp"] = timestamp;
    request.headers["x-cast-nonce"] = nonce;
    request.headers["x-cast-signature"] = `sha256=${crypto
      .createHmac("sha256", secret)
      .update(`${timestamp}.${nonce}.${request.rawBody}`)
      .digest("hex")}`;

    await expect(
      CastIntegrationAPI.verifySignature(
        request as ExpressRequest,
        await Encryption.encrypt(secret),
      ),
    ).resolves.toBeUndefined();
  });

  test("rejects a signature after any body mutation", async () => {
    const request: OperationsRequest = requestFor(
      connectionEnvelope(),
    ) as OperationsRequest;
    const timestamp: string = new Date().toISOString();
    const nonce: string = "55555555-5555-4555-8555-555555555555";
    const secret: string = "a-production-length-shared-secret-value";
    request.headers["x-cast-timestamp"] = timestamp;
    request.headers["x-cast-nonce"] = nonce;
    request.headers["x-cast-signature"] = `sha256=${crypto
      .createHmac("sha256", secret)
      .update(`${timestamp}.${nonce}.${request.rawBody}`)
      .digest("hex")}`;
    request.rawBody = `${request.rawBody} `;

    await expect(
      CastIntegrationAPI.verifySignature(
        request as ExpressRequest,
        await Encryption.encrypt(secret),
      ),
    ).rejects.toThrow("Invalid integration signature");
  });
});
