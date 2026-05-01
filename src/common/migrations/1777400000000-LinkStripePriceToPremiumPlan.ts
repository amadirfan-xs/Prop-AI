import { MigrationInterface, QueryRunner } from "typeorm";

export class LinkStripePriceToPremiumPlan1777400000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Link the newly created Stripe Price ID to the Premium Plan
        await queryRunner.query(`
            UPDATE "pricing_packages" 
            SET "stripePriceId" = 'price_1TREGuBQUksMuSI8ImMvRupC' 
            WHERE "name" = 'Premium Plan';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE "pricing_packages" 
            SET "stripePriceId" = NULL 
            WHERE "name" = 'Premium Plan';
        `);
    }
}
