import { MigrationInterface, QueryRunner } from "typeorm";

export class CompleteOrganizationTable1776686500001 implements MigrationInterface {
    name = 'CompleteOrganizationTable1776686500001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add missing columns
        await queryRunner.query(`ALTER TABLE "organization" ADD "submittedByAgentId" integer`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "contactName" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "contactEmail" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "contactPhone" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "contactJobTitle" character varying(150)`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "numAgents" integer`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "numListings" integer`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "logoUrl" text`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "websiteUrl" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "additionalNotes" text`);

        // Fix primaryColor length
        await queryRunner.query(`ALTER TABLE "organization" ALTER COLUMN "primaryColor" TYPE character varying(50)`);

        // Add unique constraint
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "UQ_submitted_by_agent" UNIQUE ("submittedByAgentId")`);
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
