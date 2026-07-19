type TemplateIdsMap = {
  readonly AlertCreated: "cast_operations_created_alert";
  readonly AlertEpisodeCreated: "cast_operations_created_alert_episode";
  readonly IncidentCreated: "cast_operations_created_incident";
  readonly IncidentEpisodeCreated: "cast_operations_created_incident_episode";
  readonly VerificationCode: "cast_operations_verification_code";
  readonly TestNotification: "cast_operations_test_notification";
  readonly IncidentCreatedOwnerNotification: "cast_operations_incident_created_owner_notification";
  readonly IncidentNotePostedOwnerNotification: "cast_operations_incident_note_posted_owner_notification";
  readonly IncidentStateChangedOwnerNotification: "cast_operations_incident_state_change_owner_notification";
  readonly IncidentOwnerAddedNotification: "cast_operations_incident_owner_added_notification";
  readonly IncidentMemberAddedNotification: "cast_operations_incident_member_added_notification";
  readonly IncidentReminderOwnerNotification: "cast_operations_incident_reminder_owner_notification";
  readonly AlertReminderOwnerNotification: "cast_operations_alert_reminder_owner_notification";
  readonly AlertCreatedOwnerNotification: "cast_operations_alert_created_owner_notification";
  readonly AlertNotePostedOwnerNotification: "cast_operations_alert_note_posted_owner_notification";
  readonly AlertStateChangedOwnerNotification: "cast_operations_alert_state_changed_owner_notification";
  readonly AlertOwnerAddedNotification: "cast_operations_alert_owner_added_notification";
  readonly AlertEpisodeCreatedOwnerNotification: "cast_operations_alert_episode_created_owner_notification";
  readonly AlertEpisodeNotePostedOwnerNotification: "cast_operations_alert_episode_note_posted_owner_notification";
  readonly AlertEpisodeStateChangedOwnerNotification: "cast_operations_alert_episode_state_changed_owner_notification";
  readonly AlertEpisodeOwnerAddedNotification: "cast_operations_alert_episode_owner_added_notification";
  readonly AlertAddedToEpisodeOwnerNotification: "cast_operations_alert_added_to_episode_owner_notification";
  readonly IncidentEpisodeCreatedOwnerNotification: "cast_operations_incident_episode_created_owner_notification";
  readonly IncidentEpisodeNotePostedOwnerNotification: "cast_operations_incident_episode_note_posted_owner_notification";
  readonly IncidentEpisodeStateChangedOwnerNotification: "cast_operations_incident_episode_state_changed_owner_notification";
  readonly IncidentEpisodeOwnerAddedNotification: "cast_operations_incident_episode_owner_added_notification";
  readonly IncidentAddedToEpisodeOwnerNotification: "cast_operations_incident_added_to_episode_owner_notification";
  readonly MonitorOwnerAddedNotification: "cast_operations_monitor_owner_added_notification";
  readonly MonitorCreatedOwnerNotification: "cast_operations_monitor_created_owner_notification";
  readonly MonitorStatusChangedOwnerNotification: "cast_operations_monitor_status_changed_owner_notification";
  readonly MonitorProbeStatusChangedNotification: "cast_operations_monitor_probe_status_changed_notification";
  readonly MonitorNoProbesMonitoringNotification: "cast_operations_monitor_no_probes_monitoring_notification";
  readonly ScheduledMaintenanceCreatedOwnerNotification: "cast_operations_scheduled_maintenance_created_owner_notification";
  readonly ScheduledMaintenanceNotePostedOwnerNotification: "cast_operations_scheduled_maintenance_note_posted_owner_notification";
  readonly ScheduledMaintenanceOwnerAddedNotification: "cast_operations_scheduled_maintenance_owner_added_notification";
  readonly ScheduledMaintenanceStateChangedOwnerNotification: "cast_operations_scheduled_maintenance_state_changed_owner_notification";
  readonly ScheduledMaintenanceReminderOwnerNotification: "cast_operations_scheduled_maintenance_reminder_owner_notification";
  readonly StatusPageAnnouncementCreatedOwnerNotification: "cast_operations_status_page_announcement_created_owner_notification";
  readonly StatusPageCreatedOwnerNotification: "cast_operations_status_page_created_owner_notification";
  readonly StatusPageOwnerAddedNotification: "cast_operations_status_page_owner_added_notification";
  readonly ProbeStatusChangedOwnerNotification: "cast_operations_probe_status_changed_owner_notification";
  readonly ProbeOwnerAddedNotification: "cast_operations_probe_owner_added_notification";
  readonly OnCallUserIsOnRosterNotification: "cast_operations_oncall_user_is_on_roster_notification";
  readonly OnCallUserIsNextNotification: "cast_operations_oncall_user_is_next_notification";
  readonly OnCallUserAddedToPolicyNotification: "cast_operations_oncall_user_added_to_policy_notification";
  readonly OnCallUserRemovedFromPolicyNotification: "cast_operations_oncall_user_removed_from_policy_notification";
  readonly OnCallUserNoLongerActiveNotification: "cast_operations_oncall_user_no_longer_active_notification";
  readonly AIAgentStatusChangedOwnerNotification: "cast_operations_ai_agent_status_changed_owner_notification";
  readonly AIAgentOwnerAddedNotification: "cast_operations_ai_agent_owner_added_notification";
};

