import { Injectable, Logger } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
const ffmpegStatic = require('ffmpeg-static');
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import axios from 'axios';
import { AppwriteService } from '@/common/services/appwrite/appwrite.service';
import { randomBytes } from 'crypto';

@Injectable()
export class VideoProcessingService {
  private readonly logger = new Logger(VideoProcessingService.name);

  constructor(private readonly appwriteService: AppwriteService) {
    if (ffmpegStatic) {
      (ffmpeg as any).setFfmpegPath(ffmpegStatic);
    }
  }
  async createVideoFromImages(imageUrls: string[], propertyId: number): Promise<string> {
    const tempDir = path.join(os.tmpdir(), `propai-video-${randomBytes(4).toString('hex')}`);
    fs.mkdirSync(tempDir, { recursive: true });

    const localPaths: string[] = [];
    const outputFileName = `property_${propertyId}_slideshow.mp4`;
    const outputPath = path.join(tempDir, outputFileName);

    try {
      this.logger.log(`Starting video generation for property ${propertyId} with ${imageUrls.length} images`);

      // 1. Download images locally
      for (let i = 0; i < imageUrls.length; i++) {
        const localPath = path.join(tempDir, `image_${i}${path.extname(new URL(imageUrls[i]).pathname) || '.jpg'}`);
        const response = await axios.get(imageUrls[i], { responseType: 'arraybuffer' });
        fs.writeFileSync(localPath, response.data);
        localPaths.push(localPath);
      }

      if (localPaths.length === 0) {
        throw new Error('No images provided for video generation');
      }

     
      await new Promise<void>((resolve, reject) => {
        const command = (ffmpeg as any)();

        localPaths.forEach((imagePath) => {
          command.input(imagePath).loop(3);
        });

        command
          .on('start', (commandLine) => {
            this.logger.debug('Spawned Ffmpeg with command: ' + commandLine);
          })
          .on('error', (err) => {
            this.logger.error('An error occurred during video generation: ' + err.message);
            reject(err);
          })
          .on('end', () => {
            this.logger.log('Video generation finished successfully');
            resolve();
          })
          .videoCodec('libx264')
          .outputOptions([
            '-pix_fmt yuv420p',
            '-r 25',             
            '-vf scale=trunc(iw/2)*2:trunc(ih/2)*2'
          ])
          .save(outputPath);
      });

      const fileBuffer = fs.readFileSync(outputPath);
      const fileKey = `property_videos/prop_${propertyId}_${Date.now()}.mp4`;
      
      this.logger.log(`Uploading generated video to key: ${fileKey}`);
      
      const fileId = await this.appwriteService.uploadGeneralFile(
        fileBuffer,
        'video/mp4',
        fileKey
      );

      this.logger.log(`Video uploaded successfully. File ID: ${fileId}`);
      return fileKey;

    } catch (error: any) {
      this.logger.error(`Failed to generate/upload video: ${error.message}`);
      throw error;
    } finally {
      // 4. Cleanup
      try {
        if (fs.existsSync(tempDir)) {
          fs.rmSync(tempDir, { recursive: true, force: true });
        }
      } catch (cleanupError: any) {
        this.logger.warn(`Failed to cleanup temp directory ${tempDir}: ${cleanupError.message}`);
      }
    }
  }
}
