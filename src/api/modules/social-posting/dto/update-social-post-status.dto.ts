import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class UpdateSocialPostStatusDto {
  @ApiProperty({ enum: ['failed', 'cancelled'] })
  @IsString()
  @IsIn(['failed', 'cancelled'])
  status: 'failed' | 'cancelled';
}
