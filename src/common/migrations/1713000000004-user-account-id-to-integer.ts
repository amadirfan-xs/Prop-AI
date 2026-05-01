import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserAccountIdToInteger1713000000004 implements MigrationInterface {
  name = 'UserAccountIdToInteger1713000000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'user_account' AND column_name = 'id'
            AND data_type = 'uuid'
        ) THEN
          ALTER TABLE "user_account" ADD COLUMN IF NOT EXISTS "id_new" SERIAL;
          ALTER TABLE "user_account" DROP CONSTRAINT IF EXISTS "user_account_pkey";
          ALTER TABLE "user_account" RENAME COLUMN "id" TO "id_uuid";
          ALTER TABLE "user_account" RENAME COLUMN "id_new" TO "id";
          ALTER TABLE "user_account" ADD CONSTRAINT "user_account_pkey" PRIMARY KEY ("id");
          CREATE UNIQUE INDEX IF NOT EXISTS "IDX_user_account_id_uuid" ON "user_account" ("id_uuid");
        END IF;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'user_account' AND column_name = 'id_uuid'
        ) THEN
          ALTER TABLE "user_account" DROP CONSTRAINT IF EXISTS "user_account_pkey";
          ALTER TABLE "user_account" RENAME COLUMN "id" TO "id_new";
          ALTER TABLE "user_account" RENAME COLUMN "id_uuid" TO "id";
          ALTER TABLE "user_account" ADD CONSTRAINT "user_account_pkey" PRIMARY KEY ("id");
          ALTER TABLE "user_account" DROP COLUMN IF EXISTS "id_new";
          DROP INDEX IF EXISTS "IDX_user_account_id_uuid";
        END IF;
      END
      $$;
    `);
  }
}
