import React, { FunctionComponent, ReactElement } from "react";

/** Audit logs are included in every Cast Operations installation. */
export const isAuditLogsEnterpriseEligible: () => boolean = (): boolean => true;

export interface ComponentProps {
  title: string;
  description: string;
  featureDescription?: string | undefined;
}

const AuditLogsEnterpriseUpgrade: FunctionComponent<ComponentProps> = (
  _props: ComponentProps,
): ReactElement => <></>;

export default AuditLogsEnterpriseUpgrade;
