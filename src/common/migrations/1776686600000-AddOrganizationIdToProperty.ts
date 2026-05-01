import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrganizationIdToProperty1776686600000 implements MigrationInterface {
    name = 'AddOrganizationIdToProperty1776686600000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" ADD "organization_id" integer`);
        await queryRunner.query(`ALTER TABLE "property" ADD CONSTRAINT "FK_property_organization" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE SET NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" DROP CONSTRAINT "FK_property_organization"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "organization_id"`);
    }

}
