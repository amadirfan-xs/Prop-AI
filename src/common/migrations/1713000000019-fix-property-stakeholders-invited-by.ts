import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixPropertyStakeholdersInvitedBy1713000000019 implements MigrationInterface {
  name = 'FixPropertyStakeholdersInvitedBy1713000000019';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_schema = 'public'
            AND table_name = 'property_stakeholders'
        ) THEN
          RETURN;
        END IF;

        ALTER TABLE "property_stakeholders"
          ADD COLUMN IF NOT EXISTS "invited_by" integer NULL;

        UPDATE "property_stakeholders"
        SET "invited_by" = "user_id"
        WHERE "invited_by" IS NULL;

        ALTER TABLE "property_stakeholders"
          ALTER COLUMN "invited_by" SET NOT NULL;

        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'FK_property_stakeholders_invited_by_user_account'
        ) THEN
          ALTER TABLE "property_stakeholders"
            ADD CONSTRAINT "FK_property_stakeholders_invited_by_user_account"
            FOREIGN KEY ("invited_by") REFERENCES "user_account"("id")
            ON DELETE RESTRICT ON UPDATE NO ACTION;
        END IF;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_schema = 'public'
            AND table_name = 'property_stakeholders'
        ) THEN
          RETURN;
        END IF;

        ALTER TABLE "property_stakeholders"
          DROP CONSTRAINT IF EXISTS "FK_property_stakeholders_invited_by_user_account";

        ALTER TABLE "property_stakeholders"
          DROP COLUMN IF EXISTS "invited_by";
      END
      $$;
    `);
  }
}
