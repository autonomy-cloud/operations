import PageMap from "../../Utils/PageMap";
import RouteMap, { RouteUtil } from "../../Utils/RouteMap";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import NavBar from "../NavBar/NavBar";
import Route from "Common/Types/API/Route";
import SSOAuthorizationException from "Common/Types/Exception/SsoAuthorizationException";
import MasterPage from "Common/UI/Components/MasterPage/MasterPage";
import { CAST_OPERATIONS_EMBEDDED_MODE } from "Common/UI/Config";
import Navigation from "Common/UI/Utils/Navigation";
import Project from "Common/Models/DatabaseModels/Project";
import React, { FunctionComponent, ReactElement } from "react";

export interface ComponentProps {
  children: ReactElement | Array<ReactElement>;
  isLoading: boolean;
  projects: Array<Project>;
  error: string;
  onProjectSelected: (project: Project) => void;
  showProjectModal: boolean;
  onProjectModalClose: () => void;
  selectedProject: Project | null;
  hideNavBarOn: Array<Route>;
}

const DashboardMasterPage: FunctionComponent<ComponentProps> = (
  props: ComponentProps,
): ReactElement => {
  let isOnHideNavbarPage: boolean = false;

  for (const route of props.hideNavBarOn) {
    if (Navigation.isOnThisPage(route)) {
      isOnHideNavbarPage = true;
    }
  }

  let error: string = "";

  if (props.error && SSOAuthorizationException.isException(props.error)) {
    Navigation.navigate(
      RouteUtil.populateRouteParams(RouteMap[PageMap.PROJECT_SSO] as Route),
    );
  } else {
    error = props.error;
  }

  return (
    <div>
      <MasterPage
        footer={CAST_OPERATIONS_EMBEDDED_MODE ? undefined : <Footer />}
        header={
          CAST_OPERATIONS_EMBEDDED_MODE ? undefined : (
            <Header
              projects={props.projects}
              onProjectSelected={props.onProjectSelected}
              showProjectModal={props.showProjectModal}
              onProjectModalClose={props.onProjectModalClose}
              selectedProject={props.selectedProject || null}
            />
          )
        }
        navBar={
          CAST_OPERATIONS_EMBEDDED_MODE ? undefined : (
            <NavBar show={props.projects.length > 0 && !isOnHideNavbarPage} />
          )
        }
        isLoading={props.isLoading}
        error={error}
        topSectionClassName={
          CAST_OPERATIONS_EMBEDDED_MODE ? "bg-transparent" : undefined
        }
        topSectionContentClassName={
          CAST_OPERATIONS_EMBEDDED_MODE
            ? "w-full px-3 sm:px-4 lg:px-5"
            : undefined
        }
        className={
          CAST_OPERATIONS_EMBEDDED_MODE
            ? "flex min-h-screen flex-col bg-gray-50/40"
            : "flex flex-col h-screen"
        }
      >
        {props.children}
      </MasterPage>
    </div>
  );
};

export default DashboardMasterPage;
