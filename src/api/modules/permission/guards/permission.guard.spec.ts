import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PermissionGuard } from '@/api/modules/permission/guards/permission.guard';

describe('PermissionGuard', () => {
  const makeContext = (): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          params: {},
          query: {},
          route: { path: 'users/:id' },
          baseUrl: '/api',
          originalUrl: '/api/users/1',
          method: 'GET',
          user: { id: 'u1', userTypeId: 'type-1' },
        }),
      }),
    }) as ExecutionContext;

  it('allows request when granted by permission flow', async () => {
    const guard = new PermissionGuard(
      { isPermission: jest.fn().mockResolvedValue(true) } as never,
      {
        buildRouteKey: jest.fn().mockReturnValue('/api/users/:id'),
        normalizeEndpoint: jest.fn(),
      } as never,
    );
    await expect(guard.canActivate(makeContext())).resolves.toBe(true);
  });

  it('denies request when permission check fails', async () => {
    const guard = new PermissionGuard(
      { isPermission: jest.fn().mockResolvedValue(false) } as never,
      {
        buildRouteKey: jest.fn().mockReturnValue('/api/users/:id'),
        normalizeEndpoint: jest.fn(),
      } as never,
    );
    await expect(guard.canActivate(makeContext())).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });
});
