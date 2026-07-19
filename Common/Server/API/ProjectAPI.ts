import UserMiddleware from "../Middleware/UserAuthorization";
import ProjectService, {
  ProjectService as ProjectServiceType,
} from "../Services/ProjectService";
import TeamMemberService from "../Services/TeamMemberService";
import Select from "../Types/Database/Select";
import {
  ExpressRequest,
  ExpressResponse,
  NextFunction,
  OperationsRequest,
} from "../Utils/Express";
import Response from "../Utils/Response";
import BaseAPI from "./BaseAPI";
import { LIMIT_PER_PROJECT } from "../../Types/Database/LimitMax";
import NotAuthenticatedException from "../../Types/Exception/NotAuthenticatedException";
import PositiveNumber from "../../Types/PositiveNumber";
import Project from "../../Models/DatabaseModels/Project";
import TeamMember from "../../Models/DatabaseModels/TeamMember";

export default class ProjectAPI extends BaseAPI<Project, ProjectServiceType> {
  public constructor() {
    super(Project, ProjectService);

    /*
     * This API lists all the projects where user is its team member.
     * This API is usually used to show project selector dropdown in the UI
     */
    this.router.post(
      `${new this.entityType()
        .getCrudApiPath()
        ?.toString()}/list-user-projects`,
      UserMiddleware.getUserMiddleware,
      async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
        try {
          if (!(req as OperationsRequest).userAuthorization?.userId) {
            throw new NotAuthenticatedException(
              "User should be logged in to access this API",
            );
          }

          const projectSelect: Select<Project> = {
            _id: true,
            name: true,
            isFeatureFlagMonitorGroupsEnabled: true,
          };

          const teamMembers: Array<TeamMember> = await TeamMemberService.findBy(
            {
              query: {
                userId: (req as OperationsRequest).userAuthorization!.userId!,
                hasAcceptedInvitation: true,
              },
              select: {
                project: projectSelect,
              },
              limit: LIMIT_PER_PROJECT,
              skip: 0,
              props: {
                isRoot: true,
              },
            },
          );

          const projects: Array<Project> = [];

          for (const teamMember of teamMembers) {
            if (!teamMember.project) {
              continue;
            }

            if (
              projects.findIndex((project: Project) => {
                return (
                  project._id?.toString() ===
                  teamMember.project!._id?.toString()
                );
              }) === -1
            ) {
              projects.push(teamMember.project!);
            }
          }

          return Response.sendEntityArrayResponse(
            req,
            res,
            projects,
            new PositiveNumber(projects.length),
            Project,
          );
        } catch (err) {
          next(err);
        }
      },
    );
  }
}
