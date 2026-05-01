import { MigrationInterface, QueryRunner } from "typeorm";

export class FixMarketingCampaignColumnNames1713000000030 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn("marketing_campaigns", "scheduledAt", "scheduled_at");
        await queryRunner.renameColumn("marketing_campaigns", "createdAt", "created_at");
        await queryRunner.renameColumn("marketing_campaigns", "updatedAt", "updated_at");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn("marketing_campaigns", "scheduled_at", "scheduledAt");
        await queryRunner.renameColumn("marketing_campaigns", "created_at", "createdAt");
        await queryRunner.renameColumn("marketing_campaigns", "updated_at", "updatedAt");
    }
}
