import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddIsReadToPropertyInquiry1776686400000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("property_inquiry", new TableColumn({
            name: "is_read",
            type: "boolean",
            default: false
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("property_inquiry", "is_read");
    }

}
