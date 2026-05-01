import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class GenerateDescriptionDto {
  @ApiProperty({ example: 'Luxury Penthouse in Downtown' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Apartment' })
  @IsString()
  @IsNotEmpty()
  propertyType: string;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @IsNotEmpty()
  beds: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsNotEmpty()
  baths: number;

  @ApiProperty({ example: 1500 })
  @IsNumber()
  @IsNotEmpty()
  sqft: number;

  @ApiProperty({ example: '5000' })
  @IsString()
  @IsNotEmpty()
  price: string;

  @ApiProperty({ example: 'Miami' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: ['Ocean View', 'Private Pool'], required: false })
  @IsOptional()
  highlights?: string[];
}
