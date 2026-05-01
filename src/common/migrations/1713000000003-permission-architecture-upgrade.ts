import { MigrationInterface, QueryRunner } from 'typeorm';

export class PermissionArchitectureUpgrade1713000000003 implements MigrationInterface {
  name = 'PermissionArchitectureUpgrade1713000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "permission_group" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" character varying(120) NOT NULL UNIQUE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      INSERT INTO "permission_group" ("name")
      VALUES ('General')
      ON CONFLICT ("name") DO NOTHING;
    `);

    await queryRunner.query(`
      ALTER TABLE "permission"
      ADD COLUMN IF NOT EXISTS "name" character varying(255);
    `);
    await queryRunner.query(`
      ALTER TABLE "permission"
      ADD COLUMN IF NOT EXISTS "permissionGroupId" uuid;
    `);
    await queryRunner.query(`
      ALTER TABLE "permission"
      ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP NOT NULL DEFAULT now();
    `);
    await queryRunner.query(`
      ALTER TABLE "permission"
      ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP NOT NULL DEFAULT now();
    `);

    await queryRunner.query(`
      UPDATE "permission"
      SET "name" = COALESCE("name", UPPER("method") || ' ' || REPLACE(TRIM(LEADING '/' FROM "endpoint"), '/', ' '))
      WHERE "name" IS NULL;
    `);
    await queryRunner.query(`
      UPDATE "permission"
      SET "permissionGroupId" = (
        SELECT "id" FROM "permission_group" WHERE "name" = 'General' LIMIT 1
      )
      WHERE "permissionGroupId" IS NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE "permission"
      ALTER COLUMN "name" SET NOT NULL;
    `);
    await queryRunner.query(`
      ALTER TABLE "permission"
      ALTER COLUMN "permissionGroupId" SET NOT NULL;
    `);
    await queryRunner.query(`
      ALTER TABLE "permission"
      DROP CONSTRAINT IF EXISTS "UQ_permission_endpoint";
    `);
    await queryRunner.query(`
      ALTER TABLE "permission"
      DROP CONSTRAINT IF EXISTS "permission_endpoint_key";
    `);
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_permission_endpoint_method_unique";
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_permission_endpoint_method_unique"
      ON "permission" ("endpoint", "method");
    `);
    await queryRunner.query(`
      ALTER TABLE "permission"
      ADD CONSTRAINT "FK_permission_permissionGroupId"
      FOREIGN KEY ("permissionGroupId") REFERENCES "permission_group"("id") ON DELETE RESTRICT;
    `);

    await queryRunner.query(`
      ALTER TABLE "user_type_permission"
      ADD COLUMN IF NOT EXISTS "userTypeId" uuid;
    `);
    await queryRunner.query(`
      ALTER TABLE "user_type_permission"
      ADD COLUMN IF NOT EXISTS "granted" boolean NOT NULL DEFAULT true;
    `);
    await queryRunner.query(`
      ALTER TABLE "user_type_permission"
      ADD COLUMN IF NOT EXISTS "titleCompanyId" uuid;
    `);
    await queryRunner.query(`
      ALTER TABLE "user_type_permission"
      ALTER COLUMN "userTypeId" SET NOT NULL;
    `);
    await queryRunner.query(`
      UPDATE "user_type_permission"
      SET "granted" = COALESCE("granted", "isAllowed", true);
    `);
    await queryRunner.query(`
      ALTER TABLE "user_type_permission"
      DROP COLUMN IF EXISTS "isAllowed";
    `);
    await queryRunner.query(`
      ALTER TABLE "user_type_permission"
      DROP COLUMN IF EXISTS "userTypeName";
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_user_type_permission_unique"
      ON "user_type_permission" ("userTypeId", "permissionId");
    `);
    await queryRunner.query(`
      ALTER TABLE "user_type_permission"
      ADD CONSTRAINT "FK_user_type_permission_permissionId"
      FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE;
    `);
    await queryRunner.query(`
      ALTER TABLE "user_type_permission"
      ADD CONSTRAINT "FK_user_type_permission_userTypeId"
      FOREIGN KEY ("userTypeId") REFERENCES "user_type"("id") ON DELETE CASCADE;
    `);

    await queryRunner.query(`
      ALTER TABLE "user_permission"
      ADD COLUMN IF NOT EXISTS "granted" boolean NOT NULL DEFAULT true;
    `);
    await queryRunner.query(`
      UPDATE "user_permission"
      SET "granted" = COALESCE("granted", "isAllowed", true);
    `);
    await queryRunner.query(`
      ALTER TABLE "user_permission"
      DROP COLUMN IF EXISTS "isAllowed";
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_user_permission_unique"
      ON "user_permission" ("userId", "permissionId");
    `);
    await queryRunner.query(`
      ALTER TABLE "user_permission"
      ADD CONSTRAINT "FK_user_permission_permissionId"
      FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_permission" DROP CONSTRAINT IF EXISTS "FK_user_permission_permissionId";`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_user_permission_unique";`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_permission" ADD COLUMN IF NOT EXISTS "isAllowed" boolean NOT NULL DEFAULT true;`,
    );
    await queryRunner.query(
      `UPDATE "user_permission" SET "isAllowed" = COALESCE("granted", true);`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_permission" DROP COLUMN IF EXISTS "granted";`,
    );

    await queryRunner.query(
      `ALTER TABLE "user_type_permission" DROP CONSTRAINT IF EXISTS "FK_user_type_permission_permissionId";`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_type_permission" DROP CONSTRAINT IF EXISTS "FK_user_type_permission_userTypeId";`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_user_type_permission_unique";`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_type_permission" ADD COLUMN IF NOT EXISTS "isAllowed" boolean NOT NULL DEFAULT true;`,
    );
    await queryRunner.query(
      `UPDATE "user_type_permission" SET "isAllowed" = COALESCE("granted", true);`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_type_permission" ADD COLUMN IF NOT EXISTS "userTypeName" character varying(100);`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_type_permission" DROP COLUMN IF EXISTS "titleCompanyId";`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_type_permission" DROP COLUMN IF EXISTS "granted";`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_type_permission" DROP COLUMN IF EXISTS "userTypeId";`,
    );

    await queryRunner.query(
      `ALTER TABLE "permission" DROP CONSTRAINT IF EXISTS "FK_permission_permissionGroupId";`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_permission_endpoint_method_unique";`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission" DROP COLUMN IF EXISTS "updatedAt";`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission" DROP COLUMN IF EXISTS "createdAt";`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission" DROP COLUMN IF EXISTS "permissionGroupId";`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission" DROP COLUMN IF EXISTS "name";`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "permission_group";`);
  }
}
