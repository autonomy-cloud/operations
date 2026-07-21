import {
  NotificationSlackWebhookOnCreateProject,
  NotificationSlackWebhookOnDeleteProject,
} from "../EnvironmentConfig";
import CreateBy from "../Types/Database/CreateBy";
import DeleteBy from "../Types/Database/DeleteBy";
import FindBy from "../Types/Database/FindBy";
import { OnCreate, OnDelete, OnFind, OnUpdate } from "../Types/Database/Hooks";
import QueryHelper from "../Types/Database/QueryHelper";
import UpdateBy from "../Types/Database/UpdateBy";
import logger, { LogAttributes } from "../Utils/Logger";
import ProductAnalytics from "../Utils/ProductAnalytics";
import AccessTokenService from "./AccessTokenService";
import DatabaseService from "./DatabaseService";
import IncidentSeverityService from "./IncidentSeverityService";
import IncidentStateService from "./IncidentStateService";
import IncidentRoleService from "./IncidentRoleService";
import MailService from "./MailService";
import MonitorStatusService from "./MonitorStatusService";
import ScheduledMaintenanceStateService from "./ScheduledMaintenanceStateService";
import TeamMemberService from "./TeamMemberService";
import TeamPermissionService from "./TeamPermissionService";
import TeamService from "./TeamService";
import UserNotificationRuleService from "./UserNotificationRuleService";
import UserNotificationSettingService from "./UserNotificationSettingService";
import UserService from "./UserService";
import {
  Black,
  Blue500,
  Gray500,
  Green,
  Moroon500,
  Purple500,
  Red,
  Teal500,
  Yellow,
  Yellow500,
} from "../../Types/BrandColors";
import Color from "../../Types/Color";
import LIMIT_MAX from "../../Types/Database/LimitMax";
import OperationsDate from "../../Types/Date";
import EmailTemplateType from "../../Types/Email/EmailTemplateType";
import BadDataException from "../../Types/Exception/BadDataException";
import NotAuthorizedException from "../../Types/Exception/NotAuthorizedException";
import IconProp from "../../Types/Icon/IconProp";
import ObjectID from "../../Types/ObjectID";
import Permission from "../../Types/Permission";
import IncidentSeverity from "../../Models/DatabaseModels/IncidentSeverity";
import IncidentState from "../../Models/DatabaseModels/IncidentState";
import IncidentRole from "../../Models/DatabaseModels/IncidentRole";
import MonitorStatus from "../../Models/DatabaseModels/MonitorStatus";
import Model from "../../Models/DatabaseModels/Project";
import BaseModel from "../../Models/DatabaseModels/DatabaseBaseModel/DatabaseBaseModel";
import ScheduledMaintenanceState from "../../Models/DatabaseModels/ScheduledMaintenanceState";
import Team from "../../Models/DatabaseModels/Team";
import TeamMember from "../../Models/DatabaseModels/TeamMember";
import TeamPermission from "../../Models/DatabaseModels/TeamPermission";
import User from "../../Models/DatabaseModels/User";
import Select from "../Types/Database/Select";
import Query from "../Types/Database/Query";
import AlertSeverity from "../../Models/DatabaseModels/AlertSeverity";
import AlertSeverityService from "./AlertSeverityService";
import AlertState from "../../Models/DatabaseModels/AlertState";
import AlertStateService from "./AlertStateService";
import SlackUtil from "../Utils/Workspace/Slack/Slack";
import URL from "../../Types/API/URL";
import Exception from "../../Types/Exception/Exception";
import CaptureSpan from "../Utils/Telemetry/CaptureSpan";
import DatabaseConfig from "../DatabaseConfig";
import DatabaseCommonInteractionProps from "../../Types/BaseDatabase/DatabaseCommonInteractionProps";
import PositiveNumber from "../../Types/PositiveNumber";
import Semaphore, { SemaphoreMutex } from "../Infrastructure/Semaphore";
import InMemoryTTLCache from "../Infrastructure/InMemoryTTLCache";

export class ProjectService extends DatabaseService<Model> {
  /*
   * Suppresses repeated `lastActive` UPDATEs from a single API node. 60s of
   * staleness on "last seen" is acceptable; an UPDATE per request is not.
   */
  private lastActiveCache: InMemoryTTLCache<true> = new InMemoryTTLCache(
    10_000,
  );
  /*
   * Caches the `requireSsoForLogin` flag per project so middleware can skip a
   * Postgres findOneById on every authenticated request.
   */
  private requireSsoForLoginCache: InMemoryTTLCache<boolean> =
    new InMemoryTTLCache(10_000);
  /*
   * Caches the `requireSsoWithSsoProviderId` discriminator per project so the
   * enforce-SSO middleware can require that the SSO token was issued by a
   * specific provider. Stored as a string id (or null when unset). Populated
   * alongside `getRequireSsoForLogin` so the common path stays a single query.
   */
  private requireSsoWithSsoProviderIdCache: InMemoryTTLCache<string | null> =
    new InMemoryTTLCache(10_000);
  public constructor() {
    super(Model);
  }

