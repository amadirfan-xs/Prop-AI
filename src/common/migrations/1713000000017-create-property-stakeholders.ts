import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePropertyStakeholders1713000000017 implements MigrationInterface {
  name = 'CreatePropertyStakeholders1713000000017';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "property_stakeholders" (
        "id" SERIAL NOT NULL,
        "property_id" integer NOT NULL,
        "user_id" integer NOT NULL,
        "invited_by" integer NOT NULL,
        "name" character varying(150) NOT NULL,
        "email" character varying(255) NOT NULL,
        "user_type_id" integer NOT NULL,
        "user_type" character varying(20) NOT NULL,
        "invite_status" character varying(20) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_property_stakeholders_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_property_stakeholders_property_email"
          UNIQUE ("property_id", "email"),
        CONSTRAINT "FK_property_stakeholders_property"
          FOREIGN KEY ("property_id") REFERENCES "property"("id")
          ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_property_stakeholders_user_account"
          FOREIGN KEY ("user_id") REFERENCES "user_account"("id")
          ON DELETE RESTRICT ON UPDATE NO ACTION,
        CONSTRAINT "FK_property_stakeholders_invited_by_user_account"
          FOREIGN KEY ("invited_by") REFERENCES "user_account"("id")
          ON DELETE RESTRICT ON UPDATE NO ACTION
      );
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_property_stakeholders_property_id"
      ON "property_stakeholders" ("property_id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_property_stakeholders_property_id";`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "property_stakeholders";`);
  }
}
