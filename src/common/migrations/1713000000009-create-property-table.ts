import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePropertyTable1713000000009 implements MigrationInterface {
  name = 'CreatePropertyTable1713000000009';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "property" (
        "id" SERIAL PRIMARY KEY,
        "agent_user_id" integer NOT NULL,
        "property_title" character varying(255) NOT NULL,
        "property_description" text NOT NULL,
        "property_type" character varying(120) NOT NULL,
        "asking_price_monthly" numeric(12,2) NOT NULL,
        "beds" integer NOT NULL,
        "baths" integer NOT NULL,
        "total_sqft" integer NOT NULL,
        "street_address" character varying(255) NOT NULL,
        "city" character varying(120) NOT NULL,
        "zip_code" character varying(20) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = 'user_accounts'
        ) THEN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints
            WHERE table_name = 'property' AND constraint_name = 'FK_property_agent_user_id_user_accounts'
          ) THEN
            ALTER TABLE "property"
            ADD CONSTRAINT "FK_property_agent_user_id_user_accounts"
            FOREIGN KEY ("agent_user_id") REFERENCES "user_accounts"("id")
            ON DELETE RESTRICT;
          END IF;
        ELSIF EXISTS (
          SELECT 1 FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = 'user_account'
        ) THEN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints
            WHERE table_name = 'property' AND constraint_name = 'FK_property_agent_user_id_user_account'
          ) THEN
            ALTER TABLE "property"
            ADD CONSTRAINT "FK_property_agent_user_id_user_account"
            FOREIGN KEY ("agent_user_id") REFERENCES "user_account"("id")
            ON DELETE RESTRICT;
          END IF;
        END IF;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "property" DROP CONSTRAINT IF EXISTS "FK_property_agent_user_id_user_accounts";`,
    );
    await queryRunner.query(
      `ALTER TABLE "property" DROP CONSTRAINT IF EXISTS "FK_property_agent_user_id_user_account";`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "property";`);
  }
}
