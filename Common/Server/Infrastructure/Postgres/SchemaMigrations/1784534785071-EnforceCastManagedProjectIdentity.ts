import { MigrationInterface, QueryRunner } from "typeorm";

export class EnforceCastManagedProjectIdentity1784534785071
  implements MigrationInterface
{
  public name: string = "EnforceCastManagedProjectIdentity1784534785071";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "Project" AS project
       SET "requireSsoForLogin" = true,
           "requireSsoWithSsoProviderId" = installation."_id",
           "updatedAt" = now()
       FROM "CastIntegrationInstallation" AS installation
       WHERE project."castWorkspaceId" = installation."castWorkspaceId"
         AND installation."appAudience" = 'cfbee3be-a307-4e55-be94-bd3ab0bc8e6f'
         AND installation."status" = 'ACTIVE'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "Project" AS project
       SET "requireSsoForLogin" = false,
           "requireSsoWithSsoProviderId" = NULL,
           "updatedAt" = now()
       FROM "CastIntegrationInstallation" AS installation
       WHERE project."castWorkspaceId" = installation."castWorkspaceId"
         AND project."requireSsoWithSsoProviderId" = installation."_id"
         AND installation."appAudience" = 'cfbee3be-a307-4e55-be94-bd3ab0bc8e6f'`,
    );
  }
}
