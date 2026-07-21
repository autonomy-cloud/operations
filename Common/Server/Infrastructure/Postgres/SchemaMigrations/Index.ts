import InitialMigration from "./1717605043663-InitialMigration";
import { AddUserOidcIdentity1784534785067 } from "./1784534785067-AddUserOidcIdentity";
import { AddCastIntegrationInstallation1784534785068 } from "./1784534785068-AddCastIntegrationInstallation";
import { AddCastManagedMembership1784534785069 } from "./1784534785069-AddCastManagedMembership";
import { AddCastManagedResource1784534785070 } from "./1784534785070-AddCastManagedResource";
import { EnforceCastManagedProjectIdentity1784534785071 } from "./1784534785071-EnforceCastManagedProjectIdentity";

export default [
  InitialMigration,
  AddUserOidcIdentity1784534785067,
  AddCastIntegrationInstallation1784534785068,
  AddCastManagedMembership1784534785069,
  AddCastManagedResource1784534785070,
  EnforceCastManagedProjectIdentity1784534785071,
];
