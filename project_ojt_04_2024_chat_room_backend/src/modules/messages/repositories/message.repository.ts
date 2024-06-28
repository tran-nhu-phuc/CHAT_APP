import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { MessageRequestCreate } from '../requests/message.request';
import { Message } from '../entities/message.entity';
import { MessageResponse } from '../responses/message.response';
import { SelectData } from 'src/common/param';
const logger = new Logger('Message Repository');

class MessageRepository {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  /**
   *
   * @param messageDataQuery {
   * ...query
   * }
   * @returns Promise[]
   * describe:find all message for room
   */
  async findAllByRoom(
    messageDataQuery: SelectData,
  ): Promise<MessageResponse[]> {
    try {
      return await this.messageRepository.find(messageDataQuery);
    } catch (error) {
      logger.error(error.message);
      throw new InternalServerErrorException(error);
    }
  }

  /**
   *
   * @param messageDataQuery {
   * message.id
   * }
   * @returns Promise{}
   * describe:find one message for event socket
   */
  async findOne(messageDataQuery: SelectData): Promise<MessageResponse> {
    try {
      return await this.messageRepository.findOne(messageDataQuery);
    } catch (error) {
      logger.error(error.message);

      throw new InternalServerErrorException(error);
    }
  }

  /**
   *
   * @param newDataMessage {
   * ...newData
   * }
   * @returns Promise{}
   * describe:create new data for message
   */
  async createMessage(
    newDataMessage: MessageRequestCreate,
  ): Promise<MessageResponse> {
    try {
      return await this.messageRepository.save(newDataMessage);
    } catch (error) {
      logger.error(error.message);
      throw new InternalServerErrorException(error);
    }
  }
}

export default MessageRepository;
