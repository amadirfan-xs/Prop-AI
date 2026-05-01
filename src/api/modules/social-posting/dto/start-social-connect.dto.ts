import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';
import {
  SOCIAL_PLATFORMS,
  type SocialPlatform,
} from '@/api/modules/social-posting/types/social-post.types';

export class StartSocialConnectDto {
  @ApiProperty({ enum: SOCIAL_PLATFORMS })
  @IsString()
  @IsIn(SOCIAL_PLATFORMS)
  platform: SocialPlatform;
}
