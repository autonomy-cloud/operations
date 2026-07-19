import URL from "Common/Types/API/URL";
import ObjectID from "Common/Types/ObjectID";
import logger from "Common/Server/Utils/Logger";
import Port from "Common/Types/Port";

if (!process.env["CAST_OPERATIONS_URL"]) {
  logger.error("CAST_OPERATIONS_URL is not set");
  process.exit();
}

export const CAST_OPERATIONS_URL: URL = URL.fromString(
  process.env["CAST_OPERATIONS_URL"] || "https://visca.ai",
);

export const AI_AGENT_ID: ObjectID | null = process.env["AI_AGENT_ID"]
  ? new ObjectID(process.env["AI_AGENT_ID"])
  : null;

if (!process.env["AI_AGENT_KEY"]) {
  logger.error("AI_AGENT_KEY is not set");
  process.exit();
}

export const AI_AGENT_KEY: string = process.env["AI_AGENT_KEY"];

export const AI_AGENT_NAME: string | null =
  process.env["AI_AGENT_NAME"] || null;

export const AI_AGENT_DESCRIPTION: string | null =
  process.env["AI_AGENT_DESCRIPTION"] || null;

export const HOSTNAME: string = process.env["HOSTNAME"] || "localhost";

export const PORT: Port = new Port(
  process.env["PORT"] ? parseInt(process.env["PORT"]) : 3875,
);
