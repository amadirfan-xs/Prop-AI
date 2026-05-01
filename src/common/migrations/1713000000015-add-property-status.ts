import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPropertyStatus1713000000015 implements MigrationInterface {
  name = 'AddPropertyStatus1713000000015';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "property"
      ADD COLUMN IF NOT EXISTS "status" varchar(20) NOT NULL DEFAULT 'Draft';
    `);

    await queryRunner.query(`
      ALTER TABLE "property"
      DROP CONSTRAINT IF EXISTS "chk_property_status";
    `);

    await queryRunner.query(`
      ALTER TABLE "property"
      ADD CONSTRAINT "chk_property_status"
      CHECK ("status" IN ('Draft', 'Pending', 'Active', 'Completed'));
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "property"
      DROP CONSTRAINT IF EXISTS "chk_property_status";
    `);

    await queryRunner.query(`
      ALTER TABLE "property" DROP COLUMN IF EXISTS "status";
    `);
  }
}
