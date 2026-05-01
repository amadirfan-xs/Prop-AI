import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSocialPostingArchitecture1713000000013 implements MigrationInterface {
  name = 'CreateSocialPostingArchitecture1713000000013';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "social_account" (
        "id" SERIAL NOT NULL,
        "user_id" integer NOT NULL,
        "platform" character varying(30) NOT NULL,
        "platform_user_id" character varying(120) NOT NULL,
        "display_name" character varying(255),
        "access_token_encrypted" text NOT NULL,
        "token_expires_at" TIMESTAMPTZ,
        "scopes" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "is_active" boolean NOT NULL DEFAULT true,
        "last_token_check_at" TIMESTAMPTZ,
        "last_token_error" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_social_account_id" PRIMARY KEY ("id")
      );
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "uniq_social_account_user_platform_provider"
      ON "social_account" ("user_id", "platform", "platform_user_id");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_social_account_user_id"
      ON "social_account" ("user_id");
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "social_destination" (
        "id" SERIAL NOT NULL,
        "social_account_id" integer NOT NULL,
        "platform" character varying(30) NOT NULL,
        "destination_id" character varying(150) NOT NULL,
        "destination_name" character varying(255) NOT NULL,
        "destination_access_token_encrypted" text NOT NULL,
        "is_default" boolean NOT NULL DEFAULT false,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_social_destination_id" PRIMARY KEY ("id")
      );
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "uniq_social_destination_account_platform_destination"
      ON "social_destination" ("social_account_id", "platform", "destination_id");
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "property_social_post" (
        "id" SERIAL NOT NULL,
        "property_id" integer NOT NULL,
        "agent_user_id" integer NOT NULL,
        "caption" text NOT NULL,
        "mode" character varying(20) NOT NULL,
        "status" character varying(30) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_property_social_post_id" PRIMARY KEY ("id")
      );
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_property_social_post_property"
      ON "property_social_post" ("property_id");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_property_social_post_agent"
      ON "property_social_post" ("agent_user_id");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_property_social_post_status"
      ON "property_social_post" ("status");
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "property_social_post_target" (
        "id" SERIAL NOT NULL,
        "property_social_post_id" integer NOT NULL,
        "platform" character varying(30) NOT NULL,
        "social_destination_id" integer NOT NULL,
        "scheduled_for" TIMESTAMPTZ,
        "status" character varying(30) NOT NULL,
        "external_post_id" character varying(255),
        "error_message" text,
        "retry_count" integer NOT NULL DEFAULT 0,
        "last_attempt_at" TIMESTAMPTZ,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_property_social_post_target_id" PRIMARY KEY ("id")
      );
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "uniq_property_social_post_target_post_platform_destination"
      ON "property_social_post_target" ("property_social_post_id", "platform", "social_destination_id");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_property_social_post_target_post"
      ON "property_social_post_target" ("property_social_post_id");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_property_social_post_target_schedule"
      ON "property_social_post_target" ("scheduled_for");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_property_social_post_target_status"
      ON "property_social_post_target" ("status");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_property_social_post_target_status";`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_property_social_post_target_schedule";`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_property_social_post_target_post";`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "uniq_property_social_post_target_post_platform_destination";`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS "property_social_post_target";`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_property_social_post_status";`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_property_social_post_agent";`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_property_social_post_property";`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "property_social_post";`);

    await queryRunner.query(
      `DROP INDEX IF EXISTS "uniq_social_destination_account_platform_destination";`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "social_destination";`);

    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_social_account_user_id";`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "uniq_social_account_user_platform_provider";`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "social_account";`);
  }
}
