// Cast Operations has no paid tiers. These compatibility exports remain so
// existing services can compile while all billing behavior stays disabled.
const IsBillingEnabled: boolean = false;
const BillingPublicKey: string = "";
const BillingPrivateKey: string = "";
const BillingWebhookSecret: string = "";

export default {
  IsBillingEnabled,
  BillingPublicKey,
  BillingPrivateKey,
  BillingWebhookSecret,
};
