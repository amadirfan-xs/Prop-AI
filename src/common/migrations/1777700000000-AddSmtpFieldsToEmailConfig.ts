import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddSmtpFieldsToEmailConfig1777700000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("user_email_configuration", [
            new TableColumn({
                name: "config_type",
                type: "varchar",
                length: "50",
                isNullable: false,
                default: "'app_password'"
            }),
            new TableColumn({
                name: "host",
                type: "varchar",
                length: "255",
                isNullable: true
            }),
            new TableColumn({
                name: "port",
                type: "integer",
                isNullable: true
            }),
            new TableColumn({
                name: "secure",
                type: "boolean",
                isNullable: true,
                default: false
            })
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("user_email_configuration", "config_type");
        await queryRunner.dropColumn("user_email_configuration", "host");
        await queryRunner.dropColumn("user_email_configuration", "port");
        await queryRunner.dropColumn("user_email_configuration", "secure");
    }
}