  @CaptureSpan()
  protected override async onBeforeCreate(
    data: CreateBy<Model>,
  ): Promise<OnCreate<Model>> {
    if (!data.data.name) {
      throw new BadDataException("Project name is required");
    }

    if (data.props.userId) {
      data.data.createdByUserId = data.props.userId;
    } else {
      throw new NotAuthorizedException(
        "User should be logged in to create the project.",
      );
    }

    logger.debug("Creating project for user " + data.props.userId, {
      userId: data.props.userId?.toString(),
    } as LogAttributes);

    const user: User | null = await UserService.findOneById({
      id: data.props.userId,
      select: {
        name: true,
        email: true,
        isMasterAdmin: true,
        companyPhoneNumber: true,
        companyName: true,
        utmCampaign: true,
        utmSource: true,
        utmMedium: true,
        utmTerm: true,
        utmContent: true,
        utmUrl: true,
        clickIds: true,
        firstTouchAttribution: true,
      },
      props: {
        isRoot: true,
      },
    });

    if (!user) {
      throw new BadDataException("User not found.");
    }

    // Check if project creation is restricted to admins only
    const shouldDisableProjectCreation: boolean =
      await DatabaseConfig.shouldDisableUserProjectCreation();
    if (shouldDisableProjectCreation && !user.isMasterAdmin) {
      throw new NotAuthorizedException(
        "Project creation is restricted to admin users only on this Cast Operations Server. Please contact your server admin.",
      );
    }

    // check if the user has the project with the same name. If yes, reject.

    let existingProjectWithSameNameCount: number = 0;
    if (
      data.props.userGlobalAccessPermission &&
      data.props.userGlobalAccessPermission?.projectIds.length > 0
    ) {
      existingProjectWithSameNameCount = (
        await this.countBy({
          query: {
            _id: QueryHelper.any(
              data.props.userGlobalAccessPermission?.projectIds.map(
                (item: ObjectID) => {
                  return item.toString();
                },
              ) || [],
            ),
            name: QueryHelper.findWithSameText(data.data.name!),
          },
          props: {
            isRoot: true,
          },
        })
      ).toNumber();
    }

    if (existingProjectWithSameNameCount > 0) {
      throw new BadDataException("Project with the same name already exists");
    }

    data.data.createdOwnerName = user.name!;
    data.data.createdOwnerEmail = user.email!;
    data.data.createdOwnerPhone = user.companyPhoneNumber!;
    data.data.createdOwnerCompanyName = user.companyName!;

    // UTM info.
    data.data.utmCampaign = user.utmCampaign!;
    data.data.utmSource = user.utmSource!;
    data.data.utmMedium = user.utmMedium!;
    data.data.utmTerm = user.utmTerm!;
    data.data.utmContent = user.utmContent!;
    data.data.utmUrl = user.utmUrl!;

    // Ad attribution info (click IDs + first touch).
    data.data.clickIds = user.clickIds!;
    data.data.firstTouchAttribution = user.firstTouchAttribution!;

    // Set default number prefixes.
    if (!data.data.incidentNumberPrefix) {
      data.data.incidentNumberPrefix = "INC-";
    }

    if (!data.data.alertNumberPrefix) {
      data.data.alertNumberPrefix = "ALT-";
    }

    if (!data.data.scheduledMaintenanceNumberPrefix) {
      data.data.scheduledMaintenanceNumberPrefix = "SM-";
    }

    if (!data.data.incidentEpisodeNumberPrefix) {
      data.data.incidentEpisodeNumberPrefix = "IE-";
    }

    if (!data.data.alertEpisodeNumberPrefix) {
      data.data.alertEpisodeNumberPrefix = "AE-";
    }

    return Promise.resolve({ createBy: data, carryForward: null });
  }

  @CaptureSpan()
  protected override async onBeforeUpdate(
    updateBy: UpdateBy<Model>,
  ): Promise<OnUpdate<Model>> {
    if (
      !updateBy.props.isRoot &&
      (updateBy.data.requireSsoForLogin !== undefined ||
        updateBy.data.requireSsoWithSsoProviderId !== undefined)
    ) {
      const projects: Array<Model> = await this.findBy({
        query: updateBy.query,
        props: { isRoot: true },
        limit: LIMIT_MAX,
        skip: 0,
        select: { _id: true, castWorkspaceId: true },
      });

      if (
        projects.some((project: Model) => {
          return Boolean(project.castWorkspaceId);
        })
      ) {
        throw new BadDataException(
          "Cast-managed Operations project identity policy is controlled by the owning Cast workspace",
        );
      }
    }

    /*
     * Any project field could have changed; invalidate the in-process cache
     * of the SSO flag. Cheap to refetch on the next request.
     */
    if (updateBy.data.requireSsoForLogin !== undefined) {
      this.requireSsoForLoginCache.clear();
    }

    if (updateBy.data.requireSsoWithSsoProviderId !== undefined) {
      this.requireSsoWithSsoProviderIdCache.clear();
    }

    return { updateBy, carryForward: [] };
  }

  /**
   * Names of every row of `service` already scoped to `projectId`.
   *
   * The addDefault* seeders below each create a fixed set of named rows on a
   * column that is unique per project (@UniqueColumnBy("projectId") on `name`).
   * The SAME defaults are created in two places: here, in the project-create
   * hooks, AND by backfill data migrations (e.g.
   * AddDefaultAlertSeverityAndStateToExistingProjects). Creating a name that
   * already exists throws "<X> with the same name already exists" in
   * DatabaseService.checkUniqueColumnBy — and because the DataMigration runner
   * halts the whole chain at the first failure, that single throw freezes every
   * later migration. Each seeder guards its creates against this set so both
   * paths are idempotent / safe to re-run.
   */
  private async getExistingProjectScopedNames<TBaseModel extends BaseModel>(
    service: DatabaseService<TBaseModel>,
    projectId: ObjectID,
  ): Promise<Set<string | undefined>> {
    const items: Array<TBaseModel> = await service.findBy({
      query: {
        projectId: projectId,
      } as Query<TBaseModel>,
      select: {
        name: true,
      } as Select<TBaseModel>,
      skip: 0,
      limit: LIMIT_MAX,
      props: {
        isRoot: true,
      },
    });

    return new Set(
      items.map((item: TBaseModel): string | undefined => {
        return (item as { name?: string | undefined }).name;
      }),
    );
  }

