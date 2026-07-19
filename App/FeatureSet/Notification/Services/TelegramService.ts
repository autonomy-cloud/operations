import { getTelegramConfig, TelegramConfig } from "../Config";
import BadDataException from "Common/Types/Exception/BadDataException";
import ObjectID from "Common/Types/ObjectID";
import UserNotificationStatus from "Common/Types/UserNotification/UserNotificationStatus";
import TelegramMessage from "Common/Types/Telegram/TelegramMessage";
import TelegramStatus from "Common/Types/TelegramStatus";
import { JSONObject } from "Common/Types/JSON";
import ProjectService from "Common/Server/Services/ProjectService";
import UserOnCallLogTimelineService from "Common/Server/Services/UserOnCallLogTimelineService";
import TelegramLogService from "Common/Server/Services/TelegramLogService";
import logger from "Common/Server/Utils/Logger";
import TelegramLog from "Common/Models/DatabaseModels/TelegramLog";
import Project from "Common/Models/DatabaseModels/Project";
import API from "Common/Utils/API";
import HTTPErrorResponse from "Common/Types/API/HTTPErrorResponse";
import HTTPResponse from "Common/Types/API/HTTPResponse";
import Protocol from "Common/Types/API/Protocol";
import Route from "Common/Types/API/Route";
import URL from "Common/Types/API/URL";

const SENSITIVE_MESSAGE_PLACEHOLDER: string =
  "This message is sensitive and is not logged";

