import { MigrationInterface, QueryRunner } from "typeorm";

/*
 * The rebased initial schema already contains this column. IF NOT EXISTS keeps
 * fresh installations safe while preserving the upgrade path for databases
 * created before status-page MCP controls were introduced.
 */
export class AddEnableMcpServerToStatusPage1784137457184
  implements MigrationInterface
{
  public name = "AddEnableMcpServerToStatusPage1784137457184";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "StatusPage" ADD COLUMN IF NOT EXISTS "enableMcpServer" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "StatusPage" DROP COLUMN IF EXISTS "enableMcpServer"`,
    );
  }
}
