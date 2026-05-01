import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePropertyDto {
  @ApiProperty({ example: 'Modern Penthouse with Skyline View' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  propertyTitle: string;

  @ApiProperty({
    example: 'Spacious top-floor unit near transit and downtown amenities.',
  })
  @IsString()
  @IsNotEmpty()
  propertyDescription: string;

  @ApiProperty({ example: 'Residential Apartment' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  propertyType: string;

  @ApiProperty({ example: 4500 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  askingPriceMonthly: number;

  @ApiProperty({ example: 3 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  beds: number;

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  baths: number;

  @ApiProperty({ example: 1200 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  totalSqft: number;

  @ApiProperty({ example: '123 Architectural Way' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  streetAddress: string;

  @ApiProperty({ example: 'San Francisco' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  city: string;

  @ApiProperty({ example: '94103' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  zipCode: string;

  @ApiPropertyOptional({
    example: ['Skyline views', 'In-unit laundry', 'Walk to transit'],
    description: 'Listing highlight bullets for the property card',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @IsString({ each: true })
  @MaxLength(200, { each: true })
  listingHighlights?: string[];
}
