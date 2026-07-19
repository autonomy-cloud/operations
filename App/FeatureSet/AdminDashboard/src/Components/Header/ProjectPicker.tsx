import Project from "Common/Models/DatabaseModels/Project";
import IconProp from "Common/Types/Icon/IconProp";
import { FormType } from "Common/UI/Components/Forms/ModelForm";
import Field from "Common/UI/Components/Forms/Types/Field";
import FormFieldSchemaType from "Common/UI/Components/Forms/Types/FormFieldSchemaType";
import ProjectPicker from "Common/UI/Components/Header/ProjectPicker/ProjectPicker";
import ModelFormModal from "Common/UI/Components/ModelFormModal/ModelFormModal";
import ProjectUtil from "Common/UI/Utils/Project";
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

const AdminProjectPicker: FunctionComponent<ComponentProps> = (
  props: ComponentProps,
): ReactElement => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (props.showProjectModal) {
      setShowModal(true);
    }
  }, [props.showProjectModal]);

  useEffect(() => {
    const currentProject: Project | null = ProjectUtil.getCurrentProject();
    setSelectedProject(currentProject || props.projects[0] || null);
  }, [props.projects]);

  useEffect(() => {
    if (selectedProject) {
      ProjectUtil.setCurrentProject(selectedProject);
      props.onProjectSelected(selectedProject);
    }
  }, [selectedProject]);

  return (
    <>
      {props.projects.length > 0 && (
        <ProjectPicker
          selectedProjectName={selectedProject?.name || ""}
          selectedProjectIcon={IconProp.Folder}
          projects={props.projects}
          onCreateProjectButtonClicked={() => {
            setShowModal(true);
            props.onProjectModalClose();
          }}
          onProjectSelected={setSelectedProject}
        />
      )}

      {showModal && (
        <ModelFormModal<Project>
          modelType={Project}
          name="Create New Project"
          title="Create New Project"
          description="Create a new Cast Operations project to get started."
          onClose={() => {
            setShowModal(false);
            props.onProjectModalClose();
          }}
          submitButtonText="Create Project"
          onSuccess={(project: Project | null) => {
            setSelectedProject(project);
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

export default AdminProjectPicker;
