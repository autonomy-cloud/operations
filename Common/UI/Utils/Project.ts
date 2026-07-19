import LocalStorage from "./LocalStorage";
import BaseModel from "../../Models/DatabaseModels/DatabaseBaseModel/DatabaseBaseModel";
import { JSONObject } from "../../Types/JSON";
import ObjectID from "../../Types/ObjectID";
import Project from "../../Models/DatabaseModels/Project";
import Navigation from "./Navigation";
import SessionStorage from "./SessionStorage";
import Telemetry from "./Telemetry/Telemetry";

export default class ProjectUtil {
  public static getCurrentProjectId(): ObjectID | null {
    // if this is not available in the url, check the session storage
    const currentProjectId: string | undefined = SessionStorage.getItem(
      `current_project_id`,
    ) as string;

    if (currentProjectId && ObjectID.isValidUUID(currentProjectId)) {
      return new ObjectID(currentProjectId);
    }

    let projectId: string | undefined = Navigation.getFirstParam(2);

    if (projectId && projectId.includes(":projectId")) {
      projectId = undefined;
    }

    // Only return the projectId if it's a valid UUID
    if (projectId && ObjectID.isValidUUID(projectId)) {
      return new ObjectID(projectId);
    }

    return null;
  }

  public static getCurrentProject(): Project | null {
    const currentProjectId: string | undefined =
      this.getCurrentProjectId()?.toString();
    if (!LocalStorage.getItem(`project_${currentProjectId}`)) {
      return null;
    }
    const projectJson: JSONObject = LocalStorage.getItem(
      `project_${currentProjectId}`,
    ) as JSONObject;
    return BaseModel.fromJSON(projectJson, Project) as Project;
  }

  public static setCurrentProject(project: JSONObject | Project): void {
    const currentProjectId: string | undefined =
      project._id?.toString() || this.getCurrentProjectId()?.toString();
    if (project instanceof Project) {
      project = BaseModel.toJSON(project, Project);
    }
    LocalStorage.setItem(`project_${currentProjectId}`, project);
    SessionStorage.setItem(`current_project_id`, currentProjectId);

    // Keep RUM span context in sync with the project being viewed.
    if (currentProjectId) {
      Telemetry.setGlobalAttributes({ projectId: currentProjectId });
    }
  }

  public static clearCurrentProject(): void {
    const currentProjectId: string | undefined =
      this.getCurrentProjectId()?.toString();
    LocalStorage.setItem(`project_${currentProjectId}`, null);
    SessionStorage.setItem(`current_project_id`, null);
  }
}
