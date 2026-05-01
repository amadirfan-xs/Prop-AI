import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTypeAndLinkUser1713000000002 implements MigrationInterface {
  name = 'CreateUserTypeAndLinkUser1713000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_type" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" character varying(100) NOT NULL UNIQUE,
        "parentId" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "FK_user_type_parentId" FOREIGN KEY ("parentId") REFERENCES "user_type"("id") ON DELETE SET NULL
      );
    `);

    await queryRunner.query(`
      ALTER TABLE "user_account"
      ADD COLUMN IF NOT EXISTS "userTypeId" uuid;
    `);

    await queryRunner.query(`
      ALTER TABLE "user_account"
      ADD CONSTRAINT "FK_user_account_userTypeId"
      FOREIGN KEY ("userTypeId") REFERENCES "user_type"("id") ON DELETE SET NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user_account"
      DROP CONSTRAINT IF EXISTS "FK_user_account_userTypeId";
    `);

    await queryRunner.query(`
      ALTER TABLE "user_account"
      DROP COLUMN IF EXISTS "userTypeId";
    `);

    await queryRunner.query(`DROP TABLE IF EXISTS "user_type";`);
  }
}
