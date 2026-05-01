import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import * as express from 'express';
import { PropertyService } from '../services/property.service';
import { SubmitPropertyInquiryDto } from '../dto/submit-property-inquiry.dto';

@ApiTags('Public Property')
@Controller('api/public/property')
export class PublicPropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @ApiOperation({ summary: 'Track QR scan and redirect to property page' })
  @Get(':id/scan')
  async trackScan(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: express.Request,
    @Res() res: express.Response,
  ) {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';    
    this.propertyService.recordQrScan(id, ip.split(',')[0].trim());
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    const redirectUrl = `${frontendUrl}/publicView/property/${id}`;

    return res.redirect(redirectUrl);
  }

  @ApiOperation({ summary: 'Get public property details by id' })
  @Get(':id')
  async getPublicProperty(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.propertyService.getPublicPropertyById(id);
  }

  @ApiOperation({ summary: 'Submit a lead inquiry for a property' })
  @Post(':id/inquiry')
  async submitInquiry(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SubmitPropertyInquiryDto,
  ) {
    return this.propertyService.submitInquiry(id, dto);
  }
}