export default class TelegramService {
  public static async sendTelegram(
    message: TelegramMessage,
    options: {
      projectId?: ObjectID | undefined;
      isSensitive?: boolean | undefined;
      userOnCallLogTimelineId?: ObjectID | undefined;
      incidentId?: ObjectID | undefined;
      alertId?: ObjectID | undefined;
      monitorId?: ObjectID | undefined;
      scheduledMaintenanceId?: ObjectID | undefined;
      statusPageId?: ObjectID | undefined;
      statusPageAnnouncementId?: ObjectID | undefined;
      userId?: ObjectID | undefined;
      onCallPolicyId?: ObjectID | undefined;
      onCallPolicyEscalationRuleId?: ObjectID | undefined;
      onCallDutyPolicyExecutionLogTimelineId?: ObjectID | undefined;
      onCallScheduleId?: ObjectID | undefined;
      teamId?: ObjectID | undefined;
    } = {},
  ): Promise<void> {
    let sendError: Error | null = null;
    const telegramLog: TelegramLog = new TelegramLog();

    try {
      if (!message.to) {
        throw new BadDataException("Telegram chat id is required");
      }

      if (!message.body) {
        throw new BadDataException("Telegram message body is required");
      }

      const isSensitiveMessage: boolean = Boolean(options.isSensitive);
      const messageSummary: string = isSensitiveMessage
        ? SENSITIVE_MESSAGE_PLACEHOLDER
        : message.body;

      telegramLog.toChatId = message.to;
      telegramLog.messageText = messageSummary;
      telegramLog.telegramCostInUSDCents = 0;

      if (options.projectId) {
        telegramLog.projectId = options.projectId;
      }

      if (options.incidentId) {
        telegramLog.incidentId = options.incidentId;
      }

      if (options.alertId) {
        telegramLog.alertId = options.alertId;
      }

      if (options.monitorId) {
        telegramLog.monitorId = options.monitorId;
      }

      if (options.scheduledMaintenanceId) {
        telegramLog.scheduledMaintenanceId = options.scheduledMaintenanceId;
      }

      if (options.statusPageId) {
        telegramLog.statusPageId = options.statusPageId;
      }

      if (options.statusPageAnnouncementId) {
        telegramLog.statusPageAnnouncementId = options.statusPageAnnouncementId;
      }

      if (options.userId) {
        telegramLog.userId = options.userId;
      }

      if (options.teamId) {
        telegramLog.teamId = options.teamId;
      }

      if (options.onCallPolicyId) {
        telegramLog.onCallDutyPolicyId = options.onCallPolicyId;
      }

      if (options.onCallPolicyEscalationRuleId) {
        telegramLog.onCallDutyPolicyEscalationRuleId =
          options.onCallPolicyEscalationRuleId;
      }

      if (options.onCallScheduleId) {
        telegramLog.onCallDutyPolicyScheduleId = options.onCallScheduleId;
      }

      const config: TelegramConfig = await getTelegramConfig();

      if (config.botUsername) {
        telegramLog.fromBotUsername = config.botUsername;
      }

      if (options.projectId) {
        const project: Project | null = await ProjectService.findOneById({
          id: options.projectId,
          select: {
            name: true,
          },
          props: {
            isRoot: true,
          },
        });

        if (!project) {
          telegramLog.status = TelegramStatus.Error;
          telegramLog.statusMessage = `Project ${options.projectId.toString()} not found.`;
          logger.error(telegramLog.statusMessage);
          await TelegramLogService.create({
            data: telegramLog,
            props: {
              isRoot: true,
            },
          });
          return;
        }
      }

      const payload: JSONObject = {
        chat_id: message.to,
        text: message.body,
      };

      if (message.parseMode) {
        payload["parse_mode"] = message.parseMode;
      }

      if (message.disableWebPagePreview !== undefined) {
        payload["disable_web_page_preview"] = message.disableWebPagePreview;
      }

      const url: URL = new URL(
        Protocol.HTTPS,
        "api.telegram.org",
        new Route(`/bot${config.botToken}/sendMessage`),
      );

      const response: HTTPResponse<JSONObject> | HTTPErrorResponse =
        await API.post<JSONObject>({
          url,
          data: payload,
          headers: {
            "Content-Type": "application/json",
          },
        });

      if (response instanceof HTTPErrorResponse) {
        logger.error("Failed to send Telegram message.");
        logger.error(response);
        const description: string | undefined =
          (response.data?.["description"] as string | undefined) ||
          (
            response.jsonData as
              | { description?: string | undefined }
              | undefined
          )?.description;

        throw new BadDataException(
          description || "Failed to send Telegram message.",
        );
      }

      const responseData: JSONObject = (response.jsonData || {}) as JSONObject;

      if (responseData["ok"] === false) {
        const description: string =
          (responseData["description"] as string) || "Telegram API Error.";
        throw new BadDataException(description);
      }

      const result: JSONObject | undefined =
        (responseData["result"] as JSONObject | undefined) || undefined;
      const telegramMessageId: string | undefined =
        result && result["message_id"] !== undefined
          ? String(result["message_id"])
          : undefined;

      if (telegramMessageId) {
        telegramLog.telegramMessageId = telegramMessageId;
      }

      telegramLog.status = TelegramStatus.Sent;
      telegramLog.statusMessage = telegramMessageId
        ? `Message ID: ${telegramMessageId}`
        : "Telegram message sent successfully";
    } catch (error: unknown) {
      logger.error("Failed to send Telegram message.");
      logger.error(error);
      telegramLog.telegramCostInUSDCents = 0;
      telegramLog.status = TelegramStatus.Error;
      const errorMessage: string =
        error instanceof Error && error.message
          ? error.message
          : `${error as string}`;
      telegramLog.statusMessage = errorMessage;

      sendError = error instanceof Error ? error : new Error(errorMessage);
    }

    if (options.projectId) {
      await TelegramLogService.create({
        data: telegramLog,
        props: {
          isRoot: true,
        },
      });
    }

    if (options.userOnCallLogTimelineId) {
      await UserOnCallLogTimelineService.updateOneById({
        id: options.userOnCallLogTimelineId,
        data: {
          status: [
            TelegramStatus.Success,
            TelegramStatus.Sent,
            TelegramStatus.Delivered,
            TelegramStatus.Read,
          ].includes(telegramLog.status || TelegramStatus.Error)
            ? UserNotificationStatus.Sent
            : UserNotificationStatus.Error,
          statusMessage: telegramLog.statusMessage,
        },
        props: {
          isRoot: true,
        },
      });
    }

    if (sendError) {
      throw sendError;
    }
  }
}
