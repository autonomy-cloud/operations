/**
 * MCP FeatureSet
 * Integrates the Model Context Protocol server into the App service
 */

import FeatureSet from "Common/Server/Types/FeatureSet";
import Express, { ExpressApplication } from "Common/Server/Utils/Express";
import logger, { LogAttributes } from "Common/Server/Utils/Logger";

import { getApiUrl } from "./Config/ServerConfig";
import { initializeMCPServer } from "./Server/MCPServer";
import { setupMCPRoutes } from "./Handlers/RouteHandler";
import { generateAllTools } from "./Tools/ToolGenerator";
import OperationsApiService, {
  OperationsApiConfig,
} from "./Services/OperationsApiService";
import { McpToolInfo } from "./Types/McpTypes";

const MCPFeatureSet: FeatureSet = {
  init: async (): Promise<void> => {
    const app: ExpressApplication = Express.getExpressApp();

    // Initialize Cast Operations API Service
    const apiUrl: string = getApiUrl();
    const config: OperationsApiConfig = {
      url: apiUrl,
    };
    OperationsApiService.initialize(config);
    logger.info(
      `MCP: Cast Operations API Service initialized with: ${apiUrl}`,
      {
        featureSet: "MCP",
      } as LogAttributes,
    );

    // Mark MCP subsystem as initialized
    initializeMCPServer();

    // Generate tools (tool handlers are registered per-session in RouteHandler)
    const tools: McpToolInfo[] = generateAllTools();
    logger.info(`MCP: Generated ${tools.length} tools`, {
      featureSet: "MCP",
    } as LogAttributes);

    // Setup MCP-specific routes
    setupMCPRoutes(app, tools);

    logger.info(`MCP FeatureSet initialized successfully`, {
      featureSet: "MCP",
    } as LogAttributes);
  },
};

export default MCPFeatureSet;
