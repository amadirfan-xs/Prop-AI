import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from 'crypto';
import { ENVConfigService } from '@/common/config/env.config';

@Injectable()
export class SocialTokenCryptoService {
  constructor(private readonly envConfigService: ENVConfigService) {}

  encrypt(plain: string): string {
    const iv = randomBytes(16);
    const key = this.getKey();
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([
      cipher.update(plain, 'utf8'),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
  }

  decrypt(payload: string): string {
    const [ivHex, tagHex, encryptedHex] = payload.split(':');
    if (!ivHex || !tagHex || !encryptedHex) {
      throw new InternalServerErrorException('Invalid encrypted token payload');
    }
    const key = this.getKey();
    const decipher = createDecipheriv(
      'aes-256-gcm',
      key,
      Buffer.from(ivHex, 'hex'),
    );
    decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedHex, 'hex')),
      decipher.final(),
    ]);
    return decrypted.toString('utf8');
  }

  private getKey(): Buffer {
    const raw = this.envConfigService.get<string>('SOCIAL_TOKEN_SECRET') || '';
    if (raw.trim().length < 16) {
      throw new InternalServerErrorException(
        'SOCIAL_TOKEN_SECRET must be configured with at least 16 chars',
      );
    }
    return scryptSync(raw, 'social-token-salt', 32);
  }
}
