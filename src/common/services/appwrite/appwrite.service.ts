import { Injectable, Logger } from '@nestjs/common';
import { Client, Storage, Permission, Role } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
import * as crypto from 'crypto';

import { ENVConfigService } from '@/common/config/env.config';

@Injectable()
export class AppwriteService {
  private readonly logger = new Logger(AppwriteService.name);
  private readonly client: Client;
  private readonly storage: Storage;
  private readonly bucketId: string;
  private readonly projectId: string;
  private readonly endpoint: string;

  constructor(private readonly envConfigService: ENVConfigService) {
    this.endpoint = this.envConfigService.get<string>('APPWRITE_ENDPOINT');
    this.projectId = this.envConfigService.get<string>('APPWRITE_PROJECT_ID');
    this.bucketId = this.envConfigService.get<string>('APPWRITE_BUCKET_ID');

    this.client = new Client()
      .setEndpoint(this.endpoint)
      .setProject(this.projectId)
      .setKey(this.envConfigService.get<string>('APPWRITE_API_KEY'));

    this.storage = new Storage(this.client);
  }
  private sanitizeFileId(key: string): string {
    // Generate a unique, deterministic 32-character ID using MD5 hash of the key (path)
    return crypto.createHash('md5').update(key).digest('hex');
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    const fileId = this.sanitizeFileId(key);
    try {
      try {
        await this.storage.createFile(
          this.bucketId,
          fileId,
          InputFile.fromBuffer(file.buffer, file.originalname),
          [Permission.read(Role.any())],
        );
      } catch (error: any) {
        if (error.code === 409) {
          // File already exists, delete and retry to "overwrite"
          await this.storage.deleteFile(this.bucketId, fileId);
          await this.storage.createFile(
            this.bucketId,
            fileId,
            InputFile.fromBuffer(file.buffer, file.originalname),
            [Permission.read(Role.any())],
          );
        } else {
          throw error;
        }
      }
      return fileId;
    } catch (error:any) {
      this.logger.error(`Failed to upload to Appwrite: ${error.message}`);
      throw error;
    }
  }

  async uploadPDF(buffer: Buffer, key: string): Promise<string> {
    const fileId = this.sanitizeFileId(key);
    try {
      try {
        await this.storage.createFile(
          this.bucketId,
          fileId,
          InputFile.fromBuffer(buffer, `${fileId}.pdf`),
          [Permission.read(Role.any())],
        );
      } catch (error: any) {
        if (error.code === 409) {
          await this.storage.deleteFile(this.bucketId, fileId);
          await this.storage.createFile(
            this.bucketId,
            fileId,
            InputFile.fromBuffer(buffer, `${fileId}.pdf`),
            [Permission.read(Role.any())],
          );
        } else {
          throw error;
        }
      }
      return fileId;
    } catch (error:any) {
      this.logger.error(`Failed to upload PDF to Appwrite: ${error.message}`);
      throw error;
    }
  }

  async uploadGeneralFile(buffer: Buffer, contentType: string, key: string): Promise<string> {
    const fileId = this.sanitizeFileId(key);
    try {
      try {
        await this.storage.createFile(
          this.bucketId,
          fileId,
          InputFile.fromBuffer(buffer, fileId),
          [Permission.read(Role.any())],
        );
      } catch (error: any) {
        if (error.code === 409) {
          await this.storage.deleteFile(this.bucketId, fileId);
          await this.storage.createFile(
            this.bucketId,
            fileId,
            InputFile.fromBuffer(buffer, fileId),
            [Permission.read(Role.any())],
          );
        } else {
          throw error;
        }
      }
      return fileId;
    } catch (error:any) {
      this.logger.error(`Failed to upload general file to Appwrite: ${error.message}`);
      throw error;
    }
  }

  async getSignedURL(
    key: string | null | undefined,
    expiresIn?: number,
    contentType?: string,
    options?: { responseContentDisposition?: 'inline' | 'attachment' },
  ): Promise<string | null> {
    if (!key) return null;
    
    // If it's already a full URL (legacy AWS or direct Appwrite URL), return it
    if (key.startsWith('http')) return key;

    const fileId = this.sanitizeFileId(key);
    // Appwrite public view URL
    return `${this.endpoint}/storage/buckets/${this.bucketId}/files/${fileId}/view?project=${this.projectId}`;
  }

  async deleteFile(key: string): Promise<void> {
    const fileId = this.sanitizeFileId(key);
    try {
      await this.storage.deleteFile(this.bucketId, fileId);
    } catch (error:any) {
      this.logger.warn(`Failed to delete file from Appwrite (might not exist): ${error.message}`);
    }
  }

  async getObjectBuffer(key: string): Promise<{ buffer: Buffer; contentType: string | undefined } | null> {
    const fileId = this.sanitizeFileId(key);
    try {
      const arrayBuffer = await this.storage.getFileDownload(this.bucketId, fileId);
      return {
        buffer: Buffer.from(arrayBuffer),
        contentType: undefined, 
      };
    } catch (error:any) {
      this.logger.error(`Failed to fetch file from Appwrite: ${error.message}`);
      return null;
    }
  }
}
