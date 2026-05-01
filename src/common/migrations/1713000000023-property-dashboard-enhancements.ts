import { MigrationInterface, QueryRunner } from "typeorm";

export class PropertyDashboardEnhancements1713000000023 implements MigrationInterface {
    name = 'PropertyDashboardEnhancements1713000000023'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Create property_activity table
        await queryRunner.query(`
            CREATE TABLE "property_activity" (
                "id" SERIAL NOT NULL,
                "property_id" integer NOT NULL,
                "actor_id" integer NOT NULL,
                "event" character varying(100) NOT NULL,
                "description" text NOT NULL,
                "metadata" jsonb,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_property_activity_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "idx_property_activity_property_id" ON "property_activity" ("property_id")`);
        await queryRunner.query(`CREATE INDEX "idx_property_activity_created_at" ON "property_activity" ("created_at")`);

        // 2. Add last_invite_sent_at to property_stakeholders
        await queryRunner.query(`
            ALTER TABLE "property_stakeholders" 
            ADD COLUMN "last_invite_sent_at" TIMESTAMP
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property_stakeholders" DROP COLUMN "last_invite_sent_at"`);
        await queryRunner.query(`DROP INDEX "idx_property_activity_created_at"`);
        await queryRunner.query(`DROP INDEX "idx_property_activity_property_id"`);
        await queryRunner.query(`DROP TABLE "property_activity"`);
    }

}
