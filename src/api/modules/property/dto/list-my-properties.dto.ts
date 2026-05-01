import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import {
  PROPERTY_STATUS_VALUES,
  type PropertyStatus,
} from '@/api/modules/property/types/property-status.enum';

export class ListMyPropertiesDto {
  @ApiPropertyOptional({ example: 1, minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10, minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    example: 'downtown',
    description: 'Searches in property title and street address',
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(100)
  search?: string;

  @ApiPropertyOptional({ enum: PROPERTY_STATUS_VALUES, example: 'Draft' })
  @IsOptional()
  @IsIn(PROPERTY_STATUS_VALUES)
  status?: PropertyStatus;

  @ApiPropertyOptional({ example: 'Residential Apartment' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  type?: string;
}
