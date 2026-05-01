import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
  normalizeEndpoint(path: string): string {
    const normalized = `/${path}`
      .replace(/\/+/g, '/')
      .replace(/\/$/, '')
      .toLowerCase();
    return normalized === '' ? '/' : normalized;
  }

  buildRouteKey(controllerPath: string, routePath: string): string {
    const joined = `${controllerPath}/${routePath}`.replace(/\/+/g, '/');
    return this.normalizeEndpoint(joined);
  }

  formatPermissionName(endpoint: string, method: string): string {
    const raw = endpoint
      .replace(/^\//, '')
      .split('/')
      .map((part) => part.replace(':', '').replace(/[-_]/g, ' '))
      .filter(Boolean)
      .join(' ');
    const base = raw || 'root';
    return `${method.toUpperCase()} ${base}`;
  }
}
