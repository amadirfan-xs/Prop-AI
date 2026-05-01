import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateMarketingTemplatesTable1713000000029 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "marketing_templates",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
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
                    name: "type",
                    type: "varchar",
                    length: "50",
                    default: "'email'"
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "now()"
                },
                {
                    name: "updated_at",
                    type: "timestamp",
                    default: "now()"
                }
            ]
        }), true);

        // Seed initial templates
        await queryRunner.query(`
            INSERT INTO marketing_templates (name, subject, content, type)
            VALUES 
            ('Luxury Property Intro', 'Experience the height of luxury at {property_name}', '<p>Hi there,</p><p>We are excited to present <strong>{property_name}</strong>. This architectural masterpiece offers unparalleled views and premium finishes throughout.</p><p>Would you like to schedule a private viewing?</p>', 'email'),
            ('Viewing Invitation', 'Exclusive Invitation: Private Viewing of {property_name}', '<p>Hello,</p><p>You are cordially invited to an exclusive private viewing of <strong>{property_name}</strong>.</p><p>This property features state-of-the-art amenities and a prime location that must be seen in person.</p><p>Please let us know your preferred time.</p>', 'email')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("marketing_templates");
    }
}
