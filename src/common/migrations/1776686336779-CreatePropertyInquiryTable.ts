import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreatePropertyInquiryTable1776686336779 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "property_inquiry",
            columns: [
                {
                    name: "id",
                    type: "integer",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "property_id",
                    type: "integer",
                    isNullable: false
                },
                {
                    name: "first_name",
                    type: "varchar",
                    length: "150",
                    isNullable: false
                },
                {
                    name: "last_name",
                    type: "varchar",
                    length: "150",
                    isNullable: false
                },
                {
                    name: "email",
                    type: "varchar",
                    length: "255",
                    isNullable: false
                },
                {
                    name: "message",
                    type: "text",
                    isNullable: false
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()"
                }
            ]
        }), true);

        await queryRunner.createForeignKey("property_inquiry", new TableForeignKey({
            columnNames: ["property_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "property",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("property_inquiry");
        if (table) {
            const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("property_id") !== -1);
            if (foreignKey) {
                await queryRunner.dropForeignKey("property_inquiry", foreignKey);
            }
        }
        await queryRunner.dropTable("property_inquiry");
    }

}