  private async addDefaultScheduledMaintenanceState(
    createdItem: Model,
  ): Promise<Model> {
    const projectId: ObjectID = createdItem.id!;

    // Idempotent — see getExistingProjectScopedNames.
    const existingNames: Set<string | undefined> =
      await this.getExistingProjectScopedNames(
        ScheduledMaintenanceStateService,
        projectId,
      );

    if (!existingNames.has("Scheduled")) {
      const createdScheduledMaintenanceState: ScheduledMaintenanceState =
        new ScheduledMaintenanceState();
      createdScheduledMaintenanceState.name = "Scheduled";
      createdScheduledMaintenanceState.description =
        "When an event is scheduled, it belongs to this state";
      createdScheduledMaintenanceState.color = Black;
      createdScheduledMaintenanceState.isScheduledState = true;
      createdScheduledMaintenanceState.projectId = projectId;
      createdScheduledMaintenanceState.order = 1;

      await ScheduledMaintenanceStateService.create({
        data: createdScheduledMaintenanceState,
        props: {
          isRoot: true,
        },
      });
    }

    if (!existingNames.has("Ongoing")) {
      const ongoingScheduledMaintenanceState: ScheduledMaintenanceState =
        new ScheduledMaintenanceState();
      ongoingScheduledMaintenanceState.name = "Ongoing";
      ongoingScheduledMaintenanceState.description =
        "When an event is ongoing, it belongs to this state.";
      ongoingScheduledMaintenanceState.color = Yellow;
      ongoingScheduledMaintenanceState.isOngoingState = true;
      ongoingScheduledMaintenanceState.projectId = projectId;
      ongoingScheduledMaintenanceState.order = 2;

      await ScheduledMaintenanceStateService.create({
        data: ongoingScheduledMaintenanceState,
        props: {
          isRoot: true,
        },
      });
    }

    if (!existingNames.has("Ended")) {
      const endedScheduledMaintenanceState: ScheduledMaintenanceState =
        new ScheduledMaintenanceState();
      endedScheduledMaintenanceState.name = "Ended";
      endedScheduledMaintenanceState.description =
        "Scheduled maintenance events switch to this state when they end.";
      endedScheduledMaintenanceState.color = new Color("#4A4A4A");
      endedScheduledMaintenanceState.isEndedState = true;
      endedScheduledMaintenanceState.projectId = projectId;
      endedScheduledMaintenanceState.order = 3;

      await ScheduledMaintenanceStateService.create({
        data: endedScheduledMaintenanceState,
        props: {
          isRoot: true,
        },
      });
    }

    if (!existingNames.has("Completed")) {
      const completedScheduledMaintenanceState: ScheduledMaintenanceState =
        new ScheduledMaintenanceState();
      completedScheduledMaintenanceState.name = "Completed";
      completedScheduledMaintenanceState.description =
        "When an event is completed, it belongs to this state.";
      completedScheduledMaintenanceState.color = Green;
      completedScheduledMaintenanceState.isResolvedState = true;
      completedScheduledMaintenanceState.projectId = projectId;
      completedScheduledMaintenanceState.order = 4;

      await ScheduledMaintenanceStateService.create({
        data: completedScheduledMaintenanceState,
        props: {
          isRoot: true,
        },
      });
    }

    return createdItem;
  }

  @CaptureSpan()
  protected override async onCreateSuccess(
    _onCreate: OnCreate<Model>,
    createdItem: Model,
  ): Promise<Model> {
    /*
     * Each addDefault* method only reads `createdItem.id` and writes rows to a
     * distinct table; none of them mutate `createdItem`. Running them in
     * parallel cuts the onCreate hook latency from sum-of-8 sequential DB
     * round-trips to max-of-8, which removes ~hundreds of ms on project
     * create.
     */
    await Promise.all([
      this.addDefaultIncidentSeverity(createdItem),
      this.addDefaultAlertSeverity(createdItem),
      this.addDefaultProjectTeams(createdItem),
      this.addDefaultMonitorStatus(createdItem),
      this.addDefaultIncidentState(createdItem),
      this.addDefaultScheduledMaintenanceState(createdItem),
      this.addDefaultAlertState(createdItem),
      this.addDefaultIncidentRoles(createdItem),
    ]);

    if (createdItem.createdOwnerEmail) {
      ProductAnalytics.capture({
        event: "server/project_created",
        distinctId: createdItem.createdOwnerEmail.toString(),
        properties: {
          project_id: createdItem.id?.toString() || "",
          project_name: createdItem.name?.toString() || "",
          utm_source: createdItem.utmSource || "",
          utm_medium: createdItem.utmMedium || "",
          utm_campaign: createdItem.utmCampaign || "",
          click_ids: createdItem.clickIds || {},
        },
      });
    }

    if (NotificationSlackWebhookOnCreateProject) {
      // fetch project again.
      const project: Model | null = await this.findOneById({
        id: createdItem.id!,
        select: {
          name: true,
          _id: true,
          createdOwnerName: true,
          createdOwnerEmail: true,
          createdByUserId: true,
        },
        props: {
          isRoot: true,
        },
      });

      if (!project) {
        throw new BadDataException("Project not found");
      }

      let slackMessage: string = `*Project Created:*
*Project Name:* ${project.name?.toString() || "N/A"}
*Project ID:* ${project.id?.toString() || "N/A"}
`;

      if (project.createdOwnerName && project.createdOwnerEmail) {
        slackMessage += `*Created By:* ${project?.createdOwnerName?.toString() + " (" + project.createdOwnerEmail.toString() + ")" || "N/A"}
`;

        SlackUtil.sendMessageToChannelViaIncomingWebhook({
          url: URL.fromString(NotificationSlackWebhookOnCreateProject),
          text: slackMessage,
        }).catch((error: Exception) => {
          logger.error("Error sending slack message: " + error, {
            projectId: createdItem.id?.toString(),
          } as LogAttributes);
        });
      }
    }

    return createdItem;
  }

