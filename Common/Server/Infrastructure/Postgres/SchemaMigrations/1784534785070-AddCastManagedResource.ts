import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCastManagedResource1784534785070 implements MigrationInterface {
  public name: string = "AddCastManagedResource1784534785070";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "CastIntegrationResource" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "installationId" uuid NOT NULL, "bindingId" uuid NOT NULL, "castWorkspaceId" uuid NOT NULL, "projectId" uuid NOT NULL, "localObjectUniversalIdentifier" uuid NOT NULL, "localRecordId" uuid NOT NULL, "externalResourceType" character varying(32) NOT NULL, "remoteResourceId" uuid NOT NULL, "sourceUpdatedAt" TIMESTAMP WITH TIME ZONE, "status" character varying(32) NOT NULL DEFAULT 'PROVISIONING', CONSTRAINT "PK_CastIntegrationResource" PRIMARY KEY ("_id"), CONSTRAINT "UQ_CastIntegrationResource_bindingId" UNIQUE ("bindingId"), CONSTRAINT "UQ_CastIntegrationResource_remote" UNIQUE ("externalResourceType", "remoteResourceId"), CONSTRAINT "CHK_CastIntegrationResource_type" CHECK ("externalResourceType" IN ('SERVICE', 'INCIDENT')), CONSTRAINT "CHK_CastIntegrationResource_status" CHECK ("status" IN ('PROVISIONING', 'ACTIVE', 'DELETED')))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CastIntegrationResource_workspace_record" ON "CastIntegrationResource" ("castWorkspaceId", "localObjectUniversalIdentifier", "localRecordId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "CastIntegrationResource" ADD CONSTRAINT "FK_CastIntegrationResource_installationId" FOREIGN KEY ("installationId") REFERENCES "CastIntegrationInstallation"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "CastIntegrationResource" ADD CONSTRAINT "FK_CastIntegrationResource_projectId" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "CastIntegrationResource"`);
  }
}
