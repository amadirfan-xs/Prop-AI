import { Module } from '@nestjs/common';
import { AiController } from './controllers/ai.controller';
import { AiService } from './services/ai.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@/api/modules/auth/auth.module';

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
