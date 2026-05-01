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

  @ApiProperty({ description: 'The Google App Password or SMTP password' })
  @IsNotEmpty()
  @IsString()
  appPassword: string;

  @ApiProperty({ description: 'Type of configuration: app_password or smtp', enum: ['app_password', 'smtp'] })
  @IsNotEmpty()
  @IsString()
  configType: string;

  @ApiPropertyOptional({ description: 'SMTP host' })
  @IsOptional()
  @IsString()
  host?: string;

  @ApiPropertyOptional({ description: 'SMTP port' })
  @IsOptional()
  port?: number;

  @ApiPropertyOptional({ description: 'SMTP secure' })
  @IsOptional()
  secure?: boolean;
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  configType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  host?: string;

  @ApiPropertyOptional()
  @IsOptional()
  port?: number;

  @ApiPropertyOptional()
  @IsOptional()
  secure?: boolean;
}
