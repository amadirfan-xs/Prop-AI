import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UploadPurchaseContractDto {
  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description:
      'Optional multipart file field; upload a PDF file when not using htmlContent.',
  })
  @IsOptional()
  file?: unknown;

  @ApiPropertyOptional({
    description:
      'HTML content from editor. If provided, backend converts it to PDF and stores PDF in S3.',
    type: String,
  })
  @IsOptional()
  @IsString()
  htmlContent?: string;

  @ApiPropertyOptional({
    description: 'If true and latest version is HTML, backend updates the existing record instead of creating a new one.',
    type: Boolean,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  allowUpdateLatest?: boolean;

  @ApiPropertyOptional({
    description: 'If true, backend converts HTML to PDF and uploads it to S3. Default is false for HTML sources to speed up saving.',
    type: Boolean,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  generatePdf?: boolean;
}