const templateIds: TemplateIdsMap = {
  AlertCreated: "cast_operations_created_alert",
  AlertEpisodeCreated: "cast_operations_created_alert_episode",
  IncidentCreated: "cast_operations_created_incident",
  IncidentEpisodeCreated: "cast_operations_created_incident_episode",
  VerificationCode: "cast_operations_verification_code",
  TestNotification: "cast_operations_test_notification",
  IncidentCreatedOwnerNotification:
    "cast_operations_incident_created_owner_notification",
  IncidentNotePostedOwnerNotification:
    "cast_operations_incident_note_posted_owner_notification",
  IncidentStateChangedOwnerNotification:
    "cast_operations_incident_state_change_owner_notification",
  IncidentOwnerAddedNotification:
    "cast_operations_incident_owner_added_notification",
  IncidentMemberAddedNotification:
    "cast_operations_incident_member_added_notification",
  IncidentReminderOwnerNotification:
    "cast_operations_incident_reminder_owner_notification",
  AlertReminderOwnerNotification:
    "cast_operations_alert_reminder_owner_notification",
  AlertCreatedOwnerNotification:
    "cast_operations_alert_created_owner_notification",
  AlertNotePostedOwnerNotification:
    "cast_operations_alert_note_posted_owner_notification",
  AlertStateChangedOwnerNotification:
    "cast_operations_alert_state_changed_owner_notification",
  AlertOwnerAddedNotification: "cast_operations_alert_owner_added_notification",
  AlertEpisodeCreatedOwnerNotification:
    "cast_operations_alert_episode_created_owner_notification",
  AlertEpisodeNotePostedOwnerNotification:
    "cast_operations_alert_episode_note_posted_owner_notification",
  AlertEpisodeStateChangedOwnerNotification:
    "cast_operations_alert_episode_state_changed_owner_notification",
  AlertEpisodeOwnerAddedNotification:
    "cast_operations_alert_episode_owner_added_notification",
  AlertAddedToEpisodeOwnerNotification:
    "cast_operations_alert_added_to_episode_owner_notification",
  IncidentEpisodeCreatedOwnerNotification:
    "cast_operations_incident_episode_created_owner_notification",
  IncidentEpisodeNotePostedOwnerNotification:
    "cast_operations_incident_episode_note_posted_owner_notification",
  IncidentEpisodeStateChangedOwnerNotification:
    "cast_operations_incident_episode_state_changed_owner_notification",
  IncidentEpisodeOwnerAddedNotification:
    "cast_operations_incident_episode_owner_added_notification",
  IncidentAddedToEpisodeOwnerNotification:
    "cast_operations_incident_added_to_episode_owner_notification",
  MonitorOwnerAddedNotification:
    "cast_operations_monitor_owner_added_notification",
  MonitorCreatedOwnerNotification:
    "cast_operations_monitor_created_owner_notification",
  MonitorStatusChangedOwnerNotification:
    "cast_operations_monitor_status_changed_owner_notification",
  MonitorProbeStatusChangedNotification:
    "cast_operations_monitor_probe_status_changed_notification",
  MonitorNoProbesMonitoringNotification:
    "cast_operations_monitor_no_probes_monitoring_notification",
  ScheduledMaintenanceCreatedOwnerNotification:
    "cast_operations_scheduled_maintenance_created_owner_notification",
  ScheduledMaintenanceNotePostedOwnerNotification:
    "cast_operations_scheduled_maintenance_note_posted_owner_notification",
  ScheduledMaintenanceOwnerAddedNotification:
    "cast_operations_scheduled_maintenance_owner_added_notification",
  ScheduledMaintenanceStateChangedOwnerNotification:
    "cast_operations_scheduled_maintenance_state_changed_owner_notification",
  ScheduledMaintenanceReminderOwnerNotification:
    "cast_operations_scheduled_maintenance_reminder_owner_notification",
  StatusPageAnnouncementCreatedOwnerNotification:
    "cast_operations_status_page_announcement_created_owner_notification",
  StatusPageCreatedOwnerNotification:
    "cast_operations_status_page_created_owner_notification",
  StatusPageOwnerAddedNotification:
    "cast_operations_status_page_owner_added_notification",
  ProbeStatusChangedOwnerNotification:
    "cast_operations_probe_status_changed_owner_notification",
  ProbeOwnerAddedNotification: "cast_operations_probe_owner_added_notification",
  OnCallUserIsOnRosterNotification:
    "cast_operations_oncall_user_is_on_roster_notification",
  OnCallUserIsNextNotification:
    "cast_operations_oncall_user_is_next_notification",
  OnCallUserAddedToPolicyNotification:
    "cast_operations_oncall_user_added_to_policy_notification",
  OnCallUserRemovedFromPolicyNotification:
    "cast_operations_oncall_user_removed_from_policy_notification",
  OnCallUserNoLongerActiveNotification:
    "cast_operations_oncall_user_no_longer_active_notification",
  AIAgentStatusChangedOwnerNotification:
    "cast_operations_ai_agent_status_changed_owner_notification",
  AIAgentOwnerAddedNotification:
    "cast_operations_ai_agent_owner_added_notification",
} as const;

