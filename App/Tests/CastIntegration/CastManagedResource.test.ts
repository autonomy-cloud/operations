import CastManagedResourceService, {
  CastManagedResourceInput,
} from "../../FeatureSet/CastIntegration/Services/CastManagedResource";
import Incident from "Common/Models/DatabaseModels/Incident";
import IncidentSeverity from "Common/Models/DatabaseModels/IncidentSeverity";
import IncidentState from "Common/Models/DatabaseModels/IncidentState";
import ServiceModel from "Common/Models/DatabaseModels/Service";
import PostgresAppInstance from "Common/Server/Infrastructure/PostgresDatabase";
import IncidentService from "Common/Server/Services/IncidentService";
import IncidentSeverityService from "Common/Server/Services/IncidentSeverityService";
import IncidentStateService from "Common/Server/Services/IncidentStateService";
import ServiceService from "Common/Server/Services/ServiceService";
import ObjectID from "Common/Types/ObjectID";
import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import type { Mock, SpyInstance } from "jest-mock";

const INSTALLATION_ID: string = "11111111-1111-4111-8111-111111111111";
const WORKSPACE_ID: string = "22222222-2222-4222-8222-222222222222";
const PROJECT_ID: string = "33333333-3333-4333-8333-333333333333";
const BINDING_ID: string = "44444444-4444-4444-8444-444444444444";
const RECORD_ID: string = "55555555-5555-4555-8555-555555555555";
const SERVICE_USER_ID: string = "66666666-6666-4666-8666-666666666666";

type QueryFunction = (...args: Array<unknown>) => Promise<Array<unknown>>;
type QueryMock = Mock<QueryFunction>;
type AsyncVoidMock = Mock<() => Promise<void>>;
type RunnerMock = {
  connect: AsyncVoidMock;
  query: QueryMock;
  release: AsyncVoidMock;
};
type DataSourceMock = {
  createQueryRunner: Mock<() => RunnerMock>;
  query: QueryMock;
};

function input(
  overrides: Partial<CastManagedResourceInput> = {},
): CastManagedResourceInput {
  return {
    bindingId: BINDING_ID,
    castWorkspaceId: WORKSPACE_ID,
    externalResourceType: "SERVICE",
    installationId: INSTALLATION_ID,
    localObjectUniversalIdentifier: "e6883b46-23cf-5c82-8e79-41e2e8436292",
    localRecordId: RECORD_ID,
    projectId: PROJECT_ID,
    record: {
      description: "Cast repository Clinical API: TypeScript · main",
      name: "Clinical API",
      sourceUpdatedAt: "2026-07-20T10:01:00.000Z",
    },
    serviceUserId: SERVICE_USER_ID,
    ...overrides,
  };
}

