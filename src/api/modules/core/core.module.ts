import { Global, Module } from '@nestjs/common';
import { ENVConfigService } from '@/common/config/env.config';
import { HelperService } from '@/common/utils/helper.service';

@Global()
@Module({
  providers: [ENVConfigService, HelperService],
  exports: [ENVConfigService, HelperService],
})
export class CoreModule {}
