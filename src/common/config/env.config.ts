import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ENVConfigService {
  constructor(private readonly configService: ConfigService) {}

  get<T = string>(key: string): T {
    return this.configService.getOrThrow<T>(key);
  }

  getSafe<T = string>(key: string): T | undefined {
    return this.configService.get<T>(key);
  }
}
