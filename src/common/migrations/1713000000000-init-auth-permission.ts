import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitAuthPermission1713000000000 implements MigrationInterface {
  name = 'InitAuthPermission1713000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "permission" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "endpoint" character varying(255) UNIQUE NOT NULL,
        "method" character varying(16) NOT NULL
      );
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_permission" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" uuid NOT NULL,
        "permissionId" uuid NOT NULL REFERENCES "permission"("id") ON DELETE CASCADE,
        "isAllowed" boolean NOT NULL DEFAULT true
      );
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_type_permission" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "userTypeName" character varying(100) NOT NULL,
        "permissionId" uuid NOT NULL REFERENCES "permission"("id") ON DELETE CASCADE,
        "isAllowed" boolean NOT NULL DEFAULT true
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "user_type_permission";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_permission";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "permission";`);
  }
}
