import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AiService } from '../services/ai.service';
import { GenerateDescriptionDto } from '../dto/generate-description.dto';
import { AccessTokenAuthGuard } from '@/common/guards/auth/auth.guard';

@ApiTags('AI')
@ApiBearerAuth('bearer')
@Controller('api/ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @ApiOperation({ summary: 'Generate property description using Gemini AI' })
  @Post('generate-description')
  @UseGuards(AccessTokenAuthGuard)
  async generateDescription(@Body() dto: GenerateDescriptionDto): Promise<{ description: string }> {
    const description = await this.aiService.generatePropertyDescription(dto);
    return { description };
  }

  @ApiOperation({ summary: 'List available AI models' })
  @Post('list-models')
  @UseGuards(AccessTokenAuthGuard)
  async listModels(): Promise<any> {
    return {
      suggested: 'gemini-3.1-flash-lite',
      available: [
        'gemini-3.1-pro-preview',
        'gemini-3-flash-preview',
        'gemini-3.1-flash-lite-preview',
        'nano-banana-pro-preview',
        'gemini-3.1-flash-live-preview'
      ]
    };
  }
}
