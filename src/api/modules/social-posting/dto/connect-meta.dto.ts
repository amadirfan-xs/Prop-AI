import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';

export class ConnectMetaDto {
  @ApiProperty({ description: 'OAuth authorization code from Meta' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  code: string;

  @ApiProperty({ description: 'Frontend callback URI used in OAuth flow' })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @MaxLength(2000)
  redirectUri: string;
}
