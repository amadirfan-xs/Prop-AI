import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class AddUserEmailConfigAndProfileFields1713000000027 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add new profile fields to user_account
        await queryRunner.query(`ALTER TABLE "user_account" ADD "phoneNumber" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "user_account" ADD "address" text`);

        // Create user_email_configuration table
        await queryRunner.createTable(new Table({
            name: "user_email_configuration",
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
                    name: "appName",
                    type: "varchar",
                    length: "255"
                },
                {
                    name: "email",
                    type: "varchar",
                    length: "255"
                },
                {
                    name: "encryptedAppPassword",
                    type: "text"
                },
                {
                    name: "iv",
                    type: "varchar",
                    length: "255"
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

        await queryRunner.createForeignKey("user_email_configuration", new TableForeignKey({
            columnNames: ["user_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "user_account",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("user_email_configuration");
        if (table) {
            const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf("user_id") !== -1);
            if (foreignKey) {
                await queryRunner.dropForeignKey("user_email_configuration", foreignKey);
            }
        }
        await queryRunner.dropTable("user_email_configuration");
        await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "user_account" DROP COLUMN "phoneNumber"`);
    }

}
