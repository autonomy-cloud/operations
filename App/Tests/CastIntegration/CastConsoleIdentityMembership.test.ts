import CastConsoleIdentityService from "../../FeatureSet/CastIntegration/Services/CastConsoleIdentity";
import Team from "Common/Models/DatabaseModels/Team";
import TeamMember from "Common/Models/DatabaseModels/TeamMember";
import PostgresAppInstance, {
  DatabaseSource,
} from "Common/Server/Infrastructure/PostgresDatabase";
import AccessTokenService from "Common/Server/Services/AccessTokenService";
import TeamMemberService from "Common/Server/Services/TeamMemberService";
import TeamService from "Common/Server/Services/TeamService";
import ObjectID from "Common/Types/ObjectID";
import { afterEach, describe, expect, jest, test } from "@jest/globals";
import type { Mock, SpyInstance } from "jest-mock";

const INSTALLATION_ID: string = "11111111-1111-4111-8111-111111111111";
const PROJECT_ID: ObjectID = new ObjectID(
  "22222222-2222-4222-8222-222222222222",
);
const USER_ID: ObjectID = new ObjectID("33333333-3333-4333-8333-333333333333");
const OWNERS_TEAM_ID: ObjectID = new ObjectID(
  "44444444-4444-4444-8444-444444444444",
);
const MEMBERS_TEAM_ID: ObjectID = new ObjectID(
  "55555555-5555-4555-8555-555555555555",
);
const OWNER_MEMBER_ID: ObjectID = new ObjectID(
  "66666666-6666-4666-8666-666666666666",
);
const MEMBER_MEMBER_ID: ObjectID = new ObjectID(
  "77777777-7777-4777-8777-777777777777",
);

type ManagedRow = {
  _id: string;
  role: string;
  teamMemberId: string;
};

type QueryFunction = (...args: Array<unknown>) => Promise<unknown>;
type QueryMock = Mock<QueryFunction>;
type DatabaseMock = {
  dataQuery: QueryMock;
};

function membership(id: ObjectID, teamId: ObjectID): TeamMember {
  const value: TeamMember = new TeamMember(id);
  value.projectId = PROJECT_ID;
  value.teamId = teamId;
  value.userId = USER_ID;
  return value;
}

function mockDatabase(managedRows: Array<ManagedRow>): DatabaseMock {
  const runnerQuery: QueryMock = jest.fn<QueryFunction>();
  runnerQuery.mockResolvedValue([]);
  const runner: Record<string, unknown> = {
    connect: jest.fn().mockResolvedValue(undefined as never),
    query: runnerQuery,
    release: jest.fn().mockResolvedValue(undefined as never),
  };
  const dataQuery: QueryMock = jest
    .fn<QueryFunction>()
    .mockImplementation((sql: unknown): Promise<unknown> => {
      return Promise.resolve(
        String(sql).includes('FROM "CastIntegrationMembership"')
          ? managedRows
          : [],
      );
    });
  const dataSource: Record<string, unknown> = {
    createQueryRunner: jest.fn().mockReturnValue(runner),
    query: dataQuery,
  };
  jest
    .spyOn(PostgresAppInstance, "getDataSource")
    .mockReturnValue(dataSource as unknown as DatabaseSource);
  return { dataQuery };
}

function mockTargetTeam(teamId: ObjectID): void {
  const team: Team = new Team(teamId);
  jest.spyOn(TeamService, "findOneBy").mockResolvedValue(team);
}

