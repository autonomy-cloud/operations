import Incident from "Common/Models/DatabaseModels/Incident";
import IncidentSeverity from "Common/Models/DatabaseModels/IncidentSeverity";
import IncidentState from "Common/Models/DatabaseModels/IncidentState";
import ServiceModel from "Common/Models/DatabaseModels/Service";
import PostgresAppInstance, {
  DatabaseQueryRunner,
  DatabaseSource,
} from "Common/Server/Infrastructure/PostgresDatabase";
import IncidentService from "Common/Server/Services/IncidentService";
import IncidentSeverityService from "Common/Server/Services/IncidentSeverityService";
import IncidentStateService from "Common/Server/Services/IncidentStateService";
import ServiceService from "Common/Server/Services/ServiceService";
import SortOrder from "Common/Types/BaseDatabase/SortOrder";
import LIMIT_MAX from "Common/Types/Database/LimitMax";
import BadDataException from "Common/Types/Exception/BadDataException";
import ObjectID from "Common/Types/ObjectID";

const REPOSITORY_OBJECT_ID: string = "e6883b46-23cf-5c82-8e79-41e2e8436292";
const INCIDENT_OBJECT_ID: string = "6c3bfcd8-3eba-5917-8571-b14d6a9322af";
const CAST_SEVERITY_PATTERN: RegExp = new RegExp("^SEV[1-4]$");

type ResourceType = "INCIDENT" | "SERVICE";

type ManagedResourceRow = {
  bindingId: string;
  castWorkspaceId: string;
  externalResourceType: ResourceType;
  installationId: string;
  localObjectUniversalIdentifier: string;
  localRecordId: string;
  projectId: string;
  remoteResourceId: string;
  sourceUpdatedAt: Date | null;
  status: "ACTIVE" | "DELETED" | "PROVISIONING";
};

export type CastManagedResourceInput = {
  bindingId: string;
  castWorkspaceId: string;
  externalResourceType: ResourceType;
  installationId: string;
  localObjectUniversalIdentifier: string;
  localRecordId: string;
  projectId: string;
  record: Record<string, unknown>;
  serviceUserId: string;
};

export default class CastManagedResourceService {
  public static async provision(
    input: CastManagedResourceInput,
  ): Promise<string> {
    this.assertContract(input);
    const dataSource: DatabaseSource = this.getDataSource();
    const runner: DatabaseQueryRunner = dataSource.createQueryRunner();
    await runner.connect();
    await runner.query(`SELECT pg_advisory_lock(hashtext($1))`, [
      `cast-resource:${input.bindingId}`,
    ]);

    try {
      const existingRows: ManagedResourceRow[] = await dataSource.query(
        `SELECT * FROM "CastIntegrationResource" WHERE "bindingId" = $1`,
        [input.bindingId],
      );
      const deterministicRemoteId: string = input.bindingId;

      if (existingRows.length === 0) {
        if (
          await this.remoteResourceExists(
            input.externalResourceType,
            deterministicRemoteId,
          )
        ) {
          throw new BadDataException(
            "The deterministic Operations resource identifier is already owned by another resource",
          );
        }

        await dataSource.query(
          `INSERT INTO "CastIntegrationResource"
            ("installationId", "bindingId", "castWorkspaceId", "projectId", "localObjectUniversalIdentifier", "localRecordId", "externalResourceType", "remoteResourceId", "sourceUpdatedAt", "status")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $2, $8, 'PROVISIONING')`,
          [
            input.installationId,
            input.bindingId,
            input.castWorkspaceId,
            input.projectId,
            input.localObjectUniversalIdentifier,
            input.localRecordId,
            input.externalResourceType,
            this.sourceUpdatedAt(input.record),
          ],
        );
      } else {
        this.assertSameResource(existingRows[0]!, input);
        if (existingRows[0]!.status === "DELETED") {
          await dataSource.query(
            `UPDATE "CastIntegrationResource" SET "status" = 'PROVISIONING', "updatedAt" = now() WHERE "bindingId" = $1`,
            [input.bindingId],
          );
        }
      }

      if (input.externalResourceType === "SERVICE") {
        await this.provisionService(input, deterministicRemoteId);
      } else {
        await this.provisionIncident(input, deterministicRemoteId);
      }

      await dataSource.query(
        `UPDATE "CastIntegrationResource"
         SET "status" = 'ACTIVE', "sourceUpdatedAt" = $2, "updatedAt" = now()
         WHERE "bindingId" = $1`,
        [input.bindingId, this.sourceUpdatedAt(input.record)],
      );
      return deterministicRemoteId;
    } finally {
      await runner.query(`SELECT pg_advisory_unlock(hashtext($1))`, [
        `cast-resource:${input.bindingId}`,
      ]);
      await runner.release();
    }
  }

