import BearerTokenAuthorization from "../../../Server/Middleware/BearerTokenAuthorization";
import {
  ExpressResponse,
  OperationsRequest,
} from "../../../Server/Utils/Express";
import JSONWebToken from "../../../Server/Utils/JsonWebToken";
import { describe, expect, it } from "@jest/globals";
import { JSONObject } from "../../../Types/JSON";
import getJestMockFunction, { MockFunction } from "../../../Tests/MockType";

describe("BearerTokenAuthorization", () => {
  describe("isAuthorizedBearerToken", () => {
    it("adds decoded token data to request", () => {
      const jsonObj: JSONObject = { test: "test" };
      const req: OperationsRequest = {
        headers: {
          authorization: `Bearer ${JSONWebToken.signJsonPayload(jsonObj, 5)}`,
        },
      } as OperationsRequest;
      const res: ExpressResponse = {} as ExpressResponse;
      const next: MockFunction = getJestMockFunction();
      void BearerTokenAuthorization.isAuthorizedBearerToken(req, res, next);
      const jsonObjResult: JSONObject = req.bearerTokenData as JSONObject;
      expect(jsonObjResult["test"]).toMatchInlineSnapshot(`"test"`);
    });
    it("calls next without arguments if token is valid", () => {
      const jsonObj: JSONObject = { test: "test" };
      const req: OperationsRequest = {
        headers: {
          authorization: `Bearer ${JSONWebToken.signJsonPayload(jsonObj, 5)}`,
        },
      } as OperationsRequest;
      const res: ExpressResponse = {} as ExpressResponse;
      const next: MockFunction = getJestMockFunction();
      void BearerTokenAuthorization.isAuthorizedBearerToken(req, res, next);
      expect(next.mock.calls[0][0]).toMatchInlineSnapshot(`undefined`);
    });
    it("calls next with exception if token is empty", () => {
      const req: OperationsRequest = {
        headers: {
          authorization: "",
        },
      } as OperationsRequest;
      const res: ExpressResponse = {} as ExpressResponse;
      const next: MockFunction = getJestMockFunction();
      void BearerTokenAuthorization.isAuthorizedBearerToken(req, res, next);
      expect(next.mock.calls[0][0]).toMatchInlineSnapshot(
        `[Error: Invalid bearer token, or bearer token not provided.]`,
      );
    });
    it("calls next with exception if token is invalid", () => {
      const req: OperationsRequest = {
        headers: {
          authorization: "Bearer ",
        },
      } as OperationsRequest;
      const res: ExpressResponse = {} as ExpressResponse;
      const next: MockFunction = getJestMockFunction();
      void BearerTokenAuthorization.isAuthorizedBearerToken(req, res, next);
      expect(next.mock.calls[0][0]).toMatchInlineSnapshot(
        `[Error: Invalid bearer token, or bearer token not provided.]`,
      );
    });
    it("calls next with exception if token header is not present", () => {
      const req: OperationsRequest = {} as OperationsRequest;
      const res: ExpressResponse = {} as ExpressResponse;
      const next: MockFunction = getJestMockFunction();
      void BearerTokenAuthorization.isAuthorizedBearerToken(req, res, next);
      expect(next.mock.calls[0][0]).toMatchInlineSnapshot(
        `[Error: Invalid bearer token, or bearer token not provided.]`,
      );
    });
  });
});