describe("Cast Console Operations membership convergence", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("adopts the Cast-derived target grant and removes competing grants", async () => {
    const { dataQuery } = mockDatabase([
      {
        _id: "88888888-8888-4888-8888-888888888888",
        role: "OWNER",
        teamMemberId: OWNER_MEMBER_ID.toString(),
      },
    ]);
    mockTargetTeam(MEMBERS_TEAM_ID);
    jest
      .spyOn(TeamMemberService, "findBy")
      .mockResolvedValue([
        membership(OWNER_MEMBER_ID, OWNERS_TEAM_ID),
        membership(MEMBER_MEMBER_ID, MEMBERS_TEAM_ID),
      ]);
    const remove: SpyInstance<typeof TeamMemberService.deleteOneById> = jest
      .spyOn(TeamMemberService, "deleteOneById")
      .mockResolvedValue(1);
    const create: SpyInstance<typeof TeamMemberService.create> = jest.spyOn(
      TeamMemberService,
      "create",
    );
    const refresh: SpyInstance<
      typeof AccessTokenService.refreshUserAllPermissions
    > = jest
      .spyOn(AccessTokenService, "refreshUserAllPermissions")
      .mockResolvedValue(undefined);

    await CastConsoleIdentityService.ensureProjectMembership({
      installationId: INSTALLATION_ID,
      isWorkspaceAdmin: false,
      projectId: PROJECT_ID,
      userId: USER_ID,
    });

    expect(remove).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledWith({
      id: OWNER_MEMBER_ID,
      props: { isRoot: true },
    });
    expect(create).not.toHaveBeenCalled();
    expect(dataQuery).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM "CastIntegrationMembership"'),
      ["88888888-8888-4888-8888-888888888888"],
    );
    expect(dataQuery).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO "CastIntegrationMembership"'),
      [
        INSTALLATION_ID,
        PROJECT_ID.toString(),
        USER_ID.toString(),
        MEMBER_MEMBER_ID.toString(),
        "MEMBER",
      ],
    );
    expect(refresh).toHaveBeenCalledWith(USER_ID);
  });

  test("keeps the matching managed grant and removes only competing grants", async () => {
    const { dataQuery } = mockDatabase([
      {
        _id: "88888888-8888-4888-8888-888888888888",
        role: "OWNER",
        teamMemberId: OWNER_MEMBER_ID.toString(),
      },
    ]);
    mockTargetTeam(OWNERS_TEAM_ID);
    jest
      .spyOn(TeamMemberService, "findBy")
      .mockResolvedValue([
        membership(OWNER_MEMBER_ID, OWNERS_TEAM_ID),
        membership(MEMBER_MEMBER_ID, MEMBERS_TEAM_ID),
      ]);
    const remove: SpyInstance<typeof TeamMemberService.deleteOneById> = jest
      .spyOn(TeamMemberService, "deleteOneById")
      .mockResolvedValue(1);
    jest
      .spyOn(AccessTokenService, "refreshUserAllPermissions")
      .mockResolvedValue(undefined);

    await CastConsoleIdentityService.ensureProjectMembership({
      installationId: INSTALLATION_ID,
      isWorkspaceAdmin: true,
      projectId: PROJECT_ID,
      userId: USER_ID,
    });

    expect(remove).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledWith({
      id: MEMBER_MEMBER_ID,
      props: { isRoot: true },
    });
    expect(
      dataQuery.mock.calls.some((call: Array<unknown>) => {
        return String(call[0]).includes(
          'DELETE FROM "CastIntegrationMembership"',
        );
      }),
    ).toBe(false);
    expect(
      dataQuery.mock.calls.some((call: Array<unknown>) => {
        return String(call[0]).includes(
          'INSERT INTO "CastIntegrationMembership"',
        );
      }),
    ).toBe(false);
  });

  test("creates and records the target grant when none exists", async () => {
    const { dataQuery } = mockDatabase([]);
    mockTargetTeam(MEMBERS_TEAM_ID);
    jest.spyOn(TeamMemberService, "findBy").mockResolvedValue([]);
    const created: TeamMember = membership(MEMBER_MEMBER_ID, MEMBERS_TEAM_ID);
    const create: SpyInstance<typeof TeamMemberService.create> = jest
      .spyOn(TeamMemberService, "create")
      .mockResolvedValue(created);
    jest
      .spyOn(AccessTokenService, "refreshUserAllPermissions")
      .mockResolvedValue(undefined);

    await CastConsoleIdentityService.ensureProjectMembership({
      installationId: INSTALLATION_ID,
      isWorkspaceAdmin: false,
      projectId: PROJECT_ID,
      userId: USER_ID,
    });

    expect(create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        hasAcceptedInvitation: true,
        projectId: PROJECT_ID,
        teamId: MEMBERS_TEAM_ID,
        userId: USER_ID,
      }),
      props: { ignoreHooks: true, isRoot: true },
    });
    expect(dataQuery).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO "CastIntegrationMembership"'),
      [
        INSTALLATION_ID,
        PROJECT_ID.toString(),
        USER_ID.toString(),
        MEMBER_MEMBER_ID.toString(),
        "MEMBER",
      ],
    );
  });
});
