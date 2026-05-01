import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserRoles1713000000020 implements MigrationInterface {
    name = 'CreateUserRoles1713000000020'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user_roles" (
                "id" SERIAL NOT NULL,
                "userId" integer NOT NULL,
                "userTypeId" integer NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_8ca6558837b4776f4e319d3e75a" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "user_roles" 
            ADD CONSTRAINT "FK_8a6dcfe36018ddbcda63cfcc878" 
            FOREIGN KEY ("userId") REFERENCES "user_account"("id") 
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_roles" 
            ADD CONSTRAINT "FK_xxxx_usertype" 
            FOREIGN KEY ("userTypeId") REFERENCES "user_type"("id") 
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        // Migrate existing userTypeId to user_roles
        await queryRunner.query(`
            INSERT INTO "user_roles" ("userId", "userTypeId")
            SELECT "id", "userTypeId" FROM "user_account"
            WHERE "userTypeId" IS NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_xxxx_usertype"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_8a6dcfe36018ddbcda63cfcc878"`);
        await queryRunner.query(`DROP TABLE "user_roles"`);
    }

}
