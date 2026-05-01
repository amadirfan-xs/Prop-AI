import { MigrationInterface, QueryRunner } from "typeorm";

export class CompleteOrganizationTable1776686500001 implements MigrationInterface {
    name = 'CompleteOrganizationTable1776686500001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add missing columns
        await queryRunner.query(`ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "submittedByAgentId" integer`);
        await queryRunner.query(`ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "contactName" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "contactEmail" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "contactPhone" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "contactJobTitle" character varying(150)`);
        await queryRunner.query(`ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "numAgents" integer`);
        await queryRunner.query(`ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "numListings" integer`);
        await queryRunner.query(`ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "logoUrl" text`);
        await queryRunner.query(`ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "websiteUrl" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "organization" ADD COLUMN IF NOT EXISTS "additionalNotes" text`);

        // Fix primaryColor length
        await queryRunner.query(`ALTER TABLE "organization" ALTER COLUMN "primaryColor" TYPE character varying(50)`);

        // Add unique constraint only if it doesn't exist
        const constraintExists = await queryRunner.query(`
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'UQ_submitted_by_agent' AND table_name = 'organization'
        `);
        if (constraintExists.length === 0) {
            await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "UQ_submitted_by_agent" UNIQUE ("submittedByAgentId")`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "UQ_submitted_by_agent"`);
        await queryRunner.query(`ALTER TABLE "organization" ALTER COLUMN "primaryColor" TYPE character varying(10)`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "additionalNotes"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "websiteUrl"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "logoUrl"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "numListings"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "numAgents"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "contactJobTitle"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "contactPhone"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "contactEmail"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "contactName"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "submittedByAgentId"`);
    }
}
