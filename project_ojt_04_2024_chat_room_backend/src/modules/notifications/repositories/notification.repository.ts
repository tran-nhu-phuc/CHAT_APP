import { Notice } from '../entities/notification.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationResponse } from '../reponses/notification.reponses';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { SelectData } from 'src/common/param';

const logger = new Logger('Message Service');
export default class NotificationRepository {
  constructor(
    @InjectRepository(Notice)
    private notificationRepository: Repository<Notice>,
  ) {}

  /**
   * Get by param from notification service
   * @param paramNotice describe how to get data
   * @return notification createAt,roomId,roomName,sender Name,sender avatar,content of message,messageId,
   * @throws error if paramNotice is missing or invalid.
   */
  async getAllByUser(paramNotice: SelectData): Promise<NotificationResponse[]> {
    try {
      return await this.notificationRepository.find(paramNotice);
    } catch (error) {
      logger.error(error);
      throw new Error(error);
    }
  }

  /**
   * Get one notification by param from notification service
   * @param paramNotice describe how to get data
   * @return all data of one notification,
   * @throws error if paramNotice is missing or invalid.
   */
  async getOneById(paramNotice: SelectData): Promise<NotificationResponse> {
    try {
      return await this.notificationRepository.findOne(paramNotice);
    } catch (error) {
      logger.error(error);
      throw new Error(error);
    }
  }

  /**
   * update one notification by param from notification service
   * @param id notification id
   * @param data notification data
   * @return all data of notification after update,
   * @throws error if id/data is missing or invalid.
   */
  async updateNotification(id: number, data: NotificationResponse) {
    try {
      return await this.notificationRepository.update({ id }, { ...data });
    } catch (error) {
      logger.error(error);
      throw new Error(error);
    }
  }

  /**
   * create one notification by data from Message service
   * @param data notification data
   * @return save notification
   * @throws error if data is missing or invalid.
   */
  async createNotification(data: any): Promise<any> {
    try {
      return await this.notificationRepository.save(data);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
