import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEmailConfigDto {
  @ApiProperty({ description: 'Label for the email app (e.g. Sales Gmail)' })
  @IsNotEmpty()
  @IsString()
  appName: string;

  @ApiProperty({ description: 'The email address for the app' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The Google App Password' })
  @IsNotEmpty()
  @IsString()
  appPassword: string;
}

export class UpdateEmailConfigDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  appName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  appPassword?: string;
}
