import { Global, Module } from '@nestjs/common';
import { AppwriteService } from '@/common/services/appwrite/appwrite.service';
import { VideoProcessingService } from './services/video-processing.service';

@Global()
@Module({
  providers: [AppwriteService, VideoProcessingService],
  exports: [AppwriteService, VideoProcessingService],
})
export class StorageModule {}
