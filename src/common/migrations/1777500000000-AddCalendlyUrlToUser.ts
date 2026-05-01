import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCalendlyUrlToUser1777500000000 implements MigrationInterface {
    name = 'AddCalendlyUrlToUser1777500000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_account" ADD "calendlyUrl" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "calendlyUrl"`);
    }

}
