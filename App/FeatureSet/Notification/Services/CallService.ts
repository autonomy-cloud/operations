import { getTwilioConfig } from "../Config";
import CallRequest, { GatherInput, Say } from "Common/Types/Call/CallRequest";
import CallStatus from "Common/Types/Call/CallStatus";
import TwilioConfig from "Common/Types/CallAndSMS/TwilioConfig";
import OperationsDate from "Common/Types/Date";
import BadDataException from "Common/Types/Exception/BadDataException";
import JSONFunctions from "Common/Types/JSONFunctions";
import ObjectID from "Common/Types/ObjectID";
import UserNotificationStatus from "Common/Types/UserNotification/UserNotificationStatus";
import CallLogService from "Common/Server/Services/CallLogService";
import ProjectService from "Common/Server/Services/ProjectService";
import UserOnCallLogTimelineService from "Common/Server/Services/UserOnCallLogTimelineService";
import JSONWebToken from "Common/Server/Utils/JsonWebToken";
import logger from "Common/Server/Utils/Logger";
import AppMetrics from "Common/Server/Utils/Telemetry/AppMetrics";
import CallLog from "Common/Models/DatabaseModels/CallLog";
import Project from "Common/Models/DatabaseModels/Project";
import Twilio from "twilio";
import { CallInstance } from "twilio/lib/rest/api/v2010/account/call";
import Phone from "Common/Types/Phone";

/**
 * Extracts the main sayMessage values from a CallRequest's data array for call summary.
 * Excludes acknowledgment responses, error messages, and other system messages.
 * @param callRequest The call request containing data array with various objects
 * @returns A string containing main call content messages separated by newlines
 */
function extractSayMessagesFromCallRequest(callRequest: CallRequest): string {
  const sayMessages: string[] = [];

  if (callRequest.data && Array.isArray(callRequest.data)) {
    for (const item of callRequest.data) {
      // Check if the item is a Say object with sayMessage
      if ((item as Say).sayMessage) {
        sayMessages.push((item as Say).sayMessage);
      }
      // Check if the item is a GatherInput with introMessage
      if ((item as GatherInput).introMessage) {
        sayMessages.push((item as GatherInput).introMessage);
      }
      /*
       * NOTE: Excluding noInputMessage and onInputCallRequest messages from summary
       * as they contain system responses like "Good bye", "Invalid input", "You have acknowledged"
       * which should not be included in the call summary according to user requirements
       */
    }
  }

  return sayMessages.length > 0
    ? sayMessages.join(" ")
    : "No message content found";
}

export default class CallService {
  public static async makeCall(
    callRequest: CallRequest,
    options: {
      projectId?: ObjectID | undefined; // project id for sms log
      isSensitive?: boolean; // if true, message will not be logged
      userOnCallLogTimelineId?: ObjectID | undefined; // user notification log timeline id
      customTwilioConfig?: TwilioConfig | undefined;
      incidentId?: ObjectID | undefined;
      alertId?: ObjectID | undefined;
      monitorId?: ObjectID | undefined;
      scheduledMaintenanceId?: ObjectID | undefined;
      statusPageId?: ObjectID | undefined;
      statusPageAnnouncementId?: ObjectID | undefined;
      userId?: ObjectID | undefined;
      // On-call policy related fields
      onCallPolicyId?: ObjectID | undefined;
      onCallPolicyEscalationRuleId?: ObjectID | undefined;
      onCallDutyPolicyExecutionLogTimelineId?: ObjectID | undefined;
      onCallScheduleId?: ObjectID | undefined;
      teamId?: ObjectID | undefined;
    },
  ): Promise<void> {
    const startNs: bigint = process.hrtime.bigint();
    let outcome: "success" | "failure" = "success";

    try {
      await this.makeCallInternal(callRequest, options);
    } catch (err) {
      outcome = "failure";
      throw err;
    } finally {
      const elapsedNs: bigint = process.hrtime.bigint() - startNs;
      const durationMs: number = Number(elapsedNs) / 1e6;
      const attributes: Record<string, string> = {
        "notification.channel": "call",
        outcome,
      };

      AppMetrics.getNotificationCounter().add(1, attributes);
      AppMetrics.getNotificationDuration().record(durationMs, attributes);
    }
  }

