import { Controller, Get, Patch, Param, ParseIntPipe, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationService } from '../services/notification.service';
import { AccessTokenAuthGuard } from '@/common/guards/auth/auth.guard';
import { Request } from 'express';

type AuthenticatedRequest = Request & {
  user: {
    id: number;
  };
};

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(AccessTokenAuthGuard)
@Controller('api/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user notifications' })
  getMyNotifications(
    @Req() req: AuthenticatedRequest,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const userId = Number(req.user.id);
    return this.notificationService.getMyNotifications(userId, page, limit);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllAsRead(@Req() req: AuthenticatedRequest) {
    const userId = Number(req.user.id);
    return this.notificationService.markAllAsRead(userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  markAsRead(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = Number(req.user.id);
    return this.notificationService.markAsRead(id, userId);
  }
}
