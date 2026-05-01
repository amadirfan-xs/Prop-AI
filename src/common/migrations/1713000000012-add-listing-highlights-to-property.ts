import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddListingHighlightsToProperty1713000000012 implements MigrationInterface {
  name = 'AddListingHighlightsToProperty1713000000012';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "property"
      ADD COLUMN IF NOT EXISTS "listing_highlights" jsonb NOT NULL DEFAULT '[]'::jsonb;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "property" DROP COLUMN IF EXISTS "listing_highlights";
    `);
  }
}
