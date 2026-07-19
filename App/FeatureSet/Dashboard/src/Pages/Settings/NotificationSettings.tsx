import CustomCallSMSTable from "../../Components/CallSMS/CallSMSConfigTable";
import CustomSMTPTable from "../../Components/CustomSMTP/CustomSMTPTable";
import Project from "Common/Models/DatabaseModels/Project";
import FormFieldSchemaType from "Common/UI/Components/Forms/Types/FormFieldSchemaType";
import CardModelDetail from "Common/UI/Components/ModelDetail/CardModelDetail";
import FieldType from "Common/UI/Components/Types/FieldType";
import ProjectUtil from "Common/UI/Utils/Project";
import React, { Fragment, FunctionComponent, ReactElement } from "react";
import PageComponentProps from "../PageComponentProps";

type NotificationField = {
  field: Partial<
    Pick<
      Project,
      | "enableCallNotifications"
      | "enableWhatsAppNotifications"
      | "enableTelegramNotifications"
      | "enableSmsNotifications"
    >
  >;
  title: string;
  description: string;
};

const notificationFields: Array<NotificationField> = [
  {
    field: { enableCallNotifications: true },
    title: "Enable Call Notifications",
    description: "Enable phone-call alerts for this project.",
  },
  {
    field: { enableWhatsAppNotifications: true },
    title: "Enable WhatsApp Notifications",
    description: "Enable WhatsApp alerts for this project.",
  },
  {
    field: { enableTelegramNotifications: true },
    title: "Enable Telegram Notifications",
    description: "Enable Telegram alerts for this project.",
  },
  {
    field: { enableSmsNotifications: true },
    title: "Enable SMS Notifications",
    description: "Enable SMS alerts for this project.",
  },
];

const Settings: FunctionComponent<PageComponentProps> = (): ReactElement => {
  return (
    <Fragment>
      <CardModelDetail
        name="Enable Notifications"
        cardProps={{
          title: "Enable Notifications",
          description:
            "Enable Call, SMS, WhatsApp, and Telegram notifications for this project.",
        }}
        isEditable={true}
        editButtonText="Edit Notification Settings"
        formFields={notificationFields.map((field: NotificationField) => {
          return {
            ...field,
            fieldType: FormFieldSchemaType.Toggle,
            required: false,
          };
        })}
        modelDetailProps={{
          modelType: Project,
          id: "notifications",
          fields: notificationFields.map((field: NotificationField) => {
            return {
              ...field,
              fieldType: FieldType.Boolean,
              placeholder: "Not Enabled",
            };
          }),
          modelId: ProjectUtil.getCurrentProjectId()!,
        }}
      />
      <CustomSMTPTable />
      <CustomCallSMSTable />
    </Fragment>
  );
};

export default Settings;
