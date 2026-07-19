import PageComponentProps from "../PageComponentProps";
import React, { FunctionComponent, ReactElement } from "react";
import ProfilesDashboard from "../../Components/Profiles/ProfilesDashboard";

const ProfilesPage: FunctionComponent<
  PageComponentProps
> = (): ReactElement => {
  return <ProfilesDashboard />;
};

export default ProfilesPage;
