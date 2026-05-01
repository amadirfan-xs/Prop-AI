import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSocialOauthSession1713000000014 implements MigrationInterface {
  name = 'CreateSocialOauthSession1713000000014';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "social_oauth_session" (
        "id" SERIAL NOT NULL,
        "user_id" integer NOT NULL,
        "platform" character varying(30) NOT NULL,
        "state_hash" character varying(128) NOT NULL,
        "status" character varying(20) NOT NULL DEFAULT 'pending',
        "expires_at" TIMESTAMPTZ NOT NULL,
        "consumed_at" TIMESTAMPTZ,
        "error_message" text,
        "metadata" jsonb NOT NULL DEFAULT '{}'::jsonb,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_social_oauth_session_id" PRIMARY KEY ("id")
      );
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_social_oauth_session_state_hash"
      ON "social_oauth_session" ("state_hash");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_social_oauth_session_status"
      ON "social_oauth_session" ("status");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_social_oauth_session_user_id"
      ON "social_oauth_session" ("user_id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_social_oauth_session_user_id";`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_social_oauth_session_status";`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_social_oauth_session_state_hash";`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "social_oauth_session";`);
  }
}
