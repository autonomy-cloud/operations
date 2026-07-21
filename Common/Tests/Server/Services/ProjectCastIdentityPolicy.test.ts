import Project from "../../../Models/DatabaseModels/Project";
import ProjectService from "../../../Server/Services/ProjectService";
import { OnUpdate } from "../../../Server/Types/Database/Hooks";
import UpdateBy from "../../../Server/Types/Database/UpdateBy";
import BadDataException from "../../../Types/Exception/BadDataException";
import ObjectID from "../../../Types/ObjectID";
import { afterEach, describe, expect, jest, test } from "@jest/globals";
import type { SpyInstance } from "jest-mock";

type ProjectServiceWithUpdateHook = {
  onBeforeUpdate(updateBy: UpdateBy<Project>): Promise<OnUpdate<Project>>;
};

const PROJECT_ID: string = "11111111-1111-4111-8111-111111111111";
const WORKSPACE_ID: string = "22222222-2222-4222-8222-222222222222";

function makeUpdateBy(
  data: Record<string, unknown>,
  isRoot: boolean,
): UpdateBy<Project> {
  return {
    data,
    limit: 1,
    props: { isRoot },
    query: { _id: new ObjectID(PROJECT_ID) },
    skip: 0,
  } as unknown as UpdateBy<Project>;
}

describe("ProjectService Cast identity policy", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("rejects a downstream attempt to change a Cast-managed project identity policy", async () => {
    const project: Project = new Project();
    project.id = new ObjectID(PROJECT_ID);
    project.castWorkspaceId = new ObjectID(WORKSPACE_ID);
    jest.spyOn(ProjectService, "findBy").mockResolvedValue([project]);

    await expect(
      (
        ProjectService as unknown as ProjectServiceWithUpdateHook
      ).onBeforeUpdate(makeUpdateBy({ requireSsoForLogin: false }, false)),
    ).rejects.toThrow(BadDataException);
  });

  test("allows the trusted integration service to repair the policy", async () => {
    const findBy: SpyInstance<typeof ProjectService.findBy> = jest.spyOn(
      ProjectService,
      "findBy",
    );
    const updateBy: UpdateBy<Project> = makeUpdateBy(
      {
        requireSsoForLogin: true,
        requireSsoWithSsoProviderId: new ObjectID(
          "33333333-3333-4333-8333-333333333333",
        ),
      },
      true,
    );

    await expect(
      (
        ProjectService as unknown as ProjectServiceWithUpdateHook
      ).onBeforeUpdate(updateBy),
    ).resolves.toEqual({ carryForward: [], updateBy });
    expect(findBy).not.toHaveBeenCalled();
  });

  test("does not add a lookup to unrelated project updates", async () => {
    const findBy: SpyInstance<typeof ProjectService.findBy> = jest.spyOn(
      ProjectService,
      "findBy",
    );
    const updateBy: UpdateBy<Project> = makeUpdateBy(
      { name: "Renamed Operations project" },
      false,
    );

    await expect(
      (
        ProjectService as unknown as ProjectServiceWithUpdateHook
      ).onBeforeUpdate(updateBy),
    ).resolves.toEqual({ carryForward: [], updateBy });
    expect(findBy).not.toHaveBeenCalled();
  });
});
