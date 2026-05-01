import { MigrationInterface, QueryRunner } from "typeorm";

export class RegisterMarketingEndpoints1713000000033 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Find the 'General' Permission Group ID
        const groupResult = await queryRunner.query(`
            SELECT "id" FROM "permission_group" WHERE "name" = 'General' LIMIT 1
        `);
        
        if (!groupResult || groupResult.length === 0) {
            throw new Error("'General' permission group not found. Cannot register marketing endpoints.");
        }
        
        const groupId = groupResult[0].id;

        // 2. Register Endpoints in the 'permission' table
        const permissions = [
            // Marketing
            { name: 'POST marketing campaigns', endpoint: '/api/marketing-campaigns', method: 'POST' },
            { name: 'GET marketing campaigns', endpoint: '/api/marketing-campaigns', method: 'GET' },
            { name: 'GET marketing campaigns id', endpoint: '/api/marketing-campaigns/:id', method: 'GET' },
            { name: 'GET marketing templates', endpoint: '/api/marketing-templates', method: 'GET' },
            
            // Profile & Avatar
            { name: 'PATCH user profile', endpoint: '/api/profile', method: 'PATCH' },
            { name: 'POST upload avatar', endpoint: '/api/profile/avatar', method: 'POST' },
            
            // User Email Configurations
            { name: 'POST create email config', endpoint: '/api/user-email-configs', method: 'POST' },
            { name: 'GET list email configs', endpoint: '/api/user-email-configs', method: 'GET' },
            { name: 'PATCH update email config', endpoint: '/api/user-email-configs/:id', method: 'PATCH' },
            { name: 'DELETE remove email config', endpoint: '/api/user-email-configs/:id', method: 'DELETE' },
        ];

        for (const p of permissions) {
            await queryRunner.query(`
                INSERT INTO "permission" ("name", "endpoint", "method", "permissionGroupId")
                VALUES ($1, $2, $3, $4)
                ON CONFLICT ("endpoint", "method") DO UPDATE
                SET "name" = EXCLUDED."name", "permissionGroupId" = EXCLUDED."permissionGroupId"
            `, [p.name, p.endpoint, p.method, groupId]);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Cleanup permissions
        await queryRunner.query(`
            DELETE FROM "permission" 
            WHERE "endpoint" LIKE '/api/marketing-campaigns%' 
               OR "endpoint" = '/api/marketing-templates'
               OR "endpoint" = '/api/profile'
               OR "endpoint" = '/api/profile/avatar'
               OR "endpoint" LIKE '/api/user-email-configs%'
        `);
    }
}
