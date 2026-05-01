import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class InviteAgentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
