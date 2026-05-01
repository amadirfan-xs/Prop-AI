import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AccessTokenAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) { }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<
      Request & {
        user?: unknown;
        body?: unknown;
      }
    >();
    const accessTokenHeader = request.headers['access-token'];
    const bearerToken = this.extractBearerToken(request.headers.authorization);
    const bodyToken = this.extractBodyToken(request.body);
    const cookieToken = request.cookies?.['auth_token'];
    const queryToken = request.query?.['token'];
    const token = this.resolveToken(
      accessTokenHeader,
      bearerToken,
      bodyToken,
      cookieToken,
      queryToken as string,
    );

    if (!token) {
      throw new UnauthorizedException(
        'Authorization Bearer token, access-token header, or accessToken in body is required',
      );
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      
      if (decoded.status && !['ACTIVE', 'INVITED'].includes(decoded.status)) {
        throw new UnauthorizedException(`Account status is '${decoded.status}'. Please complete setup or contact administrator.`);
      }

      request.user = decoded;
      return true;
    } catch (e) {
      if (e instanceof UnauthorizedException) throw e;
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  private resolveToken(
    accessTokenHeader: string | string[] | undefined,
    bearerToken: string | null,
    bodyToken: unknown,
    cookieToken: string | undefined,
    queryToken: string | undefined,
  ): string | null {
    if (bearerToken) {
      return bearerToken;
    }
    if (queryToken && queryToken.trim() !== '') {
      return queryToken.trim();
    }
    if (cookieToken && cookieToken.trim() !== '') {
      return cookieToken.trim();
    }
    if (
      typeof accessTokenHeader === 'string' &&
      accessTokenHeader.trim() !== ''
    ) {
      return accessTokenHeader.trim();
    }
    if (typeof bodyToken === 'string' && bodyToken.trim() !== '') {
      return bodyToken.trim();
    }
    return null;
  }

  private extractBearerToken(
    authorization: string | string[] | undefined,
  ): string | null {
    if (!authorization || typeof authorization !== 'string') {
      return null;
    }
    const match = /^Bearer\s+(.+)$/i.exec(authorization.trim());
    if (!match?.[1]) {
      return null;
    }
    const value = match[1].trim();
    return value !== '' ? value : null;
  }

  private extractBodyToken(body: unknown): unknown {
    if (!body || typeof body !== 'object') {
      return undefined;
    }
    const payload = body as Record<string, unknown>;
    return payload.accessToken ?? payload.access_token;
  }
}
