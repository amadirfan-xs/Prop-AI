import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

type NormalizedErrorResponse = {
  statusCode: number;
  message: string;
  error: string;
  details?: unknown;
};

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    console.error('Exception caught by ErrorFilter:', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const normalized = this.normalizeException(exception, statusCode);

    response.status(statusCode).json({
      success: false,
      statusCode: normalized.statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: normalized.message,
      error: normalized.error,
      ...(normalized.details !== undefined
        ? { details: normalized.details }
        : {}),
    });
  }

  private normalizeException(
    exception: unknown,
    statusCode: number,
  ): NormalizedErrorResponse {
    if (!(exception instanceof HttpException)) {
      return {
        statusCode,
        message: 'Internal server error',
        error: 'InternalServerError',
      };
    }

    const payload = exception.getResponse();
    if (typeof payload === 'string') {
      return {
        statusCode,
        message: payload,
        error: this.resolveHttpErrorName(exception),
      };
    }

    if (payload && typeof payload === 'object') {
      const response = payload as Record<string, unknown>;
      const rawMessage = response.message;
      const message = Array.isArray(rawMessage)
        ? rawMessage.join(', ')
        : typeof rawMessage === 'string'
          ? rawMessage
          : exception.message || 'Request failed';

      return {
        statusCode,
        message,
        error:
          typeof response.error === 'string'
            ? response.error
            : this.resolveHttpErrorName(exception),
        ...(rawMessage !== undefined ? { details: rawMessage } : {}),
      };
    }

    return {
      statusCode,
      message: exception.message || 'Request failed',
      error: this.resolveHttpErrorName(exception),
    };
  }

  private resolveHttpErrorName(exception: HttpException): string {
    return exception.name?.replace(/Exception$/, '') || 'HttpError';
  }
}
