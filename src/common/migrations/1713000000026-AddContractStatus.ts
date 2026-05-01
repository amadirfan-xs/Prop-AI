import { MigrationInterface, QueryRunner } from "typeorm";

export class AddContractStatus1713000000026 implements MigrationInterface {
    name = 'AddContractStatus1713000000026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add status column with default 'PENDING' as per user request (Direct Pending)
        await queryRunner.query(`ALTER TABLE "property_purchase_contract" ADD "status" character varying(30) NOT NULL DEFAULT 'PENDING'`);
        
        // Update existing superseded records (non-latest)
        await queryRunner.query(`UPDATE "property_purchase_contract" SET "status" = 'SUPERSEDED' WHERE "is_latest" = false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property_purchase_contract" DROP COLUMN "status"`);
    }

}
