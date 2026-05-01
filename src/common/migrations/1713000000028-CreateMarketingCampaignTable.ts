import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateMarketingCampaignTable1713000000028 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "marketing_campaigns",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: "user_id",
                    type: "int",
                },
                {
                    name: "property_id",
                    type: "int",
                },
                {
                    name: "email_config_id",
                    type: "int",
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "255"
                },
                {
                    name: "subject",
                    type: "varchar",
                    length: "255"
                },
                {
                    name: "content",
                    type: "text"
                },
                {
                    name: "recipients",
                    type: "json"
                },
                {
                    name: "scheduledAt",
                    type: "timestamp",
                    isNullable: true
                },
                {
                    name: "status",
                    type: "varchar",
                    length: "50",
                    default: "'draft'"
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "now()"
                },
                {
                    name: "updatedAt",
                    type: "timestamp",
                    default: "now()"
                }
            ]
        }), true);

        await queryRunner.createForeignKey("marketing_campaigns", new TableForeignKey({
            columnNames: ["user_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "user_account",
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey("marketing_campaigns", new TableForeignKey({
            columnNames: ["property_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "property",
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey("marketing_campaigns", new TableForeignKey({
            columnNames: ["email_config_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "user_email_configuration",
            onDelete: "CASCADE" // or SET NULL if we want to keep campaign history after app is removed
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("marketing_campaigns");
        if (table) {
            const foreignKeys = table.foreignKeys;
            for (const fk of foreignKeys) {
                await queryRunner.dropForeignKey("marketing_campaigns", fk);
            }
        }
        await queryRunner.dropTable("marketing_campaigns");
    }

}
