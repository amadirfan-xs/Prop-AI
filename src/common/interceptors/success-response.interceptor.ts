import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, map } from 'rxjs';

type SuccessResponseBody = {
  statusCode: number;
  message: string;
  data: unknown;
};

@Injectable()
export class SuccessResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data: unknown) => {
        if (
          data &&
          typeof data === 'object' &&
          'statusCode' in (data as Record<string, unknown>) &&
          'message' in (data as Record<string, unknown>) &&
          'data' in (data as Record<string, unknown>)
        ) {
          return data;
        }

        const statusCode = response.statusCode || 200;
        const message =
          data &&
          typeof data === 'object' &&
          'message' in (data as Record<string, unknown>) &&
          typeof (data as Record<string, unknown>).message === 'string'
            ? String((data as Record<string, unknown>).message)
            : 'Success';

        const body: SuccessResponseBody = {
          statusCode,
          message,
          data,
        };

        return body;
      }),
    );
  }
}