  private async addDefaultIncidentState(createdItem: Model): Promise<Model> {
    const projectId: ObjectID = createdItem.id!;

    // Idempotent — see getExistingProjectScopedNames.
    const existingNames: Set<string | undefined> =
      await this.getExistingProjectScopedNames(IncidentStateService, projectId);

    if (!existingNames.has("Identified")) {
      const createdIncidentState: IncidentState = new IncidentState();
      createdIncidentState.name = "Identified";
      createdIncidentState.description =
        "When an incident is created, it belongs to this state";
      createdIncidentState.color = Red;
      createdIncidentState.isCreatedState = true;
      createdIncidentState.projectId = projectId;
      createdIncidentState.order = 1;

      await IncidentStateService.create({
        data: createdIncidentState,
        props: {
          isRoot: true,
        },
      });
    }

    if (!existingNames.has("Acknowledged")) {
      const acknowledgedIncidentState: IncidentState = new IncidentState();
      acknowledgedIncidentState.name = "Acknowledged";
      acknowledgedIncidentState.description =
        "When an incident is acknowledged, it belongs to this state.";
      acknowledgedIncidentState.color = Yellow;
      acknowledgedIncidentState.isAcknowledgedState = true;
      acknowledgedIncidentState.projectId = projectId;
      acknowledgedIncidentState.order = 2;

      await IncidentStateService.create({
        data: acknowledgedIncidentState,
        props: {
          isRoot: true,
        },
      });
    }

    if (!existingNames.has("Resolved")) {
      const resolvedIncidentState: IncidentState = new IncidentState();
      resolvedIncidentState.name = "Resolved";
      resolvedIncidentState.description =
        "When an incident is resolved, it belongs to this state.";
      resolvedIncidentState.color = Green;
      resolvedIncidentState.isResolvedState = true;
      resolvedIncidentState.projectId = projectId;
      resolvedIncidentState.order = 3;

      await IncidentStateService.create({
        data: resolvedIncidentState,
        props: {
          isRoot: true,
        },
      });
    }

    return createdItem;
  }

  @CaptureSpan()
  public async addDefaultAlertState(createdItem: Model): Promise<Model> {
    const projectId: ObjectID = createdItem.id!;

    // Idempotent — see getExistingProjectScopedNames.
    const existingNames: Set<string | undefined> =
      await this.getExistingProjectScopedNames(AlertStateService, projectId);

    if (!existingNames.has("Identified")) {
      const createdAlertState: AlertState = new AlertState();
      createdAlertState.name = "Identified";
      createdAlertState.description =
        "When an alert is created, it belongs to this state";
      createdAlertState.color = Red;
      createdAlertState.isCreatedState = true;
      createdAlertState.projectId = projectId;
      createdAlertState.order = 1;

      await AlertStateService.create({
        data: createdAlertState,
        props: {
          isRoot: true,
        },
      });
    }

    if (!existingNames.has("Acknowledged")) {
      const acknowledgedAlertState: AlertState = new AlertState();
      acknowledgedAlertState.name = "Acknowledged";
      acknowledgedAlertState.description =
        "When an alert is acknowledged, it belongs to this state.";
      acknowledgedAlertState.color = Yellow;
      acknowledgedAlertState.isAcknowledgedState = true;
      acknowledgedAlertState.projectId = projectId;
      acknowledgedAlertState.order = 2;

      await AlertStateService.create({
        data: acknowledgedAlertState,
        props: {
          isRoot: true,
        },
      });
    }

    if (!existingNames.has("Resolved")) {
      const resolvedAlertState: AlertState = new AlertState();
      resolvedAlertState.name = "Resolved";
      resolvedAlertState.description =
        "When an incident is resolved, it belongs to this state.";
      resolvedAlertState.color = Green;
      resolvedAlertState.isResolvedState = true;
      resolvedAlertState.projectId = projectId;
      resolvedAlertState.order = 3;

      await AlertStateService.create({
        data: resolvedAlertState,
        props: {
          isRoot: true,
        },
      });
    }

    return createdItem;
  }

  @CaptureSpan()
  public async addDefaultAlertSeverity(createdItem: Model): Promise<Model> {
    const projectId: ObjectID = createdItem.id!;

    // Idempotent — see getExistingProjectScopedNames.
    const existingNames: Set<string | undefined> =
      await this.getExistingProjectScopedNames(AlertSeverityService, projectId);

    if (!existingNames.has("High")) {
      const highSeverity: AlertSeverity = new AlertSeverity();
      highSeverity.name = "High";
      highSeverity.description =
        "Issues causing very high impact to customers. Immediate attention is required.";
      highSeverity.color = Moroon500;
      highSeverity.projectId = projectId;
      highSeverity.order = 1;

      await AlertSeverityService.create({
        data: highSeverity,
        props: {
          isRoot: true,
        },
      });
    }

    if (!existingNames.has("Low")) {
      const lowSeverity: AlertSeverity = new AlertSeverity();
      lowSeverity.name = "Low";
      lowSeverity.description = "Issues causing low impact to customers.";
      lowSeverity.color = Yellow500;
      lowSeverity.projectId = projectId;
      lowSeverity.order = 2;

      await AlertSeverityService.create({
        data: lowSeverity,
        props: {
          isRoot: true,
        },
      });
    }

    return createdItem;
  }

  private async addDefaultIncidentSeverity(createdItem: Model): Promise<Model> {
    const projectId: ObjectID = createdItem.id!;

    // Idempotent — see getExistingProjectScopedNames.
    const existingNames: Set<string | undefined> =
      await this.getExistingProjectScopedNames(
        IncidentSeverityService,
        projectId,
      );

    if (!existingNames.has("Critical Incident")) {
      const criticalIncident: IncidentSeverity = new IncidentSeverity();
      criticalIncident.name = "Critical Incident";
      criticalIncident.description =
        "Issues causing very high impact to customers. Immediate response is required. Examples include a full outage, or a data breach.";
      criticalIncident.color = Moroon500;
      criticalIncident.projectId = projectId;
      criticalIncident.order = 1;

      await IncidentSeverityService.create({
        data: criticalIncident,
        props: {
          isRoot: true,
        },
      });
    }

    if (!existingNames.has("Major Incident")) {
      const majorIncident: IncidentSeverity = new IncidentSeverity();
      majorIncident.name = "Major Incident";
      majorIncident.description =
        "Issues causing significant impact. Immediate response is usually required. We might have some workarounds that mitigate the impact on customers. Examples include an important sub-system failing.";
      majorIncident.color = Red;
      majorIncident.projectId = projectId;
      majorIncident.order = 2;

      await IncidentSeverityService.create({
        data: majorIncident,
        props: {
          isRoot: true,
        },
      });
    }

    if (!existingNames.has("Minor Incident")) {
      const minorIncident: IncidentSeverity = new IncidentSeverity();
      minorIncident.name = "Minor Incident";
      minorIncident.description =
        "Issues with low impact, which can usually be handled within working hours. Most customers are unlikely to notice any problems. Examples include a slight drop in application performance.";
      minorIncident.color = Yellow;
      minorIncident.projectId = projectId;
      minorIncident.order = 3;

      await IncidentSeverityService.create({
        data: minorIncident,
        props: {
          isRoot: true,
        },
      });
    }

    return createdItem;
  }