  public static async delete(data: {
    bindingId: string;
    castWorkspaceId: string;
    installationId: string;
    serviceUserId: string;
  }): Promise<boolean> {
    const source: DatabaseSource = this.getDataSource();
    const runner: DatabaseQueryRunner = source.createQueryRunner();
    await runner.connect();
    await runner.query(`SELECT pg_advisory_lock(hashtext($1))`, [
      `cast-resource:${data.bindingId}`,
    ]);

    try {
      const rows: ManagedResourceRow[] = await source.query(
        `SELECT * FROM "CastIntegrationResource"
         WHERE "bindingId" = $1 AND "installationId" = $2 AND "castWorkspaceId" = $3`,
        [data.bindingId, data.installationId, data.castWorkspaceId],
      );
      if (rows.length === 0 || rows[0]!.status === "DELETED") {
        return false;
      }

      const row: ManagedResourceRow = rows[0]!;
      const props: { isRoot: boolean; userId: ObjectID } = {
        isRoot: true,
        userId: new ObjectID(data.serviceUserId),
      };
      if (row.externalResourceType === "SERVICE") {
        const service: ServiceModel | null = await ServiceService.findOneBy({
          query: {
            _id: row.remoteResourceId,
            projectId: new ObjectID(row.projectId),
          },
          select: { _id: true },
          props: { isRoot: true },
        });
        if (service?.id) {
          await ServiceService.deleteOneById({ id: service.id, props });
        }
      } else {
        const incident: Incident | null = await IncidentService.findOneBy({
          query: {
            _id: row.remoteResourceId,
            projectId: new ObjectID(row.projectId),
          },
          select: { _id: true },
          props: { isRoot: true },
        });
        if (incident?.id) {
          await IncidentService.deleteOneById({ id: incident.id, props });
        }
      }

      await source.query(
        `UPDATE "CastIntegrationResource" SET "status" = 'DELETED', "updatedAt" = now() WHERE "bindingId" = $1`,
        [data.bindingId],
      );
      return true;
    } finally {
      await runner.query(`SELECT pg_advisory_unlock(hashtext($1))`, [
        `cast-resource:${data.bindingId}`,
      ]);
      await runner.release();
    }
  }

  private static async provisionService(
    input: CastManagedResourceInput,
    remoteId: string,
  ): Promise<void> {
    const name: string = this.requiredRecordString(input.record, "name", 255);
    const description: string | undefined = this.optionalRecordString(
      input.record,
      "description",
      4096,
    );
    const projectId: ObjectID = new ObjectID(input.projectId);
    const existing: ServiceModel | null = await ServiceService.findOneBy({
      query: { _id: remoteId, projectId },
      select: { _id: true },
      props: { isRoot: true },
    });

    if (existing?.id) {
      await ServiceService.updateOneBy({
        query: { _id: remoteId, projectId },
        data: {
          name,
          ...(description === undefined ? {} : { description }),
        },
        props: { isRoot: true, userId: new ObjectID(input.serviceUserId) },
      });
      return;
    }

    const service: ServiceModel = new ServiceModel();
    service.id = new ObjectID(remoteId);
    service.projectId = projectId;
    service.name = name;
    if (description !== undefined) {
      service.description = description;
    }
    await ServiceService.create({
      data: service,
      props: { isRoot: true, userId: new ObjectID(input.serviceUserId) },
    });
  }

  private static async provisionIncident(
    input: CastManagedResourceInput,
    remoteId: string,
  ): Promise<void> {
    const title: string = this.requiredRecordString(input.record, "title", 255);
    const projectId: ObjectID = new ObjectID(input.projectId);
    const severityId: ObjectID = await this.resolveSeverity(
      projectId,
      this.requiredRecordString(input.record, "severity", 32),
    );
    const stateId: ObjectID = await this.resolveState(
      projectId,
      this.requiredRecordString(input.record, "status", 32),
    );
    const existing: Incident | null = await IncidentService.findOneBy({
      query: { _id: remoteId, projectId },
      select: { _id: true, currentIncidentStateId: true },
      props: { isRoot: true },
    });

    if (existing?.id) {
      await IncidentService.updateOneBy({
        query: { _id: remoteId, projectId },
        data: { incidentSeverityId: severityId, title },
        props: { isRoot: true, userId: new ObjectID(input.serviceUserId) },
      });
      if (existing.currentIncidentStateId?.toString() !== stateId.toString()) {
        await IncidentService.changeIncidentState({
          projectId,
          incidentId: existing.id,
          incidentStateId: stateId,
          shouldNotifyStatusPageSubscribers: true,
          isSubscribersNotified: false,
          notifyOwners: true,
          rootCause:
            "State synchronized from the canonical Cast Incident record",
          stateChangeLog: undefined,
          props: { isRoot: true, userId: new ObjectID(input.serviceUserId) },
        });
      }
      return;
    }

    const incident: Incident = new Incident();
    incident.id = new ObjectID(remoteId);
    incident.projectId = projectId;
    incident.title = title;
    const description: string | undefined = this.optionalRecordString(
      input.record,
      "code",
      255,
    );
    if (description !== undefined) {
      incident.description = description;
    }
    incident.incidentSeverityId = severityId;
    incident.currentIncidentStateId = stateId;
    await IncidentService.create({
      data: incident,
      props: { isRoot: true, userId: new ObjectID(input.serviceUserId) },
    });
  }

