import { IsBoolean, IsString, MaxLength, IsNotEmpty, IsOptional, IsNumber, IsUrl } from 'class-validator';

export class UpgradeOrganizationDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  taxId: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  headquarters: string;

  @IsOptional()
  @IsString()
  privacyPolicy: string;

  @IsOptional()
  @IsString()
  @MaxLength(150000)
  companyDescription: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  plan: string;

  @IsNotEmpty()
  @IsBoolean()
  isAuthorizedSigner: boolean;

  // Contact Info
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  contactName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  contactEmail: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  contactPhone: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  contactJobTitle: string;

  // Capacity Info
  @IsOptional()
  @IsNumber()
  numAgents: number;

  @IsOptional()
  @IsNumber()
  numListings: number;

  // Branding Info
  @IsOptional()
  @IsString()
  logoUrl: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  primaryColor: string;

  @IsOptional()
  @IsUrl()
  websiteUrl: string;

  // Notes
  @IsOptional()
  @IsString()
  additionalNotes: string;
}
