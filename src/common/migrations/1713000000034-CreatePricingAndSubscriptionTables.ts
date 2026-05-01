import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePricingAndSubscriptionTables1713000000034 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Create pricing_packages table
        await queryRunner.query(`
            CREATE TABLE "pricing_packages" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR(150) NOT NULL,
                "priceDisplay" VARCHAR(50) NOT NULL,
                "priceValue" DECIMAL(10,2) DEFAULT 0,
                "description" TEXT,
                "features" JSONB NOT NULL,
                "isActive" BOOLEAN DEFAULT true,
                "isPremium" BOOLEAN DEFAULT false,
                "isOrganizational" BOOLEAN DEFAULT false,
                "buttonText" VARCHAR(50)
            )
        `);

        // 2. Create user_subscriptions table
        await queryRunner.query(`
            CREATE TABLE "user_subscriptions" (
                "id" SERIAL PRIMARY KEY,
                "userId" INTEGER NOT NULL,
                "packageId" INTEGER NOT NULL,
                "startDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "endDate" TIMESTAMP,
                "status" VARCHAR(50) DEFAULT 'active',
                "isCurrent" BOOLEAN DEFAULT true,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY ("userId") REFERENCES "user_account"("id") ON DELETE CASCADE,
                FOREIGN KEY ("packageId") REFERENCES "pricing_packages"("id") ON DELETE CASCADE
            )
        `);

        // 3. Seed Pricing Packages
        await queryRunner.query(`
            INSERT INTO "pricing_packages" ("name", "priceDisplay", "priceValue", "description", "features", "isPremium", "isOrganizational", "buttonText")
            VALUES 
            ('Free Plan', '$0', 0, 'Basic plan for starting out', 
             '["Up to 5 properties per month", "Access to all social media platforms", "1 Buyer invitation per property", "1 Seller invitation per property", "Add-on features available"]',
             false, false, 'Get Started'),
            
            ('Premium Plan', '$49', 49, 'Scale your property portfolio',
             '["Up to 50 properties per month", "Additional properties at $1/property", "Listing Portal with auto-generated public pages", "Up to 5 Buyer invitations per property", "Up to 5 Seller invitations per property"]',
             true, false, 'Upgrade Now'),
            
            ('Organizational Plan', 'Custom', 0, 'Full brokerage support',
             '[{"text": "Brokerage registration support", "icon": "business"}, {"text": "Multi-agent management capabilities", "icon": "group"}, {"text": "Personalized branding & logo customization", "icon": "branding_watermark"}, {"text": "Listing Portal with auto-generated public pages", "icon": "grid_view"}, {"text": "Add-on: Custom template design ($100/mo)", "icon": "add_circle"}]',
             false, true, 'Contact Sales')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user_subscriptions"`);
        await queryRunner.query(`DROP TABLE "pricing_packages"`);
    }
}
