import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFulfillmentStatusAndContractDecision1713000000024 implements MigrationInterface {
    name = 'AddFulfillmentStatusAndContractDecision1713000000024'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" ADD "fulfillment_status" character varying(40) NOT NULL DEFAULT 'In Review'`);
        await queryRunner.query(`ALTER TABLE "property_stakeholders" ADD "contract_decision" character varying(20)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property_stakeholders" DROP COLUMN "contract_decision"`);
        await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "fulfillment_status"`);
    }

}
