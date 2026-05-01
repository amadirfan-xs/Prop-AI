import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedOrganizationUserTypes1777800000000 implements MigrationInterface {
  name = 'SeedOrganizationUserTypes1777800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "user_type" ("id", "name", "parentId")
      VALUES 
        (4, 'Organization Owner', NULL),
        (5, 'Organization Agent', NULL)
      ON CONFLICT ("id") DO UPDATE
      SET "name" = EXCLUDED."name";
    `);

    // Reset the serial sequence to ensure future inserts don't conflict
    await queryRunner.query(`
      SELECT setval(
        pg_get_serial_sequence('"user_type"', 'id'),
        GREATEST((SELECT COALESCE(MAX("id"), 1) FROM "user_type"), 1),
        true
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "user_type" WHERE "id" IN (4, 5);`);
  }
}
