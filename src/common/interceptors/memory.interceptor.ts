import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class MemoryInterceptor implements NestInterceptor {
  private readonly logger = new Logger(MemoryInterceptor.name);
  private readonly logEnabled = process.env.NODE_ENV !== 'production';

  intercept(_: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (!this.logEnabled) {
      return next.handle();
    }

    const startUsage = process.memoryUsage().heapUsed;
    return next.handle().pipe(
      tap(() => {
        const endUsage = process.memoryUsage().heapUsed;
        const deltaMb = ((endUsage - startUsage) / 1024 / 1024).toFixed(2);
        this.logger.log(`[MEMORY] Heap delta ${deltaMb} MB`);
      }),
    );
  }
}