  public async addDefaultIncidentRoles(createdItem: Model): Promise<Model> {
    const projectId: ObjectID = createdItem.id!;

    // Idempotent — see getExistingProjectScopedNames.
    const existingNames: Set<string | undefined> =
      await this.getExistingProjectScopedNames(IncidentRoleService, projectId);

    if (!existingNames.has("Incident Commander")) {
      const incidentCommander: IncidentRole = new IncidentRole();
      incidentCommander.name = "Incident Commander";
      incidentCommander.description =
        "Primary decision maker during an incident. Responsible for coordinating the response and making final decisions.";
      incidentCommander.color = Purple500;
      incidentCommander.roleIcon = IconProp.ShieldCheck;
      incidentCommander.projectId = projectId;
      incidentCommander.isPrimaryRole = true;
      incidentCommander.isDeleteable = false;

      await IncidentRoleService.create({
        data: incidentCommander,
        props: {
          isRoot: true,
        },
      });
    }

    if (!existingNames.has("Responder")) {
      const responder: IncidentRole = new IncidentRole();
      responder.name = "Responder";
      responder.description =
        "Active participant in incident resolution. Performs hands-on work to resolve the incident.";
      responder.color = Blue500;
      responder.roleIcon = IconProp.Wrench;
      responder.projectId = projectId;

      await IncidentRoleService.create({
        data: responder,
        props: {
          isRoot: true,
        },
      });
    }

    if (!existingNames.has("Communications Lead")) {
      const communicationsLead: IncidentRole = new IncidentRole();
      communicationsLead.name = "Communications Lead";
      communicationsLead.description =
        "Handles stakeholder communication and status updates during an incident.";
      communicationsLead.color = Teal500;
      communicationsLead.roleIcon = IconProp.Announcement;
      communicationsLead.projectId = projectId;

      await IncidentRoleService.create({
        data: communicationsLead,
        props: {
          isRoot: true,
        },
      });
    }

    if (!existingNames.has("Observer")) {
      const observer: IncidentRole = new IncidentRole();
      observer.name = "Observer";
      observer.description =
        "Read-only participant who monitors the incident without active involvement.";
      observer.color = Gray500;
      observer.roleIcon = IconProp.Activity;
      observer.projectId = projectId;
      observer.canAssignMultipleUsers = true;

      await IncidentRoleService.create({
        data: observer,
        props: {
          isRoot: true,
        },
      });
    }

    return createdItem;
  }

  private async addDefaultMonitorStatus(createdItem: Model): Promise<Model> {
    const projectId: ObjectID = createdItem.id!;

    // Idempotent — see getExistingProjectScopedNames.
    const existingNames: Set<string | undefined> =
      await this.getExistingProjectScopedNames(MonitorStatusService, projectId);

    if (!existingNames.has("Operational")) {
      const operationalStatus: MonitorStatus = new MonitorStatus();
      operationalStatus.name = "Operational";
      operationalStatus.description = "Monitor operating normally";
      operationalStatus.projectId = projectId;
      operationalStatus.priority = 1;
      operationalStatus.isOperationalState = true;
      operationalStatus.color = Green;

      await MonitorStatusService.create({
        data: operationalStatus,
        props: {
          isRoot: true,
        },
      });
    }

    if (!existingNames.has("Degraded")) {
      const degradedStatus: MonitorStatus = new MonitorStatus();
      degradedStatus.name = "Degraded";
      degradedStatus.description =
        "Monitor is operating at reduced performance.";
      degradedStatus.priority = 2;
      degradedStatus.projectId = projectId;
      degradedStatus.color = Yellow;

      await MonitorStatusService.create({
        data: degradedStatus,
        props: {
          isRoot: true,
        },
      });
    }

    if (!existingNames.has("Offline")) {
      const downStatus: MonitorStatus = new MonitorStatus();
      downStatus.name = "Offline";
      downStatus.description = "Monitor is offline.";
      downStatus.isOfflineState = true;
      downStatus.projectId = projectId;
      downStatus.priority = 3;
      downStatus.color = Red;

      await MonitorStatusService.create({
        data: downStatus,
        props: {
          isRoot: true,
        },
      });
    }

    return createdItem;
  }