  private static async makeCallInternal(
    callRequest: CallRequest,
    options: {
      projectId?: ObjectID | undefined; // project id for sms log
      isSensitive?: boolean; // if true, message will not be logged
      userOnCallLogTimelineId?: ObjectID | undefined; // user notification log timeline id
      customTwilioConfig?: TwilioConfig | undefined;
      incidentId?: ObjectID | undefined;
      alertId?: ObjectID | undefined;
      monitorId?: ObjectID | undefined;
      scheduledMaintenanceId?: ObjectID | undefined;
      statusPageId?: ObjectID | undefined;
      statusPageAnnouncementId?: ObjectID | undefined;
      userId?: ObjectID | undefined;
      // On-call policy related fields
      onCallPolicyId?: ObjectID | undefined;
      onCallPolicyEscalationRuleId?: ObjectID | undefined;
      onCallDutyPolicyExecutionLogTimelineId?: ObjectID | undefined;
      onCallScheduleId?: ObjectID | undefined;
      teamId?: ObjectID | undefined;
    },
  ): Promise<void> {
    let callError: Error | null = null;
    const callLog: CallLog = new CallLog();

    try {
      logger.debug("Call Request received.");

      const twilioConfig: TwilioConfig | null =
        options.customTwilioConfig || (await getTwilioConfig());

      if (!twilioConfig) {
        throw new BadDataException("Twilio Config not found");
      }

      const client: Twilio.Twilio = Twilio(
        twilioConfig.accountSid,
        twilioConfig.authToken,
      );

      callLog.toNumber = callRequest.to;

      const fromNumber: Phone = Phone.pickPhoneNumberToSendSMSOrCallFrom({
        to: callRequest.to,
        primaryPhoneNumberToPickFrom: twilioConfig.primaryPhoneNumber,
        secondaryPhoneNumbersToPickFrom:
          twilioConfig.secondaryPhoneNumbers || [],
      });
      callLog.fromNumber = fromNumber;
      callLog.callData =
        options && options.isSensitive
          ? ({ message: "This call is sensitive and is not logged" } as any)
          : ({
              message: extractSayMessagesFromCallRequest(callRequest),
            } as any);
      callLog.callCostInUSDCents = 0;

      if (options.projectId) {
        callLog.projectId = options.projectId;
      }

      if (options.incidentId) {
        callLog.incidentId = options.incidentId;
      }

      if (options.alertId) {
        callLog.alertId = options.alertId;
      }

      if (options.monitorId) {
        callLog.monitorId = options.monitorId;
      }

      if (options.scheduledMaintenanceId) {
        callLog.scheduledMaintenanceId = options.scheduledMaintenanceId;
      }

      if (options.statusPageId) {
        callLog.statusPageId = options.statusPageId;
      }

      if (options.statusPageAnnouncementId) {
        callLog.statusPageAnnouncementId = options.statusPageAnnouncementId;
      }

      if (options.userId) {
        callLog.userId = options.userId;
      }

      if (options.teamId) {
        callLog.teamId = options.teamId;
      }

      // Set OnCall-related fields
      if (options.onCallPolicyId) {
        callLog.onCallDutyPolicyId = options.onCallPolicyId;
      }

      if (options.onCallPolicyEscalationRuleId) {
        callLog.onCallDutyPolicyEscalationRuleId =
          options.onCallPolicyEscalationRuleId;
      }

      if (options.onCallScheduleId) {
        callLog.onCallDutyPolicyScheduleId = options.onCallScheduleId;
      }

      let project: Project | null = null;

      if (options.projectId) {
        project = await ProjectService.findOneById({
          id: options.projectId,
          select: {
            enableCallNotifications: true,
          },
          props: {
            isRoot: true,
          },
        });

        logger.debug("Project found.");

        if (!project) {
          callLog.status = CallStatus.Error;
          callLog.statusMessage = `Project ${options.projectId.toString()} not found.`;
          logger.error(callLog.statusMessage);
          await CallLogService.create({
            data: callLog,
            props: {
              isRoot: true,
            },
          });
          return;
        }

        if (!project.enableCallNotifications) {
          callLog.status = CallStatus.Error;
          callLog.statusMessage = `Call notifications are not enabled for this project. Please enable Call notifications in Project Settings.`;
          logger.error(callLog.statusMessage);
          await CallLogService.create({
            data: callLog,
            props: {
              isRoot: true,
            },
          });

          return;
        }
      }

      logger.debug("Sending Call Request.");

      const twillioCall: CallInstance = await client.calls.create({
        twiml: this.generateTwimlForCall(callRequest),
        to: callRequest.to.toString(),
        from: fromNumber.toString(), // From a valid Twilio number
      });

      logger.debug("Call Request sent successfully.");

      callLog.status = CallStatus.Success;
      callLog.statusMessage = "Call ID: " + twillioCall.sid;

      logger.debug("Call ID: " + twillioCall.sid);
      logger.debug(callLog.statusMessage);
    } catch (e: any) {
      callLog.callCostInUSDCents = 0;
      callLog.status = CallStatus.Error;
      callLog.statusMessage =
        e && e.message ? e.message.toString() : e.toString();

      logger.error("Call Request failed.");
      logger.error(callLog.statusMessage);
      callError = e;
    }

    logger.debug("Saving Call Log if project id is provided.");

    if (options.projectId) {
      logger.debug("Saving Call Log.");
      await CallLogService.create({
        data: callLog,
        props: {
          isRoot: true,
        },
      });
      logger.debug("Call Log saved.");
    } else {
      logger.debug("Project Id is not provided. Call Log not saved.");
    }

    if (options.userOnCallLogTimelineId) {
      await UserOnCallLogTimelineService.updateOneById({
        data: {
          status:
            callLog.status === CallStatus.Success
              ? UserNotificationStatus.Sent
              : UserNotificationStatus.Error,
          statusMessage: callLog.statusMessage!,
        },
        id: options.userOnCallLogTimelineId,
        props: {
          isRoot: true,
        },
      });
    }

    if (callError) {
      throw callError;
    }
  }

  public static generateTwimlForCall(callRequest: CallRequest): string {
    const response: Twilio.twiml.VoiceResponse =
      new Twilio.twiml.VoiceResponse();

    for (const item of callRequest.data) {
      if ((item as Say).sayMessage) {
        response.say((item as Say).sayMessage);
      }

      if ((item as GatherInput) && (item as GatherInput).numDigits > 0) {
        response.say((item as GatherInput).introMessage);

        response.gather({
          numDigits: (item as GatherInput).numDigits,
          timeout: (item as GatherInput).timeoutInSeconds || 5,
          action: (item as GatherInput).responseUrl
            .addQueryParam(
              "token",
              JSONWebToken.signJsonPayload(
                JSONFunctions.serialize(
                  (item as GatherInput).onInputCallRequest as any,
                ),
                OperationsDate.getDayInSeconds(),
              ),
            )
            .toString(),
          method: "POST",
        });

        response.say((item as GatherInput).noInputMessage);
      }
    }

    response.hangup();

    return response.toString();
  }
}
