import { MigrationInterface, QueryRunner } from 'typeorm';

export class GrantStakeholderPermissions1713000000021 implements MigrationInterface {
    name = 'GrantStakeholderPermissions1713000000021';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const groupResult = await queryRunner.query(`SELECT id FROM "permission_group" WHERE "name" = 'General' LIMIT 1`);
        const groupId = groupResult[0]?.id;

        if (!groupId) return;

        const permissions = [
            { name: 'POST api property propertyid invite stakeholder', endpoint: '/api/property/:propertyid/invite-stakeholder', method: 'POST' },
            { name: 'GET api property seller properties', endpoint: '/api/property/seller-properties', method: 'GET' },
            { name: 'GET api property propertyid', endpoint: '/api/property/:propertyid', method: 'GET' },
            { name: 'GET api property my properties', endpoint: '/api/property/my-properties', method: 'GET' }
        ];

        for (const p of permissions) {
            await queryRunner.query(`
        INSERT INTO "permission" ("name", "endpoint", "method", "permissionGroupId")
        VALUES ($1, $2, $3, $4)
        ON CONFLICT ("endpoint", "method") DO NOTHING;
      `, [p.name, p.endpoint, p.method, groupId]);
        }

        // Grant permissions to Agent (1)
        await queryRunner.query(`
      INSERT INTO "user_type_permission" ("userTypeId", "permissionId", "granted")
      SELECT 1, id, true FROM "permission" 
      WHERE endpoint = '/api/property/:propertyid/invite-stakeholder' AND method = 'POST'
      ON CONFLICT DO NOTHING;
    `);

        // Grant permissions to Seller (2)
        await queryRunner.query(`
      INSERT INTO "user_type_permission" ("userTypeId", "permissionId", "granted")
      SELECT 2, id, true FROM "permission" 
      WHERE endpoint = '/api/property/seller-properties' AND method = 'GET'
      ON CONFLICT DO NOTHING;
    `);

        await queryRunner.query(`
      INSERT INTO "user_type_permission" ("userTypeId", "permissionId", "granted")
      SELECT 2, id, true FROM "permission" 
      WHERE endpoint = '/api/property/:propertyid' AND method = 'GET'
      ON CONFLICT DO NOTHING;
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revoke permissions in reverse if needed
    }
}