  private async addDefaultProjectTeams(createdItem: Model): Promise<Model> {
    // add a team member.

    // Owner Team.
    let ownerTeam: Team = new Team();
    ownerTeam.projectId = createdItem.id!;
    ownerTeam.name = "Owners";
    ownerTeam.shouldHaveAtLeastOneMember = true;
    ownerTeam.isPermissionsEditable = false;
    ownerTeam.isTeamEditable = false;
    ownerTeam.isTeamDeleteable = false;
    ownerTeam.description =
      "This team is for project owners. Adding team members to this team will give them root level permissions.";

    ownerTeam = await TeamService.create({
      data: ownerTeam,
      props: {
        isRoot: true,
      },
    });

    // Add current user to owners team.

    let ownerTeamMember: TeamMember = new TeamMember();
    ownerTeamMember.projectId = createdItem.id!;
    ownerTeamMember.userId = createdItem.createdByUserId!;
    ownerTeamMember.hasAcceptedInvitation = true;
    ownerTeamMember.invitationAcceptedAt = OperationsDate.getCurrentDate();
    ownerTeamMember.teamId = ownerTeam.id!;

    ownerTeamMember = await TeamMemberService.create({
      data: ownerTeamMember,
      props: {
        isRoot: true,
        ignoreHooks: true,
      },
    });

    // Add permissions for this team.

    const ownerPermissions: TeamPermission = new TeamPermission();
    ownerPermissions.permission = Permission.ProjectOwner;
    ownerPermissions.teamId = ownerTeam.id!;
    ownerPermissions.projectId = createdItem.id!;

    await TeamPermissionService.create({
      data: ownerPermissions,
      props: {
        isRoot: true,
        ignoreHooks: true,
      },
    });

    // Admin Team.
    const adminTeam: Team = new Team();
    adminTeam.projectId = createdItem.id!;
    adminTeam.name = "Admin";
    adminTeam.isPermissionsEditable = false;
    adminTeam.isTeamDeleteable = false;
    adminTeam.isTeamEditable = false;
    adminTeam.description =
      "This team is for project admins. Admins can invite members to any team and create project resources.";

    await TeamService.create({
      data: adminTeam,
      props: {
        isRoot: true,
      },
    });

    const adminPermissions: TeamPermission = new TeamPermission();
    adminPermissions.permission = Permission.ProjectAdmin;
    adminPermissions.teamId = adminTeam.id!;
    adminPermissions.projectId = createdItem.id!;

    await TeamPermissionService.create({
      data: adminPermissions,
      props: {
        isRoot: true,
        ignoreHooks: true,
      },
    });

    // Members Team.
    const memberTeam: Team = new Team();
    memberTeam.projectId = createdItem.id!;
    memberTeam.isPermissionsEditable = true;
    memberTeam.name = "Members";
    memberTeam.isTeamDeleteable = true;
    memberTeam.description =
      "This team is for project members. Members can interact with any project resources like monitors, incidents, etc.";

    await TeamService.create({
      data: memberTeam,
      props: {
        isRoot: true,
      },
    });

    const memberPermissions: TeamPermission = new TeamPermission();
    memberPermissions.permission = Permission.ProjectMember;
    memberPermissions.teamId = memberTeam.id!;
    memberPermissions.projectId = createdItem.id!;

    await TeamPermissionService.create({
      data: memberPermissions,
      props: {
        isRoot: true,
        ignoreHooks: true,
      },
    });

    await AccessTokenService.refreshUserAllPermissions(
      createdItem.createdByUserId!,
    );

    const user: User | null = await UserService.findOneById({
      id: createdItem.createdByUserId!,
      props: {
        isRoot: true,
      },
      select: {
        isEmailVerified: true,
        email: true,
      },
    });

    if (user && user.isEmailVerified) {
      await UserNotificationRuleService.addDefaultNotificationRuleForUser(
        createdItem.id!,
        user.id!,
        user.email!,
      );

      await UserNotificationSettingService.addDefaultNotificationSettingsForUser(
        user.id!,
        createdItem.id!,
      );
    }

    return createdItem;
  }

  @CaptureSpan()
  public async updateLastActive(projectId: ObjectID): Promise<void> {
    const key: string = projectId.toString();
    if (this.lastActiveCache.has(key)) {
      return;
    }
    /*
     * Set BEFORE the await so a burst of concurrent requests collapses to one
     * UPDATE per node per 60s window instead of all firing in parallel.
     */
    this.lastActiveCache.set(key, true, 60_000);

    /*
     * Fire-and-forget — `lastActive` is a soft-real-time field and the
     * caller (auth middleware) shouldn't pay a Postgres round-trip for it.
     */
    void this.updateOneById({
      id: projectId,
      data: {
        lastActive: OperationsDate.getCurrentDate(),
      },
      props: {
        isRoot: true,
      },
    }).catch((err: Error) => {
      // Drop the cache entry so a retry can fire within the same TTL window.
      this.lastActiveCache.delete(key);
      logger.error(
        `Failed to update Project.lastActive for ${key}: ${err.message}`,
      );
    });
  }

  /**
   * Returns whether the given project requires SSO for login. Cached for
   * 60s in-process — middleware calls this on every authenticated request.
   */
  @CaptureSpan()
  public async getRequireSsoForLogin(projectId: ObjectID): Promise<boolean> {
    const key: string = projectId.toString();
    const cached: boolean | undefined = this.requireSsoForLoginCache.get(key);
    if (cached !== undefined) {
      return cached;
    }

    const project: Model | null = await this.findOneById({
      id: projectId,
      select: { requireSsoForLogin: true, requireSsoWithSsoProviderId: true },
      props: { isRoot: true },
    });

    if (!project) {
      // Don't cache "not found" — let the caller decide how to handle it.
      throw new BadDataException("Project not found");
    }

    const value: boolean = Boolean(project.requireSsoForLogin);
    this.requireSsoForLoginCache.set(key, value, 60_000);
    this.requireSsoWithSsoProviderIdCache.set(
      key,
      project.requireSsoWithSsoProviderId
        ? project.requireSsoWithSsoProviderId.toString()
        : null,
      60_000,
    );
    return value;
  }

  /**
   * Returns the specific SSO provider id a project requires for SSO-enforced
   * login, or null when any trusted provider is acceptable. Cached for 60s and
   * populated by `getRequireSsoForLogin`, so the enforce path stays one query.
   */
  @CaptureSpan()
  public async getRequireSsoWithSsoProviderId(
    projectId: ObjectID,
  ): Promise<ObjectID | null> {
    const key: string = projectId.toString();
    const cached: string | null | undefined =
      this.requireSsoWithSsoProviderIdCache.get(key);
    if (cached !== undefined) {
      return cached ? new ObjectID(cached) : null;
    }

    // Populate both caches via the existing single-query path.
    await this.getRequireSsoForLogin(projectId);

    const populated: string | null | undefined =
      this.requireSsoWithSsoProviderIdCache.get(key);
    return populated ? new ObjectID(populated) : null;
  }

