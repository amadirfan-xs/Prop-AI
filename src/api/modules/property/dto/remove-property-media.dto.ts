import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RemovePropertyMediaDto {
  @ApiProperty({
    example: 'uploads/images/property/15/original-1735876231234-uuid.jpg',
    description: 'The exact originalKey entry from property_media to remove',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1024)
  key: string;
}
