import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserAccount1713000000001 implements MigrationInterface {
  name = 'CreateUserAccount1713000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_account" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" character varying(150) NOT NULL,
        "email" character varying(255) NOT NULL UNIQUE,
        "passwordHash" text NOT NULL,
        "profilePictureUrl" character varying(1000),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "user_account";`);
  }
}
