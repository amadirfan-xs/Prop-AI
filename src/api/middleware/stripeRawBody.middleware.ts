import { Injectable, NestMiddleware } from '@nestjs/common';
import { raw } from 'body-parser';
import { Request, Response } from 'express';

@Injectable()
export class StripeRawBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void): void {
    raw({ type: '*/*' })(req, res, next);
  }
}
