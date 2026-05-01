import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { PROPERTY_STATUS_VALUES, PropertyStatus } from '@/api/modules/property/types/property-status.enum';

export class PaginatedQueryDto {
  @ApiPropertyOptional({ example: 1, minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export class ActivityQueryDto extends PaginatedQueryDto {
  @ApiPropertyOptional({ description: 'Search term for activities' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class PropertyQueryDto extends PaginatedQueryDto {
  @ApiPropertyOptional({ description: 'Search term for property title' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: PropertyStatus, description: 'Filter by property status' })
  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  @ApiPropertyOptional({ description: 'Filter by property type' })
  @IsOptional()
  @IsString()
  type?: string;
}

export class AgentQueryDto extends PaginatedQueryDto {
  @ApiPropertyOptional({ description: 'Search term for agent name or email' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class StakeholderQueryDto extends PaginatedQueryDto {
  @ApiPropertyOptional({ description: 'Search term for stakeholder name, email or property' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ['All', 'Buyer', 'Seller'], description: 'Filter by stakeholder type' })
  @IsOptional()
  @IsString()
  type?: string;
}