  private static async resolveSeverity(
    projectId: ObjectID,
    sourceSeverity: string,
  ): Promise<ObjectID> {
    const severities: IncidentSeverity[] = await IncidentSeverityService.findBy(
      {
        query: { projectId },
        limit: LIMIT_MAX,
        skip: 0,
        sort: { order: SortOrder.Ascending },
        select: { _id: true, order: true },
        props: { isRoot: true },
      },
    );
    if (severities.length === 0) {
      throw new BadDataException(
        "The Operations project has no incident severities configured",
      );
    }
    const sourceIndex: number = CAST_SEVERITY_PATTERN.test(sourceSeverity)
      ? Number(sourceSeverity.slice(3)) - 1
      : 2;
    const severity: IncidentSeverity =
      severities[Math.min(Math.max(sourceIndex, 0), severities.length - 1)]!;
    if (!severity.id) {
      throw new BadDataException("The selected incident severity has no ID");
    }
    return severity.id;
  }

  private static async resolveState(
    projectId: ObjectID,
    sourceStatus: string,
  ): Promise<ObjectID> {
    const states: IncidentState[] =
      await IncidentStateService.getAllIncidentStates({
        projectId,
        props: { isRoot: true },
      });
    if (states.length === 0) {
      throw new BadDataException(
        "The Operations project has no incident states configured",
      );
    }
    const state: IncidentState | undefined =
      sourceStatus === "RESOLVED"
        ? states.find((item: IncidentState) => {
            return item.isResolvedState;
          })
        : sourceStatus === "MITIGATING"
          ? states.find((item: IncidentState) => {
              return item.isAcknowledgedState;
            })
          : states.find((item: IncidentState) => {
              return item.isCreatedState;
            }) ??
            states.find((item: IncidentState) => {
              return !item.isResolvedState;
            });
    if (!state?.id) {
      throw new BadDataException(
        `No Operations incident state maps to Cast status ${sourceStatus}`,
      );
    }
    return state.id;
  }

  private static async remoteResourceExists(
    type: ResourceType,
    remoteId: string,
  ): Promise<boolean> {
    const resource: ServiceModel | Incident | null =
      type === "SERVICE"
        ? await ServiceService.findOneBy({
            query: { _id: remoteId },
            select: { _id: true },
            props: { isRoot: true },
          })
        : await IncidentService.findOneBy({
            query: { _id: remoteId },
            select: { _id: true },
            props: { isRoot: true },
          });
    return Boolean(resource?.id);
  }

  private static assertContract(input: CastManagedResourceInput): void {
    const valid: boolean =
      (input.externalResourceType === "SERVICE" &&
        input.localObjectUniversalIdentifier === REPOSITORY_OBJECT_ID) ||
      (input.externalResourceType === "INCIDENT" &&
        input.localObjectUniversalIdentifier === INCIDENT_OBJECT_ID);
    if (!valid) {
      throw new BadDataException(
        "Unsupported Cast record to Operations resource contract",
      );
    }
  }

  private static assertSameResource(
    row: ManagedResourceRow,
    input: CastManagedResourceInput,
  ): void {
    if (
      row.installationId !== input.installationId ||
      row.castWorkspaceId !== input.castWorkspaceId ||
      row.projectId !== input.projectId ||
      row.externalResourceType !== input.externalResourceType ||
      row.localObjectUniversalIdentifier !==
        input.localObjectUniversalIdentifier ||
      row.localRecordId !== input.localRecordId ||
      row.remoteResourceId !== input.bindingId
    ) {
      throw new BadDataException(
        "Cast binding is already associated with another managed Operations resource",
      );
    }
  }

  private static sourceUpdatedAt(record: Record<string, unknown>): Date | null {
    const value: unknown = record["sourceUpdatedAt"];
    if (typeof value !== "string") {
      return null;
    }
    const date: Date = new Date(value);
    return Number.isFinite(date.getTime()) ? date : null;
  }

  private static requiredRecordString(
    record: Record<string, unknown>,
    key: string,
    maxLength: number,
  ): string {
    const value: unknown = record[key];
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new BadDataException(`payload.record.${key} is required`);
    }
    if (value.trim().length > maxLength) {
      throw new BadDataException(`payload.record.${key} is too long`);
    }
    return value.trim();
  }

  private static optionalRecordString(
    record: Record<string, unknown>,
    key: string,
    maxLength: number,
  ): string | undefined {
    const value: unknown = record[key];
    if (value === undefined || value === null || value === "") {
      return undefined;
    }
    if (typeof value !== "string" || value.length > maxLength) {
      throw new BadDataException(`payload.record.${key} is invalid`);
    }
    return value;
  }

  private static getDataSource(): DatabaseSource {
    const dataSource: DatabaseSource | null =
      PostgresAppInstance.getDataSource();
    if (!dataSource) {
      throw new Error("Postgres is not connected");
    }
    return dataSource;
  }
}
