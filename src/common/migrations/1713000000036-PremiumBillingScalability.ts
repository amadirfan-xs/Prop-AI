import { MigrationInterface, QueryRunner } from "typeorm";

export class PremiumBillingScalability1713000000036 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Update pricing_packages
        await queryRunner.query(`
            ALTER TABLE "pricing_packages" 
            ADD COLUMN "propertyLimit" INTEGER DEFAULT 5,
            ADD COLUMN "stakeholderLimit" INTEGER DEFAULT 1,
            ADD COLUMN "overagePrice" DECIMAL(10,2) DEFAULT 0,
            ADD COLUMN "featuresConfig" JSONB,
            ADD COLUMN "stripePriceId" VARCHAR(150)
        `);

        // 2. Update user_subscriptions
        await queryRunner.query(`
            ALTER TABLE "user_subscriptions" 
            ADD COLUMN "extraPropertySlots" INTEGER DEFAULT 0,
            ADD COLUMN "metadata" JSONB
        `);

        // 3. Create payments table
        await queryRunner.query(`
            CREATE TABLE "payments" (
                "id" SERIAL PRIMARY KEY,
                "userId" INTEGER NOT NULL,
                "amount" DECIMAL(10,2) NOT NULL,
                "currency" VARCHAR(10) DEFAULT 'usd',
                "stripeSessionId" VARCHAR(255),
                "type" VARCHAR(50) NOT NULL,
                "status" VARCHAR(50) DEFAULT 'pending',
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY ("userId") REFERENCES "user_account"("id") ON DELETE CASCADE
            )
        `);

        // 4. Update seed data with limits
        await queryRunner.query(`
            UPDATE "pricing_packages" SET "propertyLimit" = 5, "stakeholderLimit" = 1 WHERE "name" = 'Free Plan';
            UPDATE "pricing_packages" SET "propertyLimit" = 50, "stakeholderLimit" = 5, "overagePrice" = 1.00 WHERE "name" = 'Premium Plan';
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "payments"`);
        
        await queryRunner.query(`
            ALTER TABLE "user_subscriptions" 
            DROP COLUMN "extraPropertySlots",
            DROP COLUMN "metadata"
        `);

        await queryRunner.query(`
            ALTER TABLE "pricing_packages" 
            DROP COLUMN "propertyLimit",
            DROP COLUMN "stakeholderLimit",
            DROP COLUMN "overagePrice",
            DROP COLUMN "featuresConfig",
            DROP COLUMN "stripePriceId"
        `);
    }
}