  @CaptureSpan()
  public async getOwners(projectId: ObjectID): Promise<Array<User>> {
    if (!projectId) {
      throw new BadDataException("Project ID is required");
    }

    // get teams with project owner permissions.
    const teamPermissions: Array<TeamPermission> =
      await TeamPermissionService.findBy({
        query: {
          projectId: projectId,
          permission: Permission.ProjectOwner,
        },
        props: {
          isRoot: true,
        },
        limit: LIMIT_MAX,
        skip: 0,
        select: {
          teamId: true,
        },
      });

    if (teamPermissions.length === 0) {
      return [];
    }

    const teamIds: Array<ObjectID> = teamPermissions.map(
      (item: TeamPermission) => {
        return item.teamId!;
      },
    );

    return TeamMemberService.getUsersInTeams(teamIds);
  }

  @CaptureSpan()
  protected override async onBeforeFind(
    findBy: FindBy<Model>,
  ): Promise<OnFind<Model>> {
    /*
     * if user has no project id, then he should not be able to access any project.
     * Master admins should be able to access all projects.
     */
    if (
      !findBy.props.isRoot &&
      !findBy.props.isMasterAdmin &&
      (!findBy.props.userGlobalAccessPermission?.projectIds ||
        findBy.props.userGlobalAccessPermission?.projectIds.length === 0)
    ) {
      findBy.props.isRoot = true;
      findBy.query._id = ObjectID.getZeroObjectID().toString(); // should not get any projects.
    }

    return { findBy, carryForward: null };
  }

  @CaptureSpan()
  protected override async onBeforeDelete(
    deleteBy: DeleteBy<Model>,
  ): Promise<OnDelete<Model>> {
    const projects: Array<Model> = await this.findBy({
      query: deleteBy.query,
      props: {
        isRoot: true,
      },
      limit: LIMIT_MAX,
      skip: 0,
      select: {
        _id: true,
        castWorkspaceId: true,
        name: true,
        createdAt: true,
        createdByUser: {
          name: true,
          email: true,
        },
      },
    });

    if (
      !deleteBy.props.isRoot &&
      projects.some((project: Model) => {
        return Boolean(project.castWorkspaceId);
      })
    ) {
      throw new BadDataException(
        "Cast-managed Operations projects must be removed from the owning Cast workspace",
      );
    }

    return { deleteBy, carryForward: projects };
  }

  @CaptureSpan()
  protected override async onDeleteSuccess(
    onDelete: OnDelete<Model>,
    _itemIdsBeforeDelete: ObjectID[],
  ): Promise<OnDelete<Model>> {
    if (NotificationSlackWebhookOnDeleteProject) {
      for (const project of onDelete.carryForward) {
        let slackMessage: string = `*Project Deleted:*
*Project Name:* ${project.name?.toString() || "N/A"}
*Project ID:* ${project._id?.toString() || "N/A"}
*Project Created Date:* ${project.createdAt ? new Date(project.createdAt).toUTCString() : "N/A"}
`;

        if (
          project.createdByUser &&
          project.createdByUser.name &&
          project.createdByUser.email
        ) {
          slackMessage += `*Created By:* ${project?.createdByUser.name?.toString() + " (" + project.createdByUser.email.toString() + ")" || "N/A"}
`;
        }

        SlackUtil.sendMessageToChannelViaIncomingWebhook({
          url: URL.fromString(NotificationSlackWebhookOnDeleteProject),
          text: slackMessage,
        }).catch((err: Error) => {
          // log this error but do not throw it. Not important enough to stop the process.
          logger.error(err, {
            projectId: project?.id?.toString(),
          } as LogAttributes);
        });
      }
    }

    // get project id

    return onDelete;
  }

  @CaptureSpan()
  public async sendEmailToProjectOwners(
    projectId: ObjectID,
    subject: string,
    message: string,
  ): Promise<void> {
    const owners: Array<User> = await this.getOwners(projectId);

    if (owners.length === 0) {
      return;
    }

    for (const owner of owners) {
      MailService.sendMail(
        {
          toEmail: owner.email!,
          templateType: EmailTemplateType.SimpleMessage,
          vars: {
            subject: subject,
            message: message,
          },
          subject: subject,
        },
        {
          projectId,
          userId: owner.id!,
        },
      ).catch((err: Error) => {
        logger.error(err, {
          projectId: projectId?.toString(),
        } as LogAttributes);
      });
    }
  }

  public getActiveProjectStatusQuery(): Query<Model> {
    return {};
  }

  @CaptureSpan()
  public async getAllActiveProjects(params?: {
    select?: Select<Model>;
    props?: DatabaseCommonInteractionProps;
    skip?: PositiveNumber | number;
    limit?: PositiveNumber | number;
  }): Promise<Array<Model>> {
    const select: Select<Model> | undefined =
      params?.select || ({ _id: true } as Select<Model>);
    const props: DatabaseCommonInteractionProps = params?.props || {
      isRoot: true,
    };

    return await this.findAllBy({
      query: this.getActiveProjectStatusQuery(),
      select,
      props,
      skip: params?.skip,
      limit: params?.limit,
    });
  }

  @CaptureSpan()
  public async getProjectLinkInDashboard(projectId: ObjectID): Promise<URL> {
    const dashboardUrl: URL = await DatabaseConfig.getDashboardUrl();

    return URL.fromString(dashboardUrl.toString()).addRoute(
      `/${projectId.toString()}`,
    );
  }

  @CaptureSpan()
  public async incrementAndGetIncidentCounter(
    projectId: ObjectID,
  ): Promise<{ counter: number; prefix: string | undefined }> {
    const mutex: SemaphoreMutex = await Semaphore.lock({
      key: projectId.toString(),
      namespace: "ProjectService.incidentCounter",
    });

    try {
      await this.atomicIncrementColumnValueByOne({
        id: projectId,
        columnName: "incidentCounter",
      });

      const project: Model | null = await this.findOneById({
        id: projectId,
        select: {
          incidentCounter: true,
          incidentNumberPrefix: true,
        },
        props: {
          isRoot: true,
        },
      });

      if (!project || project.incidentCounter === undefined) {
        throw new BadDataException(
          `Could not read incidentCounter for project ${projectId.toString()}`,
        );
      }

      return {
        counter: project.incidentCounter,
        prefix: project.incidentNumberPrefix,
      };
    } finally {
      await Semaphore.release(mutex);
    }
  }

