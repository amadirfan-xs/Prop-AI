import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrganizationTable1713000000027 implements MigrationInterface {
    name = 'CreateOrganizationTable1713000000027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create organization table with all lead capture fields
        await queryRunner.query(`
            CREATE TABLE "organization" (
                "id" SERIAL PRIMARY KEY,
                "name" character varying(255) NOT NULL,
                "taxId" character varying(100),
                "headquarters" character varying(500),
                "privacyPolicy" text,
                "companyDescription" text,
                "plan" character varying(50) NOT NULL DEFAULT 'ORGANIZATIONAL',
                "submittedByAgentId" integer,
                
                -- Contact Info
                "contactName" character varying(255),
                "contactEmail" character varying(255),
                "contactPhone" character varying(50),
                "contactJobTitle" character varying(150),
                
                -- Capacity Info
                "numAgents" integer,
                "numListings" integer,
                
                -- Branding Info
                "logoUrl" text,
                "primaryColor" character varying(50),
                "websiteUrl" character varying(255),
                
                -- Notes
                "additionalNotes" text,
                
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),

                CONSTRAINT "UQ_submitted_by_agent" UNIQUE ("submittedByAgentId")
            )
        `);

        // Update user_account table
        await queryRunner.query(`ALTER TABLE "user_account" ADD "organizationId" integer`);
        await queryRunner.query(`ALTER TABLE "user_account" ADD "isOrgOwner" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user_account" ADD "isAuthorizedSigner" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "isAuthorizedSigner"`);
        await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "isOrgOwner"`);
        await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "organizationId"`);
        await queryRunner.query(`DROP TABLE "organization"`);
    }
}
