import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePropertyPurchaseContract1713000000016
  implements MigrationInterface
{
  name = 'CreatePropertyPurchaseContract1713000000016';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "property_purchase_contract" (
        "id" SERIAL PRIMARY KEY,
        "property_id" integer NOT NULL REFERENCES "property"("id") ON DELETE CASCADE,
        "document_key" varchar(1000) NOT NULL,
        "input_source" varchar(10) NOT NULL,
        "is_latest" boolean NOT NULL DEFAULT true,
        "parent_id" integer NULL REFERENCES "property_purchase_contract"("id") ON DELETE SET NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "chk_property_purchase_contract_input_source"
          CHECK ("input_source" IN ('pdf', 'html'))
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_property_purchase_contract_property_id"
      ON "property_purchase_contract" ("property_id");
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_property_purchase_contract_is_latest"
      ON "property_purchase_contract" ("is_latest");
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "uniq_property_purchase_contract_latest_by_property"
      ON "property_purchase_contract" ("property_id")
      WHERE "is_latest" = true;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "uniq_property_purchase_contract_latest_by_property";
    `);
    await queryRunner.query(`
      DROP INDEX IF EXISTS "idx_property_purchase_contract_is_latest";
    `);
    await queryRunner.query(`
      DROP INDEX IF EXISTS "idx_property_purchase_contract_property_id";
    `);
    await queryRunner.query(`
      DROP TABLE IF EXISTS "property_purchase_contract";
    `);
  }
}
