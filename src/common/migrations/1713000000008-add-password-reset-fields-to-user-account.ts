import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordResetFieldsToUserAccount1713000000008 implements MigrationInterface {
  name = 'AddPasswordResetFieldsToUserAccount1713000000008';

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

        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS "tempPassword" text NULL', target_table);
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS "verified" boolean NOT NULL DEFAULT true', target_table);
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS "resetPIN" varchar(4) NULL', target_table);
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS "resetPINExpirationAt" timestamp NULL', target_table);
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS "resendPasswordLimit" integer NOT NULL DEFAULT 0', target_table);
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS "verificationCode" varchar(8) NULL', target_table);
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS "verificationCodeExpirationAt" timestamp NULL', target_table);
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS "resendEmailLimit" integer NOT NULL DEFAULT 0', target_table);
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

        EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS "resendEmailLimit"', target_table);
        EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS "verificationCodeExpirationAt"', target_table);
        EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS "verificationCode"', target_table);
        EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS "resendPasswordLimit"', target_table);
        EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS "resetPINExpirationAt"', target_table);
        EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS "resetPIN"', target_table);
        EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS "verified"', target_table);
        EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS "tempPassword"', target_table);
      END
      $$;
    `);
  }
}
