import { PermissionRepository } from '@/api/modules/permission/repositories/permission.repository';

describe('PermissionRepository', () => {
  it('does not duplicate permission on repeated upsert', async () => {
    const permissionEntityRepo = {
      findOne: jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce({
        id: 'perm-1',
        endpoint: '/api/test',
        method: 'GET',
        name: 'GET api test',
        permissionGroupId: 'group-1',
      }),
      save: jest.fn().mockResolvedValue({ id: 'perm-1' }),
    };
    const permissionGroupEntityRepo = {
      findOne: jest.fn().mockResolvedValue({ id: 'group-1', name: 'General' }),
      save: jest.fn(),
    };
    const repository = new PermissionRepository(
      permissionEntityRepo as never,
      permissionGroupEntityRepo as never,
      { findOne: jest.fn() } as never,
      { findOne: jest.fn() } as never,
    );

    await repository.upsertEndpointPermission({
      endpoint: '/api/test',
      method: 'GET',
      name: 'GET api test',
    });
    await repository.upsertEndpointPermission({
      endpoint: '/api/test',
      method: 'GET',
      name: 'GET api test',
    });

    expect(permissionEntityRepo.save).toHaveBeenCalledTimes(1);
  });

  it('applies explicit user override before user type grant', async () => {
    const permissionEntityRepo = {
      findOne: jest.fn().mockResolvedValue({ id: 'perm-1' }),
    };
    const permissionGroupEntityRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
    };
    const userPermissionEntityRepo = {
      findOne: jest.fn().mockResolvedValue({ granted: false }),
    };
    const userTypePermissionEntityRepo = {
      findOne: jest.fn().mockResolvedValue({ granted: true }),
    };

    const repository = new PermissionRepository(
      permissionEntityRepo as never,
      permissionGroupEntityRepo as never,
      userPermissionEntityRepo as never,
      userTypePermissionEntityRepo as never,
    );

    const allowed = await repository.isPermission({
      endpoint: '/api/test',
      method: 'GET',
      userId: 'user-1',
      userTypeId: 'type-1',
    });

    expect(allowed).toBe(false);
    expect(userTypePermissionEntityRepo.findOne).not.toHaveBeenCalled();
  });
});
