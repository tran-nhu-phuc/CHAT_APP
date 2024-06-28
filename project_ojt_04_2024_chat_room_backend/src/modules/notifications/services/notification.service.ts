import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { NotificationResponse } from '../reponses/notification.reponses';
import NotificationRepository from '../repositories/notification.repository';

const logger = new Logger('Message Service');
@Injectable()
export default class NotificationService {
  constructor(private notificationRepository: NotificationRepository) {}
  /**
   * Get all information of one user by ID for notification
   * @param userId - UserId who are login
   * @param query - limit and page for pagination. if given no data, it is limit = 20 and page = 1.
   * @return give repository this paramNotice to get data by
   * @throws error if the userId/query is missing or invalid.
   */
  async getAllByUser(
    userId: number,
    query: Record<string, number>,
  ): Promise<NotificationResponse[]> {
    try {
      const limit = query.limit || 20;
      const page = query.page || 1;
      const offset = (page - 1) * limit;
      const paramNotice = {
        where: { userId },
        relations: {
          message: {
            user: true,
            rooms: true,
          },
        },
        select: {
          message: {
            content: true,
            createdAt: true,
            roomId: true,
            user: {
              firstName: true,
              lastName: true,
              avatar: true,
            },
            rooms: {
              name: true,
            },
          },
        },
        order: {
          createdAt: 'DESC',
        },
        take: limit,
        skip: offset,
      };
      return await this.notificationRepository.getAllByUser(paramNotice);
    } catch (error) {
      logger.error(error);
      throw new Error(error);
    }
  }

  /**
   * Get one information by ID
   * @param Id - notificationId
   * @return a notification get by paramNotice
   * @throws error if the notificationId/query is missing or invalid.
   */
  async updateNotification(id: number): Promise<number> {
    try {
      const paramNotice = {
        where: { id },
      };
      const noticeAfterFind =
        await this.notificationRepository.getOneById(paramNotice);
      if (!noticeAfterFind) {
        throw new BadRequestException();
      }
      const updatedNotice =
        await this.notificationRepository.updateNotification(id, { status: 1 });
      if (updatedNotice[0] !== 0) {
        return HttpStatus.OK;
      }
      return HttpStatus.BAD_REQUEST;
    } catch (error) {
      logger.error(error);
      throw new Error(error);
    }
  }
}
