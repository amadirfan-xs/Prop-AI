import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInvitedByToUserAccount1713000000018 implements MigrationInterface {
  name = 'AddInvitedByToUserAccount1713000000018';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      DECLARE target_table TEXT;
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = 'user_accounts'
        ) THEN
          target_table := 'user_accounts';
        ELSIF EXISTS (
          SELECT 1 FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = 'user_account'
        ) THEN
          target_table := 'user_account';
        ELSE
          RAISE EXCEPTION 'Neither user_accounts nor user_account table exists';
        END IF;

        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS "invitedBy" integer NULL', target_table);
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      DECLARE target_table TEXT;
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = 'user_accounts'
        ) THEN
          target_table := 'user_accounts';
        ELSIF EXISTS (
          SELECT 1 FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = 'user_account'
        ) THEN
          target_table := 'user_account';
        ELSE
          RETURN;
        END IF;

        EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS "invitedBy"', target_table);
      END
      $$;
    `);
  }
}
