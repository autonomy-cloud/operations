import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCastManagedMembership1784534785069
  implements MigrationInterface
{
  public name: string = "AddCastManagedMembership1784534785069";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "CastIntegrationMembership" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "installationId" uuid NOT NULL, "projectId" uuid NOT NULL, "userId" uuid NOT NULL, "teamMemberId" uuid NOT NULL, "role" character varying(32) NOT NULL, CONSTRAINT "PK_CastIntegrationMembership" PRIMARY KEY ("_id"), CONSTRAINT "UQ_CastIntegrationMembership_scope_user" UNIQUE ("installationId", "projectId", "userId"), CONSTRAINT "UQ_CastIntegrationMembership_teamMemberId" UNIQUE ("teamMemberId"), CONSTRAINT "CHK_CastIntegrationMembership_role" CHECK ("role" IN ('OWNER', 'MEMBER')))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CastIntegrationMembership_projectId_userId" ON "CastIntegrationMembership" ("projectId", "userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "CastIntegrationMembership" ADD CONSTRAINT "FK_CastIntegrationMembership_installationId" FOREIGN KEY ("installationId") REFERENCES "CastIntegrationInstallation"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "CastIntegrationMembership" ADD CONSTRAINT "FK_CastIntegrationMembership_projectId" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "CastIntegrationMembership" ADD CONSTRAINT "FK_CastIntegrationMembership_userId" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "CastIntegrationMembership" ADD CONSTRAINT "FK_CastIntegrationMembership_teamMemberId" FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "CastIntegrationMembership"`);
  }
}
