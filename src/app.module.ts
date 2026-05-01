import { Module } from '@nestjs/common';
import { AdminModule } from '@/admin/admin.module';
import { ApiModule } from '@/api/api.module';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

@Module({
  imports: [ApiModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
