import { Global, Module } from '@nestjs/common';
import { AppwriteService } from '@/common/services/appwrite/appwrite.service';

@Global()
@Module({
  providers: [AppwriteService],
  exports: [AppwriteService],
})
export class StorageModule {}
