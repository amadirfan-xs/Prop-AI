import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedAgentUserType1713000000006 implements MigrationInterface {
  name = 'SeedAgentUserType1713000000006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "user_type" ("id", "name", "parentId")
      VALUES (1, 'Agent', NULL)
      ON CONFLICT ("id") DO UPDATE
      SET "name" = EXCLUDED."name";
    `);
    await queryRunner.query(`
      SELECT setval(
        pg_get_serial_sequence('"user_type"', 'id'),
        GREATEST((SELECT COALESCE(MAX("id"), 1) FROM "user_type"), 1),
        true
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "user_type" WHERE "id" = 1;`);
  }
}
