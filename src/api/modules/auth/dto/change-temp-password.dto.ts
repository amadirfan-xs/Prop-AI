import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangeTempPasswordDto {
  @ApiProperty({ example: 'NewStrongPass123' })
  @IsString()
  @MinLength(8)
  newPassword: string;
}
