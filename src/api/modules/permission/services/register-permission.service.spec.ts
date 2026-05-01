import { RequestMethod } from '@nestjs/common';
import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { MetadataScanner, Reflector } from '@nestjs/core';
import { RegisterPermissionService } from '@/api/modules/permission/services/register-permission.service';

class MockController {
  testRoute(): string {
    return 'ok';
  }
}

describe('RegisterPermissionService', () => {
  it('registers discovered route permissions on startup', async () => {
    Reflect.defineMetadata(PATH_METADATA, 'api/test', MockController);
    const routeHandler = Object.getOwnPropertyDescriptor(
      MockController.prototype,
      'testRoute',
    )?.value as () => string;
    Reflect.defineMetadata(PATH_METADATA, 'items/:id', routeHandler);
    Reflect.defineMetadata(METHOD_METADATA, RequestMethod.GET, routeHandler);

    const instance = new MockController();
    const discoveryService = {
      getControllers: () => [{ instance, metatype: MockController }],
    };
    const metadataScanner = new MetadataScanner();
    const reflector = new Reflector();
    const permissionRepository = {
      upsertEndpointPermission: jest.fn().mockResolvedValue(undefined),
    };
    const helperService = {
      buildRouteKey: jest.fn().mockReturnValue('/api/test/items/:id'),
      formatPermissionName: jest.fn().mockReturnValue('GET api test items id'),
    };

    const service = new RegisterPermissionService(
      discoveryService as never,
      metadataScanner,
      reflector,
      permissionRepository as never,
      helperService as never,
    );

    await service.onModuleInit();
    await service.onModuleInit();

    expect(permissionRepository.upsertEndpointPermission).toHaveBeenCalled();
    expect(permissionRepository.upsertEndpointPermission).toHaveBeenCalledWith({
      endpoint: '/api/test/items/:id',
      method: 'GET',
      name: 'GET api test items id',
    });
  });
});
