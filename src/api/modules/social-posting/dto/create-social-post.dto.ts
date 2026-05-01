import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import {
  SOCIAL_PLATFORMS,
  SOCIAL_POST_MODES,
  type SocialPlatform,
} from '@/api/modules/social-posting/types/social-post.types';

export class CreateSocialPostTargetDto {
  @ApiProperty({ enum: SOCIAL_PLATFORMS })
  @IsString()
  @IsIn(SOCIAL_PLATFORMS)
  platform: SocialPlatform;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  socialDestinationId?: number;

  @ApiProperty({
    required: false,
    description:
      'Required for schedule mode; ignored for post_now mode. ISO timestamp.',
  })
  @IsOptional()
  @IsDateString()
  scheduledFor?: string;
}

export class CreateSocialPostDto {
  @ApiProperty({ maxLength: 5000 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  caption: string;

  @ApiProperty({ enum: SOCIAL_POST_MODES })
  @IsString()
  @IsIn(SOCIAL_POST_MODES)
  mode: (typeof SOCIAL_POST_MODES)[number];

  @ApiProperty({ type: [CreateSocialPostTargetDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateSocialPostTargetDto)
  targets: CreateSocialPostTargetDto[];
}
