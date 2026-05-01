import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Bridges databases that ran an older 0010 that added selfie* columns only.
 * Ensures property_media exists and removes legacy selfie columns.
 */
export class PropertyMediaJson1713000000011 implements MigrationInterface {
  name = 'PropertyMediaJson1713000000011';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "property"
      ADD COLUMN IF NOT EXISTS "property_media" jsonb NOT NULL DEFAULT '[]'::jsonb;
    `);

    await queryRunner.query(`
      ALTER TABLE "property" DROP COLUMN IF EXISTS "selfieThumbnailKeySmall";
    `);
    await queryRunner.query(`
      ALTER TABLE "property" DROP COLUMN IF EXISTS "selfieThumbnailKeyMedium";
    `);
    await queryRunner.query(`
      ALTER TABLE "property" DROP COLUMN IF EXISTS "selfieThumbnailKeyLarge";
    `);
    await queryRunner.query(`
      ALTER TABLE "property" DROP COLUMN IF EXISTS "selfie";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "property"
      ADD COLUMN IF NOT EXISTS "selfie" character varying(1000),
      ADD COLUMN IF NOT EXISTS "selfieThumbnailKeyLarge" character varying(1000),
      ADD COLUMN IF NOT EXISTS "selfieThumbnailKeyMedium" character varying(1000),
      ADD COLUMN IF NOT EXISTS "selfieThumbnailKeySmall" character varying(1000);
    `);
  }
}
