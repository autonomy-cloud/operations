import IconProp from "Common/Types/Icon/IconProp";
import React, { FunctionComponent, ReactElement } from "react";

/**
 * Compatibility helper for pages that previously checked an edition gate.
 * Cast Operations ships every capability in one complete distribution.
 */
export const isEnterpriseFeatureEligible: () => boolean = (): boolean => true;

export interface Benefit {
  icon: IconProp;
  title: string;
  subtitle: string;
}

export interface ComponentProps {
  title: string;
  description: string;
  featureName: string;
  featureDescription?: string | undefined;
  benefits: Array<Benefit>;
}

const EnterpriseFeatureUpgrade: FunctionComponent<ComponentProps> = (
  _props: ComponentProps,
): ReactElement => <></>;

export default EnterpriseFeatureUpgrade;