describe("CastManagedResourceService", () => {
  const query: QueryMock = jest.fn<QueryFunction>();
  const runnerQuery: QueryMock = jest.fn<QueryFunction>();
  const runner: RunnerMock = {
    connect: jest.fn<() => Promise<void>>(),
    query: runnerQuery,
    release: jest.fn<() => Promise<void>>(),
  };
  const dataSource: DataSourceMock = {
    createQueryRunner: jest.fn(() => {
      return runner;
    }),
    query,
  };

  beforeEach(() => {
    jest.restoreAllMocks();
    query.mockReset();
    runnerQuery.mockReset();
    runner.connect.mockReset();
    runner.release.mockReset();
    dataSource.createQueryRunner.mockClear();
    jest
      .spyOn(PostgresAppInstance, "getDataSource")
      .mockReturnValue(dataSource as never);
  });

  test("creates a provenance-owned Operations Service with the binding ID", async () => {
    query
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);
    jest.spyOn(ServiceService, "findOneBy").mockResolvedValue(null);
    const create: SpyInstance<typeof ServiceService.create> = jest
      .spyOn(ServiceService, "create")
      .mockResolvedValue(new ServiceModel());

    await expect(CastManagedResourceService.provision(input())).resolves.toBe(
      BINDING_ID,
    );

    expect(create).toHaveBeenCalledTimes(1);
    const service: ServiceModel = create.mock.calls[0]![0].data;
    expect(service.id?.toString()).toBe(BINDING_ID);
    expect(service.projectId?.toString()).toBe(PROJECT_ID);
    expect(service.name).toBe("Clinical API");
    expect(service.description).toContain("TypeScript");
    expect(query.mock.calls[1]![0]).toContain(
      'INSERT INTO "CastIntegrationResource"',
    );
    expect(query.mock.calls[2]![0]).toContain("SET \"status\" = 'ACTIVE'");
    expect(runnerQuery).toHaveBeenNthCalledWith(
      1,
      "SELECT pg_advisory_lock(hashtext($1))",
      [`cast-resource:${BINDING_ID}`],
    );
    expect(runner.release).toHaveBeenCalledTimes(1);
  });

  test("updates the same managed Service on a retry without creating another", async () => {
    query
      .mockResolvedValueOnce([
        {
          bindingId: BINDING_ID,
          castWorkspaceId: WORKSPACE_ID,
          externalResourceType: "SERVICE",
          installationId: INSTALLATION_ID,
          localObjectUniversalIdentifier:
            "e6883b46-23cf-5c82-8e79-41e2e8436292",
          localRecordId: RECORD_ID,
          projectId: PROJECT_ID,
          remoteResourceId: BINDING_ID,
          sourceUpdatedAt: null,
          status: "ACTIVE",
        },
      ])
      .mockResolvedValueOnce([]);
    const existing: ServiceModel = new ServiceModel();
    existing.id = new ObjectID(BINDING_ID);
    jest.spyOn(ServiceService, "findOneBy").mockResolvedValue(existing);
    const update: SpyInstance<typeof ServiceService.updateOneBy> = jest
      .spyOn(ServiceService, "updateOneBy")
      .mockResolvedValue(1);
    const create: SpyInstance<typeof ServiceService.create> = jest.spyOn(
      ServiceService,
      "create",
    );

    await CastManagedResourceService.provision(
      input({ record: { name: "Clinical API v2" } }),
    );

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { name: "Clinical API v2" },
        query: {
          _id: BINDING_ID,
          projectId: expect.any(ObjectID),
        },
      }),
    );
    expect(create).not.toHaveBeenCalled();
  });

  test("maps Cast severity and status into project-native Incident configuration", async () => {
    query
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);
    jest.spyOn(IncidentService, "findOneBy").mockResolvedValue(null);
    const severityOne: IncidentSeverity = new IncidentSeverity();
    severityOne.id = new ObjectID("77777777-7777-4777-8777-777777777777");
    const severityTwo: IncidentSeverity = new IncidentSeverity();
    severityTwo.id = new ObjectID("88888888-8888-4888-8888-888888888888");
    jest
      .spyOn(IncidentSeverityService, "findBy")
      .mockResolvedValue([severityOne, severityTwo]);
    const created: IncidentState = new IncidentState();
    created.id = new ObjectID("99999999-9999-4999-8999-999999999999");
    created.isCreatedState = true;
    const acknowledged: IncidentState = new IncidentState();
    acknowledged.id = new ObjectID("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa");
    acknowledged.isAcknowledgedState = true;
    const resolved: IncidentState = new IncidentState();
    resolved.id = new ObjectID("bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb");
    resolved.isResolvedState = true;
    jest
      .spyOn(IncidentStateService, "getAllIncidentStates")
      .mockResolvedValue([created, acknowledged, resolved]);
    const create: SpyInstance<typeof IncidentService.create> = jest
      .spyOn(IncidentService, "create")
      .mockResolvedValue(new Incident());

    await CastManagedResourceService.provision(
      input({
        externalResourceType: "INCIDENT",
        localObjectUniversalIdentifier: "6c3bfcd8-3eba-5917-8571-b14d6a9322af",
        record: {
          code: "INC-42",
          severity: "SEV1",
          status: "MITIGATING",
          title: "Patient API latency",
        },
      }),
    );

    const incident: Incident = create.mock.calls[0]![0].data;
    expect(incident.id?.toString()).toBe(BINDING_ID);
    expect(incident.incidentSeverityId?.toString()).toBe(
      severityOne.id?.toString(),
    );
    expect(incident.currentIncidentStateId?.toString()).toBe(
      acknowledged.id?.toString(),
    );
    expect(incident.description).toBe("INC-42");
  });

  test("updates a managed Incident through the native state transition service", async () => {
    query
      .mockResolvedValueOnce([
        {
          bindingId: BINDING_ID,
          castWorkspaceId: WORKSPACE_ID,
          externalResourceType: "INCIDENT",
          installationId: INSTALLATION_ID,
          localObjectUniversalIdentifier:
            "6c3bfcd8-3eba-5917-8571-b14d6a9322af",
          localRecordId: RECORD_ID,
          projectId: PROJECT_ID,
          remoteResourceId: BINDING_ID,
          sourceUpdatedAt: null,
          status: "ACTIVE",
        },
      ])
      .mockResolvedValueOnce([]);

    const existing: Incident = new Incident();
    existing.id = new ObjectID(BINDING_ID);
    existing.currentIncidentStateId = new ObjectID(
      "99999999-9999-4999-8999-999999999999",
    );
    jest.spyOn(IncidentService, "findOneBy").mockResolvedValue(existing);
    jest.spyOn(IncidentService, "updateOneBy").mockResolvedValue(1);
    const changeState: SpyInstance<typeof IncidentService.changeIncidentState> =
      jest
        .spyOn(IncidentService, "changeIncidentState")
        .mockResolvedValue(undefined);

    const severity: IncidentSeverity = new IncidentSeverity();
    severity.id = new ObjectID("77777777-7777-4777-8777-777777777777");
    jest.spyOn(IncidentSeverityService, "findBy").mockResolvedValue([severity]);
    const created: IncidentState = new IncidentState();
    created.id = existing.currentIncidentStateId;
    created.isCreatedState = true;
    const resolved: IncidentState = new IncidentState();
    resolved.id = new ObjectID("bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb");
    resolved.isResolvedState = true;
    jest
      .spyOn(IncidentStateService, "getAllIncidentStates")
      .mockResolvedValue([created, resolved]);

    await CastManagedResourceService.provision(
      input({
        externalResourceType: "INCIDENT",
        localObjectUniversalIdentifier: "6c3bfcd8-3eba-5917-8571-b14d6a9322af",
        record: {
          severity: "SEV2",
          status: "RESOLVED",
          title: "Patient API recovered",
        },
      }),
    );

    expect(changeState).toHaveBeenCalledWith(
      expect.objectContaining({
        incidentId: existing.id,
        incidentStateId: resolved.id,
        projectId: expect.any(ObjectID),
        rootCause: "State synchronized from the canonical Cast Incident record",
      }),
    );
  });

  test("deletes only a resource owned by the matching Cast provenance row", async () => {
    query
      .mockResolvedValueOnce([
        {
          bindingId: BINDING_ID,
          castWorkspaceId: WORKSPACE_ID,
          externalResourceType: "SERVICE",
          installationId: INSTALLATION_ID,
          localObjectUniversalIdentifier:
            "e6883b46-23cf-5c82-8e79-41e2e8436292",
          localRecordId: RECORD_ID,
          projectId: PROJECT_ID,
          remoteResourceId: BINDING_ID,
          sourceUpdatedAt: null,
          status: "ACTIVE",
        },
      ])
      .mockResolvedValueOnce([]);
    const existing: ServiceModel = new ServiceModel();
    existing.id = new ObjectID(BINDING_ID);
    jest.spyOn(ServiceService, "findOneBy").mockResolvedValue(existing);
    const deleteService: SpyInstance<typeof ServiceService.deleteOneById> = jest
      .spyOn(ServiceService, "deleteOneById")
      .mockImplementation(async () => {
        return undefined as never;
      });

    await expect(
      CastManagedResourceService.delete({
        bindingId: BINDING_ID,
        castWorkspaceId: WORKSPACE_ID,
        installationId: INSTALLATION_ID,
        serviceUserId: SERVICE_USER_ID,
      }),
    ).resolves.toBe(true);

    expect(deleteService).toHaveBeenCalledWith(
      expect.objectContaining({ id: existing.id }),
    );
    expect(query.mock.calls[1]![0]).toContain("SET \"status\" = 'DELETED'");
  });

  test("rejects unsupported object/resource contracts before touching Postgres", async () => {
    await expect(
      CastManagedResourceService.provision(
        input({ localObjectUniversalIdentifier: WORKSPACE_ID }),
      ),
    ).rejects.toThrow("Unsupported Cast record");

    expect(dataSource.createQueryRunner).not.toHaveBeenCalled();
  });
});