export const WhatsAppTemplateIds: TemplateIdsMap = templateIds;

export type WhatsAppTemplateIdsDefinition = typeof WhatsAppTemplateIds;

export type WhatsAppTemplateIdsMap = WhatsAppTemplateIdsDefinition;

export type WhatsAppTemplateId =
  WhatsAppTemplateIdsDefinition[keyof WhatsAppTemplateIdsDefinition];

type WhatsAppTemplateMessagesDefinition = Readonly<
  Record<WhatsAppTemplateId, string>
>;

export const WhatsAppTemplateMessages: WhatsAppTemplateMessagesDefinition = {
  [WhatsAppTemplateIds.AlertCreated]: `A new alert #{{alert_number}} ({{alert_title}}) has been created for project {{project_name}}. To acknowledge this alert, open {{acknowledge_url}} to respond. For more information, please check out this alert {{alert_link}} on the Cast Operations dashboard.`,
  [WhatsAppTemplateIds.AlertEpisodeCreated]: `A new alert episode #{{episode_number}} ({{episode_title}}) has been created for project {{project_name}}. To acknowledge this alert episode, open {{acknowledge_url}} to respond. For more information, please check out this alert episode {{episode_link}} on the Cast Operations dashboard.`,
  [WhatsAppTemplateIds.IncidentCreated]: `A new incident #{{incident_number}} ({{incident_title}}) has been created for project {{project_name}}. To acknowledge this incident, open {{acknowledge_url}} to respond. For more information, please check out this incident {{incident_link}} on the Cast Operations dashboard.`,
  [WhatsAppTemplateIds.IncidentEpisodeCreated]: `A new incident episode #{{episode_number}} ({{episode_title}}) has been created for project {{project_name}}. To acknowledge this incident episode, open {{acknowledge_url}} to respond. For more information, please check out this incident episode {{episode_link}} on the Cast Operations dashboard.`,
  [WhatsAppTemplateIds.VerificationCode]: `{{1}} is your verification code. For your security, do not share this code.`,
  [WhatsAppTemplateIds.TestNotification]: `This is a WhatsApp test message from Cast Operations to verify your integration. No action is required.`,
  [WhatsAppTemplateIds.IncidentCreatedOwnerNotification]: `Incident #{{incident_number}} ({{incident_title}}) has been created for project {{project_name}}. View incident details using {{incident_link}} on the Cast Operations dashboard for complete context.`,
  [WhatsAppTemplateIds.IncidentNotePostedOwnerNotification]: `A new note was posted on incident #{{incident_number}} ({{incident_title}}). Review the incident using {{incident_link}} on the Cast Operations dashboard for more context.`,
  [WhatsAppTemplateIds.IncidentStateChangedOwnerNotification]: `Incident #{{incident_number}} ({{incident_title}}) state changed to {{incident_state}}. Track the incident status using {{incident_link}} on the Cast Operations dashboard for more context.`,
  [WhatsAppTemplateIds.IncidentOwnerAddedNotification]: `You have been added as an owner of incident #{{incident_number}} ({{incident_title}}). Manage the incident using {{incident_link}} on the Cast Operations dashboard.`,
  [WhatsAppTemplateIds.IncidentMemberAddedNotification]: `You have been assigned as {{incident_role}} to incident #{{incident_number}} ({{incident_title}}). Manage the incident using {{incident_link}} on the Cast Operations dashboard.`,
  [WhatsAppTemplateIds.IncidentReminderOwnerNotification]: `Reminder: Incident #{{incident_number}} ({{incident_title}}) is still {{incident_state}} and has been open for {{elapsed_time}}. Review the incident using {{incident_link}} on the Cast Operations dashboard.`,
  [WhatsAppTemplateIds.AlertReminderOwnerNotification]: `Reminder: Alert #{{alert_number}} ({{alert_title}}) is still {{alert_state}} and has been open for {{elapsed_time}}. Review the alert using {{alert_link}} on the Cast Operations dashboard.`,
  [WhatsAppTemplateIds.AlertCreatedOwnerNotification]: `Alert #{{alert_number}} ({{alert_title}}) has been created for project {{project_name}}. View alert details using {{alert_link}} on the Cast Operations dashboard `,
  [WhatsAppTemplateIds.AlertNotePostedOwnerNotification]: `A new note was posted on alert #{{alert_number}} ({{alert_title}}). Review the alert using {{alert_link}} on the Cast Operations dashboard for updates.`,
  [WhatsAppTemplateIds.AlertStateChangedOwnerNotification]: `Alert #{{alert_number}} ({{alert_title}}) state changed to {{alert_state}}. Track the alert status using {{alert_link}} on the Cast Operations dashboard to stay informed.`,
  [WhatsAppTemplateIds.AlertOwnerAddedNotification]: `You have been added as an owner of alert #{{alert_number}} ({{alert_title}}). Manage the alert using {{alert_link}} on the Cast Operations dashboard to take action.`,
  [WhatsAppTemplateIds.AlertEpisodeCreatedOwnerNotification]: `Alert Episode #{{episode_number}} ({{episode_title}}) has been created for project {{project_name}}. View alert episode details using {{episode_link}} on the Cast Operations dashboard.`,
  [WhatsAppTemplateIds.AlertEpisodeNotePostedOwnerNotification]: `A new note was posted on alert episode #{{episode_number}} ({{episode_title}}). Review the alert episode using {{episode_link}} on the Cast Operations dashboard for updates.`,
  [WhatsAppTemplateIds.AlertEpisodeStateChangedOwnerNotification]: `Alert Episode #{{episode_number}} ({{episode_title}}) state changed to {{episode_state}}. Track the alert episode status using {{episode_link}} on the Cast Operations dashboard.`,
  [WhatsAppTemplateIds.AlertEpisodeOwnerAddedNotification]: `You have been added as an owner of alert episode #{{episode_number}} ({{episode_title}}). Manage the alert episode using {{episode_link}} on the Cast Operations dashboard.`,
  [WhatsAppTemplateIds.AlertAddedToEpisodeOwnerNotification]: `{{alert_count}} new alert(s) were added to alert episode #{{episode_number}} ({{episode_title}}). Review the alert episode using {{episode_link}} on the Cast Operations dashboard.`,
  [WhatsAppTemplateIds.IncidentEpisodeCreatedOwnerNotification]: `Incident Episode #{{episode_number}} ({{episode_title}}) has been created for project {{project_name}}. View incident episode details using {{episode_link}} on the Cast Operations dashboard.`,
  [WhatsAppTemplateIds.IncidentEpisodeNotePostedOwnerNotification]: `A new note was posted on incident episode #{{episode_number}} ({{episode_title}}). Review the incident episode using {{episode_link}} on the Cast Operations dashboard for updates.`,
  [WhatsAppTemplateIds.IncidentEpisodeStateChangedOwnerNotification]: `Incident Episode #{{episode_number}} ({{episode_title}}) state changed to {{episode_state}}. Track the incident episode status using {{episode_link}} on the Cast Operations dashboard.`,
  [WhatsAppTemplateIds.IncidentEpisodeOwnerAddedNotification]: `You have been added as an owner of incident episode #{{episode_number}} ({{episode_title}}). Manage the incident episode using {{episode_link}} on the Cast Operations dashboard.`,
  [WhatsAppTemplateIds.IncidentAddedToEpisodeOwnerNotification]: `{{incident_count}} new incident(s) were added to incident episode #{{episode_number}} ({{episode_title}}). Review the incident episode using {{episode_link}} on the Cast Operations dashboard.`,
  [WhatsAppTemplateIds.MonitorOwnerAddedNotification]: `You have been added as an owner of monitor {{monitor_name}}. Manage the monitor using {{monitor_link}} on the Cast Operations dashboard to keep things running.`,
  [WhatsAppTemplateIds.MonitorCreatedOwnerNotification]: `Monitor {{monitor_name}} has been created. Check monitor {{monitor_link}} on the Cast Operations dashboard `,
  [WhatsAppTemplateIds.MonitorStatusChangedOwnerNotification]: `Monitor {{monitor_name}} status changed to {{monitor_status}}. Check the monitor status using {{monitor_link}} on the Cast Operations dashboard to stay informed.`,
  [WhatsAppTemplateIds.MonitorProbeStatusChangedNotification]: `Probes for monitor {{monitor_name}} are {{probe_status}}. Review probe details using {{monitor_link}} on the Cast Operations dashboard for more insight.`,
  [WhatsAppTemplateIds.MonitorNoProbesMonitoringNotification]: `No probes are monitoring monitor {{monitor_name}}. Please check the monitor using {{monitor_link}} on the Cast Operations dashboard to restore coverage.`,
  [WhatsAppTemplateIds.ScheduledMaintenanceCreatedOwnerNotification]: `Scheduled maintenance #{{event_number}} ({{event_title}}) has been created. View event details using {{maintenance_link}} on the Cast Operations dashboard to prepare.`,
  [WhatsAppTemplateIds.ScheduledMaintenanceNotePostedOwnerNotification]: `A new note was posted on scheduled maintenance #{{event_number}} ({{event_title}}). Review the event using {{maintenance_link}} on the Cast Operations dashboard for the latest updates.`,
  [WhatsAppTemplateIds.ScheduledMaintenanceOwnerAddedNotification]: `You have been added as an owner of scheduled maintenance #{{event_number}} ({{event_title}}). Please check the event using {{maintenance_link}} on the Cast Operations dashboard.`,
  [WhatsAppTemplateIds.ScheduledMaintenanceStateChangedOwnerNotification]: `Scheduled maintenance #{{event_number}} ({{event_title}}) state changed to {{event_state}}. Track event status using {{maintenance_link}} on the Cast Operations dashboard to stay aligned.`,
  [WhatsAppTemplateIds.ScheduledMaintenanceReminderOwnerNotification]: `Reminder: Scheduled maintenance #{{event_number}} ({{event_title}}) is still {{event_state}} and has been open for {{elapsed_time}}. Review the event using {{event_link}} on the Cast Operations dashboard.`,
  [WhatsAppTemplateIds.StatusPageAnnouncementCreatedOwnerNotification]: `Announcement {{announcement_title}} was published on status page {{status_page_name}}. View the announcement using {{status_page_link}} on the Cast Operations dashboard `,
  [WhatsAppTemplateIds.StatusPageCreatedOwnerNotification]: `Status page {{status_page_name}} has been created. View status page details using {{status_page_link}} on the Cast Operations dashboard for full context.`,
  [WhatsAppTemplateIds.StatusPageOwnerAddedNotification]: `You have been added as an owner of status page {{status_page_name}}. Manage the status page using {{status_page_link}} on the Cast Operations dashboard to stay engaged.`,
  [WhatsAppTemplateIds.ProbeStatusChangedOwnerNotification]: `Probe {{probe_name}} status is {{probe_status}}. Review the probe using {{probe_link}} on the Cast Operations dashboard for specifics.`,
  [WhatsAppTemplateIds.ProbeOwnerAddedNotification]: `You have been added as an owner of probe {{probe_name}}. Manage the probe using {{probe_link}} on the Cast Operations dashboard to take action.`,
  [WhatsAppTemplateIds.OnCallUserIsOnRosterNotification]: `You are now on-call for policy {{on_call_policy_name}} on schedule {{schedule_name}}. View the on-call schedule using {{schedule_link}} on the Cast Operations dashboard to plan ahead.`,
  [WhatsAppTemplateIds.OnCallUserIsNextNotification]: `You are next on-call for policy {{on_call_policy_name}} on schedule {{schedule_name}}. Prepare for your shift using {{schedule_link}} on the Cast Operations dashboard for the latest details.`,
  [WhatsAppTemplateIds.OnCallUserAddedToPolicyNotification]: `You have been added to on-call policy {{on_call_policy_name}} for {{on_call_context}}. Review the on-call policy using {{policy_link}} on the Cast Operations dashboard for full guidelines.`,
  [WhatsAppTemplateIds.OnCallUserRemovedFromPolicyNotification]: `You have been removed from on-call policy {{on_call_policy_name}} for {{on_call_context}}. View on-call policies using {{policy_link}} on the Cast Operations dashboard for updates.`,
  [WhatsAppTemplateIds.OnCallUserNoLongerActiveNotification]: `You are no longer on-call for policy {{on_call_policy_name}} on schedule {{schedule_name}}. Review your schedule using {{schedule_link}} on the Cast Operations dashboard to stay informed.`,
  [WhatsAppTemplateIds.AIAgentStatusChangedOwnerNotification]: `AI Agent {{ai_agent_name}} status is {{ai_agent_status}}. Review the AI agent using {{ai_agent_link}} on the Cast Operations dashboard for specifics.`,
  [WhatsAppTemplateIds.AIAgentOwnerAddedNotification]: `You have been added as an owner of AI Agent {{ai_agent_name}}. Manage the AI agent using {{ai_agent_link}} on the Cast Operations dashboard to take action.`,
};

