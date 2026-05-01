import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ENVConfigService } from '@/common/config/env.config';

type SignedUrlOptions = {
  responseContentDisposition?: 'inline' | 'attachment';
};

@Injectable()
export class AwsService {
  private readonly logger = new Logger(AwsService.name);

  constructor(private readonly envConfigService: ENVConfigService) {}

  s3Client(): S3Client {
    return new S3Client({
      region: this.envConfigService.get<string>('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.envConfigService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.envConfigService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<void> {
    await this.uploadGeneralFile(file.buffer, file.mimetype, key);
  }

  async uploadPDF(file: Buffer, key: string): Promise<void> {
    await this.uploadGeneralFile(file, 'application/pdf', key);
  }

  async uploadGeneralFile(
    body: Buffer,
    contentType: string,
    key: string,
  ): Promise<void> {
    try {
      const upload = new Upload({
        client: this.s3Client(),
        params: {
          Bucket: this.envConfigService.get<string>('AWS_S3_BUCKET'),
          Key: this.normalizeKey(key),
          Body: body,
          ContentType: contentType,
        },
      });
      await upload.done();
    } catch (error) {
      this.logger.error(
        `Failed to upload object to S3 for key ${key}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  async getSignedURL(
    key: string,
    expiresIn = 432000,
    contentType?: string,
    options?: SignedUrlOptions,
  ): Promise<string | null> {
    if (!key?.trim()) {
      return null;
    }

    const resolved = this.resolveSourceKey(key);
    if (!resolved) {
      return key;
    }

    try {
      const command = new GetObjectCommand({
        Bucket: this.envConfigService.get<string>('AWS_S3_BUCKET'),
        Key: resolved,
        ResponseContentType: contentType,
        ResponseContentDisposition: options?.responseContentDisposition,
      });
      return await getSignedUrl(this.s3Client(), command, { expiresIn });
    } catch (error) {
      this.logger.error(
        `Failed to sign S3 object for key ${resolved}`,
        error instanceof Error ? error.stack : String(error),
      );
      return null;
    }
  }

  async deleteFile(key: string): Promise<void> {
    if (!key?.trim()) {
      return;
    }

    const resolved = this.resolveSourceKey(key);
    if (!resolved) {
      return;
    }

    try {
      await this.s3Client().send(
        new DeleteObjectCommand({
          Bucket: this.envConfigService.get<string>('AWS_S3_BUCKET'),
          Key: resolved,
        }),
      );
    } catch (error) {
      this.logger.error(
        `Failed to delete S3 object for key ${resolved}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException('Failed to delete file');
    }
  }

  async getObjectBuffer(
    key: string,
  ): Promise<{ buffer: Buffer; contentType: string | undefined } | null> {
    if (!key?.trim()) {
      return null;
    }

    const resolved = this.resolveSourceKey(key);
    if (!resolved) {
      return null;
    }

    try {
      const object = await this.s3Client().send(
        new GetObjectCommand({
          Bucket: this.envConfigService.get<string>('AWS_S3_BUCKET'),
          Key: resolved,
        }),
      );
      if (!object.Body) {
        return null;
      }
      const body = object.Body as {
        transformToByteArray: () => Promise<Uint8Array>;
      };
      const bytes = await body.transformToByteArray();
      return {
        buffer: Buffer.from(bytes),
        contentType: object.ContentType,
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch S3 object for key ${resolved}`,
        error instanceof Error ? error.stack : String(error),
      );
      return null;
    }
  }

  private normalizeKey(key: string): string {
    return key.replace(/^\/+/, '').trim();
  }

  private resolveSourceKey(source: string): string | null {
    const input = source.trim();
    if (!input) {
      return null;
    }

    if (!input.startsWith('http://') && !input.startsWith('https://')) {
      return this.normalizeKey(input);
    }

    try {
      const url = new URL(input);
      const bucket = this.envConfigService.get<string>('AWS_S3_BUCKET');
      const region = this.envConfigService.get<string>('AWS_S3_REGION');
      const host = url.hostname.toLowerCase();
      const path = decodeURIComponent(url.pathname).replace(/^\/+/, '');

      const isVirtualHosted =
        host === `${bucket}.s3.${region}.amazonaws.com` ||
        host === `${bucket}.s3.amazonaws.com`;
      if (isVirtualHosted) {
        return this.normalizeKey(path);
      }

      const isPathStyle =
        host === `s3.${region}.amazonaws.com` || host === 's3.amazonaws.com';
      if (isPathStyle && path.startsWith(`${bucket}/`)) {
        return this.normalizeKey(path.slice(bucket.length + 1));
      }

      return null;
    } catch {
      return null;
    }
  }
}
