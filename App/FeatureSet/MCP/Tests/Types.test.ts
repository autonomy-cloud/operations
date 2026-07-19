import { describe, it, expect } from "@jest/globals";
import OperationsOperation from "../Types/OperationsOperation";
import ModelType from "../Types/ModelType";
import {
  McpToolInfo,
  ModelToolsResult,
  OperationsToolCallArgs,
} from "../Types/McpTypes";

describe("Cast Operations Types", () => {
  describe("OperationsOperation Enum", () => {
    it("should have all required operations", () => {
      expect(OperationsOperation.Create).toBe("create");
      expect(OperationsOperation.Read).toBe("read");
      expect(OperationsOperation.List).toBe("list");
      expect(OperationsOperation.Update).toBe("update");
      expect(OperationsOperation.Delete).toBe("delete");
      expect(OperationsOperation.Count).toBe("count");
    });

    it("should contain exactly 6 operations", () => {
      const operations: string[] = Object.values(OperationsOperation);
      expect(operations).toHaveLength(6);
    });

    it("should have string values for all operations", () => {
      Object.values(OperationsOperation).forEach((operation: string) => {
        expect(typeof operation).toBe("string");
      });
    });

    it("should be usable in switch statements", () => {
      const getOperationName: (testOperation: OperationsOperation) => string = (
        testOperation: OperationsOperation,
      ): string => {
        switch (testOperation) {
          case OperationsOperation.Create:
            return "create";
          case OperationsOperation.Read:
            return "read";
          case OperationsOperation.List:
            return "list";
          case OperationsOperation.Update:
            return "update";
          case OperationsOperation.Delete:
            return "delete";
          case OperationsOperation.Count:
            return "count";
          default:
            return "unknown";
        }
      };

      expect(getOperationName(OperationsOperation.Create)).toBe("create");
      expect(getOperationName(OperationsOperation.Read)).toBe("read");
      expect(getOperationName(OperationsOperation.Update)).toBe("update");
    });
  });

  describe("ModelType Enum", () => {
    it("should have required model types", () => {
      expect(ModelType.Database).toBeDefined();
      expect(ModelType.Analytics).toBeDefined();
    });

    it("should distinguish between database and analytics", () => {
      expect(ModelType.Database).not.toBe(ModelType.Analytics);
    });

    it("should be usable for type checking", () => {
      const databaseModel: ModelType = ModelType.Database;
      const analyticsModel: ModelType = ModelType.Analytics;

      expect(databaseModel === ModelType.Database).toBe(true);
      expect(analyticsModel === ModelType.Analytics).toBe(true);
      expect(databaseModel.toString() === analyticsModel.toString()).toBe(
        false,
      );
    });
  });

  describe("McpToolInfo Interface", () => {
    it("should accept valid tool info objects", () => {
      const validToolInfo: McpToolInfo = {
        name: "create_project",
        description: "Create a new project",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
          },
          required: ["name"],
        },
        modelName: "Project",
        operation: OperationsOperation.Create,
        modelType: ModelType.Database,
        singularName: "project",
        pluralName: "projects",
        tableName: "Project",
        apiPath: "/api/project",
      };

      expect(validToolInfo.name).toBe("create_project");
      expect(validToolInfo.operation).toBe(OperationsOperation.Create);
      expect(validToolInfo.modelType).toBe(ModelType.Database);
      expect(validToolInfo.apiPath).toBe("/api/project");
    });

    it("should handle optional apiPath field", () => {
      const toolInfoWithoutApiPath: Omit<McpToolInfo, "apiPath"> = {
        name: "list_logs",
        description: "List all logs",
        inputSchema: { type: "object", properties: {} },
        modelName: "Log",
        operation: OperationsOperation.List,
        modelType: ModelType.Analytics,
        singularName: "log",
        pluralName: "logs",
        tableName: "Log",
      };

      expect(toolInfoWithoutApiPath.name).toBe("list_logs");
      expect(toolInfoWithoutApiPath.modelType).toBe(ModelType.Analytics);
    });

    it("should support all operations", () => {
      const operations: OperationsOperation[] =
        Object.values(OperationsOperation);

      operations.forEach((operation: OperationsOperation) => {
        const toolInfo: McpToolInfo = {
          name: `${operation}_test`,
          description: `Test ${operation} operation`,
          inputSchema: { type: "object", properties: {} },
          modelName: "Test",
          operation: operation,
          modelType: ModelType.Database,
          singularName: "test",
          pluralName: "tests",
          tableName: "Test",
        };

        expect(toolInfo.operation).toBe(operation);
      });
    });
  });

  describe("ModelToolsResult Interface", () => {
    it("should structure model tools and info correctly", () => {
      const modelResult: ModelToolsResult = {
        tools: [
          {
            name: "create_monitor",
            description: "Create a monitor",
            inputSchema: { type: "object", properties: {} },
            modelName: "Monitor",
            operation: OperationsOperation.Create,
            modelType: ModelType.Database,
            singularName: "monitor",
            pluralName: "monitors",
            tableName: "Monitor",
          },
        ],
        modelInfo: {
          tableName: "Monitor",
          singularName: "monitor",
          pluralName: "monitors",
          modelType: ModelType.Database,
          apiPath: "/api/monitor",
        },
      };

      expect(modelResult.tools).toHaveLength(1);
      expect(modelResult.modelInfo.tableName).toBe("Monitor");
      expect(modelResult.modelInfo.modelType).toBe(ModelType.Database);
    });

    it("should handle optional apiPath in modelInfo", () => {
      const modelResult: ModelToolsResult = {
        tools: [],
        modelInfo: {
          tableName: "Analytics",
          singularName: "analytic",
          pluralName: "analytics",
          modelType: ModelType.Analytics,
        },
      };

      expect(modelResult.modelInfo.apiPath).toBeUndefined();
      expect(modelResult.modelInfo.modelType).toBe(ModelType.Analytics);
    });
  });

  describe("OperationsToolCallArgs Interface", () => {
    it("should support all argument types", () => {
      const createArgs: OperationsToolCallArgs = {
        data: {
          name: "New Project",
          description: "A test project",
        },
      };

      const readArgs: OperationsToolCallArgs = {
        id: "project-123",
      };

      const listArgs: OperationsToolCallArgs = {
        query: { status: "active" },
        limit: 10,
        skip: 0,
        sort: { createdAt: -1 },
        select: { name: 1, description: 1 },
      };

      const updateArgs: OperationsToolCallArgs = {
        id: "project-123",
        data: { name: "Updated Project" },
      };

      const deleteArgs: OperationsToolCallArgs = {
        id: "project-123",
      };

      const countArgs: OperationsToolCallArgs = {
        query: { status: "active" },
      };

      expect(createArgs.data).toBeDefined();
      expect(readArgs.id).toBe("project-123");
      expect(listArgs.limit).toBe(10);
      expect(updateArgs.id).toBe("project-123");
      expect(updateArgs.data).toBeDefined();
      expect(deleteArgs.id).toBe("project-123");
      expect(countArgs.query).toBeDefined();
    });

    it("should handle empty args object", () => {
      const emptyArgs: OperationsToolCallArgs = {};

      expect(emptyArgs.id).toBeUndefined();
      expect(emptyArgs.data).toBeUndefined();
      expect(emptyArgs.query).toBeUndefined();
    });

    it("should support complex query objects", () => {
      const complexArgs: OperationsToolCallArgs = {
        query: {
          $and: [
            { status: "active" },
            { $or: [{ priority: "high" }, { urgent: true }] },
          ],
        },
        sort: {
          priority: -1,
          createdAt: 1,
        },
        select: {
          name: 1,
          status: 1,
          priority: 1,
        },
      };

      expect(complexArgs.query).toHaveProperty("$and");
      expect(complexArgs.sort).toHaveProperty("priority", -1);
      expect(complexArgs.select).toHaveProperty("name", 1);
    });

    it("should support pagination parameters", () => {
      const paginationArgs: OperationsToolCallArgs = {
        limit: 25,
        skip: 50,
      };

      expect(paginationArgs.limit).toBe(25);
      expect(paginationArgs.skip).toBe(50);
    });
  });

  describe("Type Validation", () => {
    it("should ensure type safety for operations", () => {
      const validOperations: OperationsOperation[] = [
        OperationsOperation.Create,
        OperationsOperation.Read,
        OperationsOperation.List,
        OperationsOperation.Update,
        OperationsOperation.Delete,
        OperationsOperation.Count,
      ];

      validOperations.forEach((op: OperationsOperation) => {
        expect(Object.values(OperationsOperation)).toContain(op);
      });
    });

    it("should ensure type safety for model types", () => {
      const validModelTypes: ModelType[] = [
        ModelType.Database,
        ModelType.Analytics,
      ];

      validModelTypes.forEach((type: ModelType) => {
        expect(Object.values(ModelType)).toContain(type);
      });
    });
  });

  describe("JSON Schema Compatibility", () => {
    it("should work with JSON schema structures", () => {
      const jsonSchema: any = {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "The name of the item",
          },
          count: {
            type: "number",
            minimum: 0,
          },
          active: {
            type: "boolean",
            default: true,
          },
        },
        required: ["name"],
        additionalProperties: false,
      };

      const toolInfo: McpToolInfo = {
        name: "test_tool",
        description: "Test tool",
        inputSchema: jsonSchema,
        modelName: "Test",
        operation: OperationsOperation.Create,
        modelType: ModelType.Database,
        singularName: "test",
        pluralName: "tests",
        tableName: "Test",
      };

      expect(toolInfo.inputSchema.type).toBe("object");
      expect(toolInfo.inputSchema.properties).toBeDefined();
      expect(toolInfo.inputSchema.required).toContain("name");
    });
  });
});
