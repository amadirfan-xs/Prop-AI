import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsPhoneNumber } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ description: "User's full name" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: "User's phone number" })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ description: "User's physical address" })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: "User's Calendly booking URL" })
  @IsOptional()
  @IsString()
  calendlyUrl?: string;
}
