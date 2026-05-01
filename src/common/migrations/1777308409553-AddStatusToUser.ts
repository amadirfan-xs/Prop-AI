import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusToUser1777308409553 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_account" ADD "status" character varying(20) NOT NULL DEFAULT 'ACTIVE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "status"`);
    }

}
