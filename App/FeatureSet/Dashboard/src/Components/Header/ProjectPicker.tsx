import Project from "Common/Models/DatabaseModels/Project";
import IconProp from "Common/Types/Icon/IconProp";
import ObjectID from "Common/Types/ObjectID";
import { FormType } from "Common/UI/Components/Forms/ModelForm";
import Field from "Common/UI/Components/Forms/Types/Field";
import FormFieldSchemaType from "Common/UI/Components/Forms/Types/FormFieldSchemaType";
import ProjectPicker from "Common/UI/Components/Header/ProjectPicker/ProjectPicker";
import ModelFormModal from "Common/UI/Components/ModelFormModal/ModelFormModal";
import GlobalConfigUtil from "Common/UI/Utils/GlobalConfig";
import ProjectUtil from "Common/UI/Utils/Project";
import User from "Common/UI/Utils/User";
import React, {
  FunctionComponent,
  ReactElement,
  useEffect,
  useState,
} from "react";

export interface ComponentProps {
  projects: Array<Project>;
  onProjectSelected: (project: Project) => void;
  showProjectModal: boolean;
  onProjectModalClose: () => void;
  selectedProject: Project | null;
}

const fields: Array<Field<Project>> = [
  {
    field: { name: true },
    validation: { minLength: 4 },
    fieldType: FormFieldSchemaType.Text,
    placeholder: "My Project",
    description: "Pick a friendly name.",
    title: "Project Name",
    required: true,
  },
];

const DashboardProjectPicker: FunctionComponent<ComponentProps> = (
  props: ComponentProps,
): ReactElement => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [canCreateProject, setCanCreateProject] = useState<boolean>(true);

  const getCurrentProject: () => Project | null = (): Project | null => {
    const projectId: ObjectID | null = ProjectUtil.getCurrentProjectId();
    const matchingProject: Project | undefined = projectId
      ? props.projects.find((project: Project) => {
          return project._id?.toString() === projectId.toString();
        })
      : undefined;

    return (
      matchingProject ||
      ProjectUtil.getCurrentProject() ||
      props.projects[0] ||
      null
    );
  };

  useEffect(() => {
    if (props.showProjectModal) {
      setShowModal(true);
    }
  }, [props.showProjectModal]);

  useEffect(() => {
    if (User.isMasterAdmin()) {
      return;
    }

    GlobalConfigUtil.fetchVars()
      .then((vars: { disableUserProjectCreation: boolean }) => {
        setCanCreateProject(!vars.disableUserProjectCreation);
      })
      .catch(() => {
        return setCanCreateProject(true);
      });
  }, []);

  useEffect(() => {
    const currentProject: Project | null = getCurrentProject();
    if (currentProject) {
      props.onProjectSelected(currentProject);
    }
  }, [props.projects]);

  return (
    <>
      {props.projects.length > 0 && (
        <ProjectPicker
          selectedProjectName={props.selectedProject?.name || ""}
          selectedProjectIcon={IconProp.Folder}
          projects={props.projects}
          hideCreateProjectButton={!canCreateProject}
          onCreateProjectButtonClicked={() => {
            setShowModal(true);
            props.onProjectModalClose();
          }}
          onProjectSelected={props.onProjectSelected}
        />
      )}

      {showModal && canCreateProject && (
        <ModelFormModal<Project>
          modelType={Project}
          initialValues={{}}
          name="Create New Project"
          title="Create New Project"
          description="Create a new Cast Operations project to get started."
          onClose={() => {
            setShowModal(false);
            props.onProjectModalClose();
          }}
          submitButtonText="Create Project"
          onSuccess={(project: Project | null) => {
            if (project) {
              props.onProjectSelected(project);
            }
            setShowModal(false);
            props.onProjectModalClose();
          }}
          formProps={{
            name: "Create New Project",
            saveRequestOptions: { isMultiTenantRequest: true },
            modelType: Project,
            id: "create-project-form",
            fields,
            formType: FormType.Create,
          }}
        />
      )}
    </>
  );
};

export default DashboardProjectPicker;
