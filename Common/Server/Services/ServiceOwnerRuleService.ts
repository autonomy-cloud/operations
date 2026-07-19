import DatabaseService from "./DatabaseService";
import Model from "../../Models/DatabaseModels/ServiceOwnerRule";
import {} from "../EnvironmentConfig";

export class Service extends DatabaseService<Model> {
  public constructor() {
    super(Model);
  }
}

export default new Service();
