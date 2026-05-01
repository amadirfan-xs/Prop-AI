import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggerInterceptor.name);
  private readonly logEnabled = process.env.NODE_ENV !== 'production';

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (!this.logEnabled) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const elapsed = Date.now() - start;
        const method = request.method;
        const url = request.url;
        this.logger.log(`[HTTP] ${method} ${url} - ${elapsed}ms`);
      }),
    );
  }
}
