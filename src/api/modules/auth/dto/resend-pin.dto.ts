import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty } from 'class-validator';

export class ResendPINDTO {
  @ApiProperty({ example: 'password', enum: ['password'] })
  @IsIn(['password'])
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
