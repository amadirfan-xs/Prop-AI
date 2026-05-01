import { MigrationInterface, QueryRunner } from 'typeorm';

export class SocialPostingFlexibleSchema1713000000022 implements MigrationInterface {
    name = 'SocialPostingFlexibleSchema1713000000022';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property_social_post_target" ALTER COLUMN "social_destination_id" DROP NOT NULL`);
        await queryRunner.query(`DROP INDEX IF EXISTS "uniq_property_social_post_target_post_platform_destination"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_property_social_post_target_post_platform_destination"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Re-adding the constraint would require care (no nulls), so we'll leave it as is for safety
    }
}
