import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateQrScanTable1713000000035 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "property_qr_scans",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "property_id",
                        type: "int",
                    },
                    {
                        name: "latitude",
                        type: "numeric",
                        precision: 10,
                        scale: 8,
                        isNullable: true,
                    },
                    {
                        name: "longitude",
                        type: "numeric",
                        precision: 11,
                        scale: 8,
                        isNullable: true,
                    },
                    {
                        name: "city",
                        type: "varchar",
                        length: "120",
                        isNullable: true,
                    },
                    {
                        name: "country",
                        type: "varchar",
                        length: "120",
                        isNullable: true,
                    },
                    {
                        name: "ip_address",
                        type: "varchar",
                        length: "45",
                        isNullable: true,
                    },
                    {
                        name: "scanned_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            }),
            true
        );

        await queryRunner.createForeignKey(
            "property_qr_scans",
            new TableForeignKey({
                columnNames: ["property_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "property",
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("property_qr_scans");
        if (table) {
            const foreignKey = table.foreignKeys.find(
                (fk) => fk.columnNames.indexOf("property_id") !== -1
            );
            if (foreignKey) {
                await queryRunner.dropForeignKey("property_qr_scans", foreignKey);
            }
        }
        await queryRunner.dropTable("property_qr_scans");
    }
}