  @CaptureSpan()
  public async incrementAndGetAlertCounter(
    projectId: ObjectID,
  ): Promise<{ counter: number; prefix: string | undefined }> {
    const mutex: SemaphoreMutex = await Semaphore.lock({
      key: projectId.toString(),
      namespace: "ProjectService.alertCounter",
    });

    try {
      await this.atomicIncrementColumnValueByOne({
        id: projectId,
        columnName: "alertCounter",
      });

      const project: Model | null = await this.findOneById({
        id: projectId,
        select: {
          alertCounter: true,
          alertNumberPrefix: true,
        },
        props: {
          isRoot: true,
        },
      });

      if (!project || project.alertCounter === undefined) {
        throw new BadDataException(
          `Could not read alertCounter for project ${projectId.toString()}`,
        );
      }

      return {
        counter: project.alertCounter,
        prefix: project.alertNumberPrefix,
      };
    } finally {
      await Semaphore.release(mutex);
    }
  }

  @CaptureSpan()
  public async incrementAndGetScheduledMaintenanceCounter(
    projectId: ObjectID,
  ): Promise<{ counter: number; prefix: string | undefined }> {
    const mutex: SemaphoreMutex = await Semaphore.lock({
      key: projectId.toString(),
      namespace: "ProjectService.scheduledMaintenanceCounter",
    });

    try {
      await this.atomicIncrementColumnValueByOne({
        id: projectId,
        columnName: "scheduledMaintenanceCounter",
      });

      const project: Model | null = await this.findOneById({
        id: projectId,
        select: {
          scheduledMaintenanceCounter: true,
          scheduledMaintenanceNumberPrefix: true,
        },
        props: {
          isRoot: true,
        },
      });

      if (!project || project.scheduledMaintenanceCounter === undefined) {
        throw new BadDataException(
          `Could not read scheduledMaintenanceCounter for project ${projectId.toString()}`,
        );
      }

      return {
        counter: project.scheduledMaintenanceCounter,
        prefix: project.scheduledMaintenanceNumberPrefix,
      };
    } finally {
      await Semaphore.release(mutex);
    }
  }

  @CaptureSpan()
  public async incrementAndGetIncidentEpisodeCounter(
    projectId: ObjectID,
  ): Promise<{ counter: number; prefix: string | undefined }> {
    const mutex: SemaphoreMutex = await Semaphore.lock({
      key: projectId.toString(),
      namespace: "ProjectService.incidentEpisodeCounter",
    });

    try {
      await this.atomicIncrementColumnValueByOne({
        id: projectId,
        columnName: "incidentEpisodeCounter",
      });

      const project: Model | null = await this.findOneById({
        id: projectId,
        select: {
          incidentEpisodeCounter: true,
          incidentEpisodeNumberPrefix: true,
        },
        props: {
          isRoot: true,
        },
      });

      if (!project || project.incidentEpisodeCounter === undefined) {
        throw new BadDataException(
          `Could not read incidentEpisodeCounter for project ${projectId.toString()}`,
        );
      }

      return {
        counter: project.incidentEpisodeCounter,
        prefix: project.incidentEpisodeNumberPrefix,
      };
    } finally {
      await Semaphore.release(mutex);
    }
  }

  @CaptureSpan()
  public async incrementAndGetAlertEpisodeCounter(
    projectId: ObjectID,
  ): Promise<{ counter: number; prefix: string | undefined }> {
    const mutex: SemaphoreMutex = await Semaphore.lock({
      key: projectId.toString(),
      namespace: "ProjectService.alertEpisodeCounter",
    });

    try {
      await this.atomicIncrementColumnValueByOne({
        id: projectId,
        columnName: "alertEpisodeCounter",
      });

      const project: Model | null = await this.findOneById({
        id: projectId,
        select: {
          alertEpisodeCounter: true,
          alertEpisodeNumberPrefix: true,
        },
        props: {
          isRoot: true,
        },
      });

      if (!project || project.alertEpisodeCounter === undefined) {
        throw new BadDataException(
          `Could not read alertEpisodeCounter for project ${projectId.toString()}`,
        );
      }

      return {
        counter: project.alertEpisodeCounter,
        prefix: project.alertEpisodeNumberPrefix,
      };
    } finally {
      await Semaphore.release(mutex);
    }
  }

  /*
   * Allocate the next AI task number for a project. Unlike the counters
   * above there is no companion prefix column — AI task numbers are not
   * user-customizable, so the caller renders a plain "#N".
   */
  @CaptureSpan()
  public async incrementAndGetAIRunCounter(
    projectId: ObjectID,
  ): Promise<number> {
    const mutex: SemaphoreMutex = await Semaphore.lock({
      key: projectId.toString(),
      namespace: "ProjectService.aiRunCounter",
    });

    try {
      await this.atomicIncrementColumnValueByOne({
        id: projectId,
        columnName: "aiRunCounter",
      });

      const project: Model | null = await this.findOneById({
        id: projectId,
        select: {
          aiRunCounter: true,
        },
        props: {
          isRoot: true,
        },
      });

      if (!project || project.aiRunCounter === undefined) {
        throw new BadDataException(
          `Could not read aiRunCounter for project ${projectId.toString()}`,
        );
      }

      return project.aiRunCounter;
    } finally {
      await Semaphore.release(mutex);
    }
  }

  @CaptureSpan()
  public async isSMSNotificationsEnabled(
    projectId: ObjectID,
  ): Promise<boolean> {
    const project: Model | null = await this.findOneById({
      id: projectId,
      select: {
        enableSmsNotifications: true,
      },
      props: {
        isRoot: true,
      },
    });

    if (!project) {
      throw new BadDataException("Project not found");
    }

    return Boolean(project.enableSmsNotifications);
  }
}
export default new ProjectService();
