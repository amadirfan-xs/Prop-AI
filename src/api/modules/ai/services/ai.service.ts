import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GenerateDescriptionDto } from '../dto/generate-description.dto';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly genAI: GoogleGenerativeAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_AI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async generatePropertyDescription(dto: GenerateDescriptionDto): Promise<string> {
    if (!this.genAI) {
      throw new InternalServerErrorException('AI Service not configured (Missing GOOGLE_AI_API_KEY)');
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' });

      const prompt = `
        You are a professional real estate copywriter. Write a compelling, luxurious, and engaging property description for a listing with the following details:
        
        Title: ${dto.title}
        Property Type: ${dto.propertyType}
        Beds: ${dto.beds}
        Baths: ${dto.baths}
        Area: ${dto.sqft} sqft
        Monthly Price: $${dto.price}
        Location: ${dto.city}
        Highlights: ${dto.highlights?.join(', ') || 'N/A'}

        The description should be around 150-200 words, use high-end vocabulary, and sound inviting to potential tenants or buyers. 
        Focus on the lifestyle and unique selling points.
        Format the output as a single cohesive paragraph. Do not include any headers or meta-talk.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text.trim();
    } catch (error: any) {
      this.logger.error(`AI Generation failed: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to generate description with AI');
    }
  }
}
