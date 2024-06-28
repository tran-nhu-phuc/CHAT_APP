import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ENDPOINT } from 'src/common/endpoint';
import { NotificationResponse } from '../reponses/notification.reponses';
import NotificationService from '../services/notification.service';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { RequestGlobal } from 'src/common/requestGlobal';

/**
 * Controller handling notification endpoints.
 */

@Controller(ENDPOINT.NOTIFICATION)
class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * Get all notification by userId.
   * @guard use to check if user can access
   * @query use for putting limit,page of pagination
   * @req get userId
   * @return [] has all information for notification of user.
   */
  @UseGuards(AuthGuard)
  @Get()
  async getAllNotification(
    @Query() query: Record<string, number>,
    @Req() req: RequestGlobal,
  ): Promise<NotificationResponse[]> {
    return await this.notificationService.getAllByUser(req.user.id, query);
  }

  /**
   * Update notification.
   * @param notificationId
   * @return notification of user after update.
   */
  @Patch(':id')
  async notificationUpdate(@Param('id') id: number): Promise<number> {
    return await this.notificationService.updateNotification(id);
  }
}

export default NotificationController;
