import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConvertEntityIdsToInteger1713000000005 implements MigrationInterface {
  name = 'ConvertEntityIdsToInteger1713000000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "permission" DROP CONSTRAINT IF EXISTS "FK_permission_permissionGroupId";`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission" DROP CONSTRAINT IF EXISTS "permission_permissionGroupId_fkey";`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_type_permission" DROP CONSTRAINT IF EXISTS "FK_user_type_permission_permissionId";`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_type_permission" DROP CONSTRAINT IF EXISTS "user_type_permission_permissionId_fkey";`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_type_permission" DROP CONSTRAINT IF EXISTS "FK_user_type_permission_userTypeId";`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_type_permission" DROP CONSTRAINT IF EXISTS "user_type_permission_userTypeId_fkey";`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_permission" DROP CONSTRAINT IF EXISTS "FK_user_permission_permissionId";`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_permission" DROP CONSTRAINT IF EXISTS "user_permission_permissionId_fkey";`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_account" DROP CONSTRAINT IF EXISTS "FK_user_account_userTypeId";`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_account" DROP CONSTRAINT IF EXISTS "user_account_userTypeId_fkey";`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_type" DROP CONSTRAINT IF EXISTS "FK_user_type_parentId";`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_type" DROP CONSTRAINT IF EXISTS "FK_user_type_parentid";`,
    );

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'permission_group' AND column_name = 'id' AND data_type = 'uuid'
        ) THEN
          ALTER TABLE "permission_group" ADD COLUMN IF NOT EXISTS "id_new" SERIAL;
          ALTER TABLE "permission_group" DROP CONSTRAINT IF EXISTS "permission_group_pkey";
          ALTER TABLE "permission_group" RENAME COLUMN "id" TO "id_uuid";
          ALTER TABLE "permission_group" RENAME COLUMN "id_new" TO "id";
          ALTER TABLE "permission_group" ADD CONSTRAINT "permission_group_pkey" PRIMARY KEY ("id");
          CREATE UNIQUE INDEX IF NOT EXISTS "IDX_permission_group_id_uuid" ON "permission_group" ("id_uuid");
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'permission' AND column_name = 'id' AND data_type = 'uuid'
        ) THEN
          ALTER TABLE "permission" ADD COLUMN IF NOT EXISTS "id_new" SERIAL;
          ALTER TABLE "permission" DROP CONSTRAINT IF EXISTS "permission_pkey";
          ALTER TABLE "permission" RENAME COLUMN "id" TO "id_uuid";
          ALTER TABLE "permission" RENAME COLUMN "id_new" TO "id";
          ALTER TABLE "permission" ADD CONSTRAINT "permission_pkey" PRIMARY KEY ("id");
          CREATE UNIQUE INDEX IF NOT EXISTS "IDX_permission_id_uuid" ON "permission" ("id_uuid");
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'user_type' AND column_name = 'id' AND data_type = 'uuid'
        ) THEN
          ALTER TABLE "user_type" ADD COLUMN IF NOT EXISTS "id_new" SERIAL;
          ALTER TABLE "user_type" DROP CONSTRAINT IF EXISTS "user_type_pkey";
          ALTER TABLE "user_type" RENAME COLUMN "id" TO "id_uuid";
          ALTER TABLE "user_type" RENAME COLUMN "id_new" TO "id";
          ALTER TABLE "user_type" ADD CONSTRAINT "user_type_pkey" PRIMARY KEY ("id");
          CREATE UNIQUE INDEX IF NOT EXISTS "IDX_user_type_id_uuid" ON "user_type" ("id_uuid");
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      ALTER TABLE "permission" ADD COLUMN IF NOT EXISTS "permissionGroupId_new" integer;
      UPDATE "permission" p
      SET "permissionGroupId_new" = pg."id"
      FROM "permission_group" pg
      WHERE p."permissionGroupId"::text = pg."id_uuid"::text;
      ALTER TABLE "permission" DROP COLUMN IF EXISTS "permissionGroupId";
      ALTER TABLE "permission" RENAME COLUMN "permissionGroupId_new" TO "permissionGroupId";
      ALTER TABLE "permission" ALTER COLUMN "permissionGroupId" SET NOT NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE "user_type" ADD COLUMN IF NOT EXISTS "parentId_new" integer;
      UPDATE "user_type" ut
      SET "parentId_new" = parent."id"
      FROM "user_type" parent
      WHERE ut."parentId"::text = parent."id_uuid"::text;
      ALTER TABLE "user_type" DROP COLUMN IF EXISTS "parentId";
      ALTER TABLE "user_type" RENAME COLUMN "parentId_new" TO "parentId";
    `);

    await queryRunner.query(`
      ALTER TABLE "user_account" ADD COLUMN IF NOT EXISTS "userTypeId_new" integer;
      UPDATE "user_account" ua
      SET "userTypeId_new" = ut."id"
      FROM "user_type" ut
      WHERE ua."userTypeId"::text = ut."id_uuid"::text;
      ALTER TABLE "user_account" DROP COLUMN IF EXISTS "userTypeId";
      ALTER TABLE "user_account" RENAME COLUMN "userTypeId_new" TO "userTypeId";
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'user_permission' AND column_name = 'id' AND data_type = 'uuid'
        ) THEN
          ALTER TABLE "user_permission" ADD COLUMN IF NOT EXISTS "id_new" SERIAL;
          ALTER TABLE "user_permission" DROP CONSTRAINT IF EXISTS "user_permission_pkey";
          ALTER TABLE "user_permission" RENAME COLUMN "id" TO "id_uuid";
          ALTER TABLE "user_permission" RENAME COLUMN "id_new" TO "id";
          ALTER TABLE "user_permission" ADD CONSTRAINT "user_permission_pkey" PRIMARY KEY ("id");
          CREATE UNIQUE INDEX IF NOT EXISTS "IDX_user_permission_id_uuid" ON "user_permission" ("id_uuid");
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      ALTER TABLE "user_permission" ADD COLUMN IF NOT EXISTS "userId_new" integer;
      ALTER TABLE "user_permission" ADD COLUMN IF NOT EXISTS "permissionId_new" integer;
      UPDATE "user_permission" up
      SET "userId_new" = ua."id"
      FROM "user_account" ua
      WHERE up."userId"::text = ua."id_uuid"::text;
      UPDATE "user_permission" up
      SET "permissionId_new" = p."id"
      FROM "permission" p
      WHERE up."permissionId"::text = p."id_uuid"::text;
      ALTER TABLE "user_permission" DROP COLUMN IF EXISTS "userId";
      ALTER TABLE "user_permission" DROP COLUMN IF EXISTS "permissionId";
      ALTER TABLE "user_permission" RENAME COLUMN "userId_new" TO "userId";
      ALTER TABLE "user_permission" RENAME COLUMN "permissionId_new" TO "permissionId";
      ALTER TABLE "user_permission" ALTER COLUMN "userId" SET NOT NULL;
      ALTER TABLE "user_permission" ALTER COLUMN "permissionId" SET NOT NULL;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'user_type_permission' AND column_name = 'id' AND data_type = 'uuid'
        ) THEN
          ALTER TABLE "user_type_permission" ADD COLUMN IF NOT EXISTS "id_new" SERIAL;
          ALTER TABLE "user_type_permission" DROP CONSTRAINT IF EXISTS "user_type_permission_pkey";
          ALTER TABLE "user_type_permission" RENAME COLUMN "id" TO "id_uuid";
          ALTER TABLE "user_type_permission" RENAME COLUMN "id_new" TO "id";
          ALTER TABLE "user_type_permission" ADD CONSTRAINT "user_type_permission_pkey" PRIMARY KEY ("id");
          CREATE UNIQUE INDEX IF NOT EXISTS "IDX_user_type_permission_id_uuid" ON "user_type_permission" ("id_uuid");
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      ALTER TABLE "user_type_permission" ADD COLUMN IF NOT EXISTS "userTypeId_new" integer;
      ALTER TABLE "user_type_permission" ADD COLUMN IF NOT EXISTS "permissionId_new" integer;
      UPDATE "user_type_permission" utp
      SET "userTypeId_new" = ut."id"
      FROM "user_type" ut
      WHERE utp."userTypeId"::text = ut."id_uuid"::text;
      UPDATE "user_type_permission" utp
      SET "permissionId_new" = p."id"
      FROM "permission" p
      WHERE utp."permissionId"::text = p."id_uuid"::text;
      ALTER TABLE "user_type_permission" DROP COLUMN IF EXISTS "userTypeId";
      ALTER TABLE "user_type_permission" DROP COLUMN IF EXISTS "permissionId";
      ALTER TABLE "user_type_permission" RENAME COLUMN "userTypeId_new" TO "userTypeId";
      ALTER TABLE "user_type_permission" RENAME COLUMN "permissionId_new" TO "permissionId";
      ALTER TABLE "user_type_permission" ALTER COLUMN "userTypeId" SET NOT NULL;
      ALTER TABLE "user_type_permission" ALTER COLUMN "permissionId" SET NOT NULL;
    `);

    await queryRunner.query(
      `ALTER TABLE "permission" ADD CONSTRAINT "FK_permission_permissionGroupId" FOREIGN KEY ("permissionGroupId") REFERENCES "permission_group"("id") ON DELETE RESTRICT;`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_type" ADD CONSTRAINT "FK_user_type_parentId" FOREIGN KEY ("parentId") REFERENCES "user_type"("id") ON DELETE SET NULL;`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_account" ADD CONSTRAINT "FK_user_account_userTypeId" FOREIGN KEY ("userTypeId") REFERENCES "user_type"("id") ON DELETE SET NULL;`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_permission" ADD CONSTRAINT "FK_user_permission_permissionId" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE;`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_type_permission" ADD CONSTRAINT "FK_user_type_permission_permissionId" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE;`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_type_permission" ADD CONSTRAINT "FK_user_type_permission_userTypeId" FOREIGN KEY ("userTypeId") REFERENCES "user_type"("id") ON DELETE CASCADE;`,
    );
  }

  public async down(): Promise<void> {
    // One-way data migration for key strategy change.
  }
}
