import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCastIntegrationInstallation1784534785068
  implements MigrationInterface
{
  public name: string = "AddCastIntegrationInstallation1784534785068";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Project" ADD "castWorkspaceId" uuid`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_Project_castWorkspaceId" ON "Project" ("castWorkspaceId") WHERE "castWorkspaceId" IS NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "ProjectOIDC" ADD "allowAccountLinkingByVerifiedEmail" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "GlobalOIDC" ADD "allowAccountLinkingByVerifiedEmail" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `CREATE TABLE "CastIntegrationInstallation" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "connectionId" uuid NOT NULL, "castWorkspaceId" uuid NOT NULL, "sharedSecret" text NOT NULL, "serviceUserId" uuid NOT NULL, "castIssuer" text NOT NULL, "appAudience" character varying(255) NOT NULL, "allowAccountLinkingByVerifiedEmail" boolean NOT NULL DEFAULT false, "status" character varying(32) NOT NULL DEFAULT 'ACTIVE', "lastEventAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_CastIntegrationInstallation" PRIMARY KEY ("_id"), CONSTRAINT "UQ_CastIntegrationInstallation_connectionId" UNIQUE ("connectionId"), CONSTRAINT "CHK_CastIntegrationInstallation_status" CHECK ("status" IN ('ACTIVE', 'DISABLED', 'REVOKED')))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CastIntegrationInstallation_workspaceId" ON "CastIntegrationInstallation" ("castWorkspaceId")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_CastIntegrationInstallation_workspace_audience_active" ON "CastIntegrationInstallation" ("castWorkspaceId", "appAudience") WHERE "status" = 'ACTIVE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "CastIntegrationInstallation" ADD CONSTRAINT "FK_CastIntegrationInstallation_serviceUserId" FOREIGN KEY ("serviceUserId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE TABLE "CastIntegrationInbox" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "eventId" uuid NOT NULL, "idempotencyKey" character varying(255) NOT NULL, "connectionId" uuid NOT NULL, "castWorkspaceId" uuid NOT NULL, "eventType" character varying(100) NOT NULL, "aggregateVersion" integer NOT NULL, "status" character varying(32) NOT NULL DEFAULT 'PROCESSING', "attemptCount" integer NOT NULL DEFAULT 1, "maxAttempts" integer NOT NULL DEFAULT 12, "lockedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "payload" jsonb NOT NULL DEFAULT '{}'::jsonb, "response" jsonb, "errorCode" character varying(255), "errorMessage" text, "processedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_CastIntegrationInbox" PRIMARY KEY ("_id"), CONSTRAINT "UQ_CastIntegrationInbox_eventId" UNIQUE ("eventId"), CONSTRAINT "UQ_CastIntegrationInbox_idempotencyKey" UNIQUE ("idempotencyKey"), CONSTRAINT "CHK_CastIntegrationInbox_status" CHECK ("status" IN ('PROCESSING', 'PROCESSED', 'FAILED')), CONSTRAINT "CHK_CastIntegrationInbox_attempts" CHECK ("attemptCount" >= 1 AND "maxAttempts" > 0 AND "attemptCount" <= "maxAttempts"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_CastIntegrationInbox_connectionId_createdAt" ON "CastIntegrationInbox" ("connectionId", "createdAt")`,
    );
    await queryRunner.query(
      `ALTER TABLE "CastIntegrationInbox" ADD CONSTRAINT "FK_CastIntegrationInbox_connectionId" FOREIGN KEY ("connectionId") REFERENCES "CastIntegrationInstallation"("connectionId") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "CastIntegrationInbox" DROP CONSTRAINT "FK_CastIntegrationInbox_connectionId"`,
    );
    await queryRunner.query(`DROP TABLE "CastIntegrationInbox"`);
    await queryRunner.query(
      `ALTER TABLE "CastIntegrationInstallation" DROP CONSTRAINT "FK_CastIntegrationInstallation_serviceUserId"`,
    );
    await queryRunner.query(`DROP TABLE "CastIntegrationInstallation"`);
    await queryRunner.query(
      `ALTER TABLE "ProjectOIDC" DROP COLUMN "allowAccountLinkingByVerifiedEmail"`,
    );
    await queryRunner.query(
      `ALTER TABLE "GlobalOIDC" DROP COLUMN "allowAccountLinkingByVerifiedEmail"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_Project_castWorkspaceId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Project" DROP COLUMN "castWorkspaceId"`,
    );
  }
}
