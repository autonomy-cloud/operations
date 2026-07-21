import Migrations from "Common/Server/Infrastructure/Postgres/SchemaMigrations/Index";
import { describe, expect, jest, test } from "@jest/globals";
import type { Mock } from "jest-mock";

type QueryFunction = (
  sql: string,
  parameters?: Array<unknown>,
) => Promise<unknown>;
type RecordedMigration = {
  name?: string;
  up: (queryRunner: never) => Promise<unknown>;
};
type MigrationConstructor = new () => RecordedMigration;

const MigrationChain: Array<MigrationConstructor> =
  Migrations as unknown as Array<MigrationConstructor>;

async function recordedStatements(
  migration: RecordedMigration,
): Promise<Array<string>> {
  const query: Mock<QueryFunction> = jest.fn<QueryFunction>();
  query.mockResolvedValue(undefined);

  await migration.up({ query } as never);

  return query.mock.calls.map(
    (call: [sql: string, parameters?: Array<unknown> | undefined]) => {
      return call[0];
    },
  );
}

describe("Postgres schema migration chain", () => {
  test("keeps the Cast integration migrations in dependency order", () => {
    expect(
      MigrationChain.slice(-5).map((migration: MigrationConstructor) => {
        return new migration().name;
      }),
    ).toEqual([
      "AddUserOidcIdentity1784534785067",
      "AddCastIntegrationInstallation1784534785068",
      "AddCastManagedMembership1784534785069",
      "AddCastManagedResource1784534785070",
      "EnforceCastManagedProjectIdentity1784534785071",
    ]);
  });

  test("does not mutate the already-released OIDC migration with later integration DDL", async () => {
    const OidcMigration: MigrationConstructor =
      MigrationChain[MigrationChain.length - 5]!;
    const statements: Array<string> = await recordedStatements(
      new OidcMigration(),
    );
    const sql: string = statements.join("\n");

    expect(sql).toContain('CREATE TABLE "UserOidcIdentity"');
    expect(sql).not.toContain("CastIntegration");
    expect(sql).not.toContain("castWorkspaceId");
  });

  test("creates integration prerequisites before dependent membership and resource tables", async () => {
    const statementsByMigration: Array<Array<string>> = await Promise.all(
      MigrationChain.slice(-4, -1).map(
        async (migration: MigrationConstructor) => {
          return await recordedStatements(new migration());
        },
      ),
    );
    const installationSql: string = statementsByMigration[0]!.join("\n");
    const membershipSql: string = statementsByMigration[1]!.join("\n");
    const resourceSql: string = statementsByMigration[2]!.join("\n");

    expect(installationSql).toContain(
      'CREATE TABLE "CastIntegrationInstallation"',
    );
    expect(installationSql).toContain('CREATE TABLE "CastIntegrationInbox"');
    expect(membershipSql).toContain('CREATE TABLE "CastIntegrationMembership"');
    expect(resourceSql).toContain('CREATE TABLE "CastIntegrationResource"');
  });

  test("backfills Cast-managed projects to require the matching Cast installation", async () => {
    const IdentityMigration: MigrationConstructor =
      MigrationChain[MigrationChain.length - 1]!;
    const statements: Array<string> = await recordedStatements(
      new IdentityMigration(),
    );
    const sql: string = statements.join("\n");

    expect(sql).toContain('UPDATE "Project" AS project');
    expect(sql).toContain('"requireSsoForLogin" = true');
    expect(sql).toContain('"requireSsoWithSsoProviderId" = installation."_id"');
    expect(sql).toContain("installation.\"status\" = 'ACTIVE'");
  });

  test("contains no duplicate CREATE INDEX identifiers in the fresh-install baseline", async () => {
    const InitialMigration: MigrationConstructor = MigrationChain[0]!;
    const statements: Array<string> = await recordedStatements(
      new InitialMigration(),
    );
    const indexNames: Array<string> = statements.flatMap(
      (statement: string) => {
        const match: RegExpMatchArray | null = statement.match(
          /CREATE (?:UNIQUE )?INDEX "([^"]+)"/,
        );
        return match?.[1] ? [match[1]] : [];
      },
    );

    expect(new Set(indexNames).size).toBe(indexNames.length);
  });
});
