import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPropertyImageFields1713000000010 implements MigrationInterface {
  name = 'AddPropertyImageFields1713000000010';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "property"
      ADD COLUMN IF NOT EXISTS "property_media" jsonb NOT NULL DEFAULT '[]'::jsonb;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "property" DROP COLUMN IF EXISTS "property_media";
    `);
  }
}
