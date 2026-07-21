import Project from "../../../Models/DatabaseModels/Project";
import Team from "../../../Models/DatabaseModels/Team";
import TeamMember from "../../../Models/DatabaseModels/TeamMember";
import ProjectService from "../../../Server/Services/ProjectService";
import TeamMemberService from "../../../Server/Services/TeamMemberService";
import TeamService from "../../../Server/Services/TeamService";
import CreateBy from "../../../Server/Types/Database/CreateBy";
import DeleteBy from "../../../Server/Types/Database/DeleteBy";
import {
  OnCreate,
  OnDelete,
  OnUpdate,
} from "../../../Server/Types/Database/Hooks";
import UpdateBy from "../../../Server/Types/Database/UpdateBy";
import BadDataException from "../../../Types/Exception/BadDataException";
import ObjectID from "../../../Types/ObjectID";
import { afterEach, describe, expect, jest, test } from "@jest/globals";

type TeamHooks = {
  onBeforeCreate(createBy: CreateBy<Team>): Promise<OnCreate<Team>>;
  onBeforeDelete(deleteBy: DeleteBy<Team>): Promise<OnDelete<Team>>;
  onBeforeUpdate(updateBy: UpdateBy<Team>): Promise<OnUpdate<Team>>;
};

type TeamMemberHooks = {
  onBeforeCreate(createBy: CreateBy<TeamMember>): Promise<OnCreate<TeamMember>>;
  onBeforeDelete(deleteBy: DeleteBy<TeamMember>): Promise<OnDelete<TeamMember>>;
  onBeforeUpdate(updateBy: UpdateBy<TeamMember>): Promise<OnUpdate<TeamMember>>;
};

const PROJECT_ID: ObjectID = new ObjectID(
  "11111111-1111-4111-8111-111111111111",
);
const TEAM_ID: ObjectID = new ObjectID("22222222-2222-4222-8222-222222222222");
const MEMBER_ID: ObjectID = new ObjectID(
  "33333333-3333-4333-8333-333333333333",
);

function managedProject(): Project {
  const project: Project = new Project(PROJECT_ID);
  project.castWorkspaceId = new ObjectID(
    "44444444-4444-4444-8444-444444444444",
  );
  return project;
}

function team(): Team {
  const value: Team = new Team(TEAM_ID);
  value.projectId = PROJECT_ID;
  value.isTeamDeleteable = true;
  value.isTeamEditable = true;
  return value;
}

function member(): TeamMember {
  const value: TeamMember = new TeamMember(MEMBER_ID);
  value.projectId = PROJECT_ID;
  value.teamId = TEAM_ID;
  return value;
}

describe("Cast-managed Operations team policy", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test.each(["create", "update", "delete"] as const)(
    "rejects downstream team %s",
    async (action: "create" | "delete" | "update") => {
      jest
        .spyOn(ProjectService, "findBy")
        .mockResolvedValue([managedProject()]);
      const hooks: TeamHooks = TeamService as unknown as TeamHooks;

      if (action === "create") {
        await expect(
          hooks.onBeforeCreate({
            data: team(),
            props: { isRoot: false, tenantId: PROJECT_ID },
          }),
        ).rejects.toThrow(BadDataException);
        return;
      }

      jest.spyOn(TeamService, "findBy").mockResolvedValue([team()]);
      const query: Record<string, ObjectID> = { _id: TEAM_ID };
      if (action === "update") {
        await expect(
          hooks.onBeforeUpdate({
            data: { name: "Changed" },
            limit: 1,
            props: { isRoot: false, tenantId: PROJECT_ID },
            query,
            skip: 0,
          } as unknown as UpdateBy<Team>),
        ).rejects.toThrow(BadDataException);
        return;
      }

      await expect(
        hooks.onBeforeDelete({
          limit: 1,
          props: { isRoot: false, tenantId: PROJECT_ID },
          query,
          skip: 0,
        } as unknown as DeleteBy<Team>),
      ).rejects.toThrow(BadDataException);
    },
  );

  test.each(["create", "update", "delete"] as const)(
    "rejects downstream team membership %s",
    async (action: "create" | "delete" | "update") => {
      jest
        .spyOn(ProjectService, "findBy")
        .mockResolvedValue([managedProject()]);
      const hooks: TeamMemberHooks =
        TeamMemberService as unknown as TeamMemberHooks;

      if (action === "create") {
        await expect(
          hooks.onBeforeCreate({
            data: member(),
            props: { isRoot: false, tenantId: PROJECT_ID },
          }),
        ).rejects.toThrow(BadDataException);
        return;
      }

      jest.spyOn(TeamMemberService, "findBy").mockResolvedValue([member()]);
      const query: Record<string, ObjectID> = { _id: MEMBER_ID };
      if (action === "update") {
        await expect(
          hooks.onBeforeUpdate({
            data: { teamId: TEAM_ID },
            limit: 1,
            props: { isRoot: false, tenantId: PROJECT_ID },
            query,
            skip: 0,
          } as unknown as UpdateBy<TeamMember>),
        ).rejects.toThrow(BadDataException);
        return;
      }

      await expect(
        hooks.onBeforeDelete({
          limit: 1,
          props: { isRoot: false, tenantId: PROJECT_ID },
          query,
          skip: 0,
        } as unknown as DeleteBy<TeamMember>),
      ).rejects.toThrow(BadDataException);
    },
  );
});
