import { MigrationInterface, QueryRunner } from "typeorm";

export class StandardizeColumnNames1713000000031 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Fix marketing_campaigns (renaming from CamelCase to snake_case)
        const tableCampaigns = await queryRunner.getTable("marketing_campaigns");
        if (tableCampaigns) {
            if (tableCampaigns.findColumnByName("scheduledAt")) await queryRunner.renameColumn("marketing_campaigns", "scheduledAt", "scheduled_at");
            if (tableCampaigns.findColumnByName("createdAt")) await queryRunner.renameColumn("marketing_campaigns", "createdAt", "created_at");
            if (tableCampaigns.findColumnByName("updatedAt")) await queryRunner.renameColumn("marketing_campaigns", "updatedAt", "updated_at");
        }

        // Fix user_email_configuration (renaming from CamelCase to snake_case)
        const tableEmailConfigs = await queryRunner.getTable("user_email_configuration");
        if (tableEmailConfigs) {
            if (tableEmailConfigs.findColumnByName("appName")) await queryRunner.renameColumn("user_email_configuration", "appName", "app_name");
            if (tableEmailConfigs.findColumnByName("createdAt")) await queryRunner.renameColumn("user_email_configuration", "createdAt", "created_at");
            if (tableEmailConfigs.findColumnByName("updatedAt")) await queryRunner.renameColumn("user_email_configuration", "updatedAt", "updated_at");
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Reverse marketing_campaigns
        const tableCampaigns = await queryRunner.getTable("marketing_campaigns");
        if (tableCampaigns) {
            if (tableCampaigns.findColumnByName("scheduled_at")) await queryRunner.renameColumn("marketing_campaigns", "scheduled_at", "scheduledAt");
            if (tableCampaigns.findColumnByName("created_at")) await queryRunner.renameColumn("marketing_campaigns", "created_at", "createdAt");
            if (tableCampaigns.findColumnByName("updated_at")) await queryRunner.renameColumn("marketing_campaigns", "updated_at", "updatedAt");
        }

        // Reverse user_email_configuration
        const tableEmailConfigs = await queryRunner.getTable("user_email_configuration");
        if (tableEmailConfigs) {
            if (tableEmailConfigs.findColumnByName("app_name")) await queryRunner.renameColumn("user_email_configuration", "app_name", "appName");
            if (tableEmailConfigs.findColumnByName("created_at")) await queryRunner.renameColumn("user_email_configuration", "created_at", "createdAt");
            if (tableEmailConfigs.findColumnByName("updated_at")) await queryRunner.renameColumn("user_email_configuration", "updated_at", "updatedAt");
        }
    }
}
