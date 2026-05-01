import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsAuthorizedSignerToOrganization1776686500000 implements MigrationInterface {
    name = 'AddIsAuthorizedSignerToOrganization1776686500000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" ADD "isAuthorizedSigner" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "isAuthorizedSigner"`);
    }
}
