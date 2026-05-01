import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class InvitePropertyStakeholderDto {
  @ApiProperty({ type: String, example: 'Jane Seller' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiProperty({ type: String, example: 'jane@example.com' })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({ type: Number, example: 2 })
  @IsInt()
  userTypeId: number;

  @ApiProperty({
    type: String,
    enum: ['individual', 'LLC'],
    example: 'individual',
  })
  @IsString()
  @IsIn(['individual', 'LLC'])
  userType: 'individual' | 'LLC';
}
