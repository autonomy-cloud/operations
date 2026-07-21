import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserOidcIdentity1784534785067 implements MigrationInterface {
  public name: string = "AddUserOidcIdentity1784534785067";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "UserOidcIdentity" ("_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "version" integer NOT NULL, "userId" uuid NOT NULL, "issuer" character varying NOT NULL, "subject" character varying NOT NULL, "providerType" character varying NOT NULL, "providerId" uuid, CONSTRAINT "PK_af974f5503d639abbe9d92a0ff9" PRIMARY KEY ("_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4a49412863f97e2b831609baff" ON "UserOidcIdentity" ("userId")`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_UserOidcIdentity_issuer_subject" ON "UserOidcIdentity" ("issuer", "subject")`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserOidcIdentity" ADD CONSTRAINT "FK_4a49412863f97e2b831609baffc" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "UserOidcIdentity" DROP CONSTRAINT "FK_4a49412863f97e2b831609baffc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_UserOidcIdentity_issuer_subject"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4a49412863f97e2b831609baff"`,
    );
    await queryRunner.query(`DROP TABLE "UserOidcIdentity"`);
  }
}