export const WhatsAppTemplateLanguage: Record<WhatsAppTemplateId, string> = {
  [WhatsAppTemplateIds.AlertCreated]: "en",
  [WhatsAppTemplateIds.AlertEpisodeCreated]: "en",
  [WhatsAppTemplateIds.IncidentCreated]: "en",
  [WhatsAppTemplateIds.IncidentEpisodeCreated]: "en",
  [WhatsAppTemplateIds.VerificationCode]: "en",
  [WhatsAppTemplateIds.TestNotification]: "en",
  [WhatsAppTemplateIds.IncidentCreatedOwnerNotification]: "en",
  [WhatsAppTemplateIds.IncidentNotePostedOwnerNotification]: "en",
  [WhatsAppTemplateIds.IncidentStateChangedOwnerNotification]: "en",
  [WhatsAppTemplateIds.IncidentOwnerAddedNotification]: "en",
  [WhatsAppTemplateIds.IncidentMemberAddedNotification]: "en",
  [WhatsAppTemplateIds.IncidentReminderOwnerNotification]: "en",
  [WhatsAppTemplateIds.AlertReminderOwnerNotification]: "en",
  [WhatsAppTemplateIds.AlertCreatedOwnerNotification]: "en",
  [WhatsAppTemplateIds.AlertNotePostedOwnerNotification]: "en",
  [WhatsAppTemplateIds.AlertStateChangedOwnerNotification]: "en",
  [WhatsAppTemplateIds.AlertOwnerAddedNotification]: "en",
  [WhatsAppTemplateIds.AlertEpisodeCreatedOwnerNotification]: "en",
  [WhatsAppTemplateIds.AlertEpisodeNotePostedOwnerNotification]: "en",
  [WhatsAppTemplateIds.AlertEpisodeStateChangedOwnerNotification]: "en",
  [WhatsAppTemplateIds.AlertEpisodeOwnerAddedNotification]: "en",
  [WhatsAppTemplateIds.AlertAddedToEpisodeOwnerNotification]: "en",
  [WhatsAppTemplateIds.IncidentEpisodeCreatedOwnerNotification]: "en",
  [WhatsAppTemplateIds.IncidentEpisodeNotePostedOwnerNotification]: "en",
  [WhatsAppTemplateIds.IncidentEpisodeStateChangedOwnerNotification]: "en",
  [WhatsAppTemplateIds.IncidentEpisodeOwnerAddedNotification]: "en",
  [WhatsAppTemplateIds.IncidentAddedToEpisodeOwnerNotification]: "en",
  [WhatsAppTemplateIds.MonitorOwnerAddedNotification]: "en",
  [WhatsAppTemplateIds.MonitorCreatedOwnerNotification]: "en",
  [WhatsAppTemplateIds.MonitorStatusChangedOwnerNotification]: "en",
  [WhatsAppTemplateIds.MonitorProbeStatusChangedNotification]: "en",
  [WhatsAppTemplateIds.MonitorNoProbesMonitoringNotification]: "en",
  [WhatsAppTemplateIds.ScheduledMaintenanceCreatedOwnerNotification]: "en",
  [WhatsAppTemplateIds.ScheduledMaintenanceNotePostedOwnerNotification]: "en",
  [WhatsAppTemplateIds.ScheduledMaintenanceOwnerAddedNotification]: "en",
  [WhatsAppTemplateIds.ScheduledMaintenanceStateChangedOwnerNotification]: "en",
  [WhatsAppTemplateIds.ScheduledMaintenanceReminderOwnerNotification]: "en",
  [WhatsAppTemplateIds.StatusPageAnnouncementCreatedOwnerNotification]: "en",
  [WhatsAppTemplateIds.StatusPageCreatedOwnerNotification]: "en",
  [WhatsAppTemplateIds.StatusPageOwnerAddedNotification]: "en",
  [WhatsAppTemplateIds.ProbeStatusChangedOwnerNotification]: "en",
  [WhatsAppTemplateIds.ProbeOwnerAddedNotification]: "en",
  [WhatsAppTemplateIds.OnCallUserIsOnRosterNotification]: "en",
  [WhatsAppTemplateIds.OnCallUserIsNextNotification]: "en",
  [WhatsAppTemplateIds.OnCallUserAddedToPolicyNotification]: "en",
  [WhatsAppTemplateIds.OnCallUserRemovedFromPolicyNotification]: "en",
  [WhatsAppTemplateIds.OnCallUserNoLongerActiveNotification]: "en",
  [WhatsAppTemplateIds.AIAgentStatusChangedOwnerNotification]: "en",
  [WhatsAppTemplateIds.AIAgentOwnerAddedNotification]: "en",
};

// Authentication templates that require OTP button components
export const AuthenticationTemplates: Set<WhatsAppTemplateId> = new Set([
  WhatsAppTemplateIds.VerificationCode,
]);

export function renderWhatsAppTemplate(
  templateId: WhatsAppTemplateId,
  variables: Record<string, string>,
): string {
  const template: string | undefined = WhatsAppTemplateMessages[templateId];

  if (!template) {
    throw new Error(`WhatsApp template ${templateId} is not defined.`);
  }

  return template.replace(/\{\{(.*?)\}\}/g, (_match: string, key: string) => {
    if (variables[key] === undefined) {
      throw new Error(
        `Missing variable "${key}" for WhatsApp template ${templateId}.`,
      );
    }

    return variables[key] as string;
  });
}

export default WhatsAppTemplateMessages;
