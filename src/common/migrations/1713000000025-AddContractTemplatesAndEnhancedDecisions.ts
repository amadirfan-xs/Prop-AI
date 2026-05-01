import { MigrationInterface, QueryRunner } from "typeorm";

export class AddContractTemplatesAndEnhancedDecisions1713000000025 implements MigrationInterface {
    name = 'AddContractTemplatesAndEnhancedDecisions1713000000025'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Create Purchase Contract Templates table
        await queryRunner.query(`
            CREATE TABLE "property_purchase_contract_template" (
                "id" SERIAL PRIMARY KEY,
                "name" character varying(100) NOT NULL,
                "type" character varying(50) NOT NULL,
                "description" text,
                "html_content" text NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        // 2. Enhance Purchase Contract table to support HTML-based versions
        await queryRunner.query(`ALTER TABLE "property_purchase_contract" ADD "html_content" text`);
        await queryRunner.query(`ALTER TABLE "property_purchase_contract" ADD "template_id" integer`);

        // 3. Create a dedicated Decision table to track comments and history per version
        await queryRunner.query(`
            CREATE TABLE "property_purchase_contract_decision" (
                "id" SERIAL PRIMARY KEY,
                "contract_id" integer NOT NULL,
                "user_id" integer NOT NULL,
                "decision" character varying(20) NOT NULL,
                "comment" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_decision_contract" FOREIGN KEY ("contract_id") REFERENCES "property_purchase_contract"("id") ON DELETE CASCADE
            )
        `);

        // 4. Indexing for performance
        await queryRunner.query(`CREATE INDEX "idx_pc_template_id" ON "property_purchase_contract"("template_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "idx_pc_template_id"`);
        await queryRunner.query(`DROP TABLE "property_purchase_contract_decision"`);
        await queryRunner.query(`ALTER TABLE "property_purchase_contract" DROP COLUMN "template_id"`);
        await queryRunner.query(`ALTER TABLE "property_purchase_contract" DROP COLUMN "html_content"`);
        await queryRunner.query(`DROP TABLE "property_purchase_contract_template"`);
    }

}
