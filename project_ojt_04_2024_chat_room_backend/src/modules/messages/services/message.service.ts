import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import MessageRepository from '../repositories/message.repository';
import RoomRepository from 'src/modules/rooms/repositories/room.repository';
import {
  EntityManager,
  LessThanOrEqual,
  Like,
  MoreThanOrEqual,
  QueryRunner,
} from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { MessageRequestCreate } from '../requests/message.request';
import { MessageResponse } from '../responses/message.response';
import UserInRoomRepository from 'src/modules/user-in-room/repositories/userInRoom.repository';
import { QueryRequest } from 'src/common/queryRequest';
import { UserInRoomResponse } from 'src/modules/user-in-room/responses/userInRoom.response';
import NotificationRepository from 'src/modules/notifications/repositories/notification.repository';
const logger = new Logger('Message Service');
@Injectable()
class MessageService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly messageRepository: MessageRepository,
    private readonly roomRepository: RoomRepository,
    private readonly noticeRepository: NotificationRepository,
    private readonly userInRoomRepository: UserInRoomRepository,
  ) {}

  /**find all message
   * @async:
   * @query{
   * @param query{
   * @param sort {FindOptionsOrderValue} The value to order
   * @param limit {number} the value to limit
   * @param page {number} the value to get count page
   * @param search {string} the value to search
   * @param roomId {number} The id of rooms entity
   * }
   *
   *}
   * @returns Promise []
   *
   * describe : Get all data from message with roomId and contact users table and get user data in first message if subsequent messages are the same user
   */

  async findAllByRoom(
    query: QueryRequest,
    roomId: number,
    userId: number,
  ): Promise<MessageResponse[]> {
    try {
      const checkUserInRoom =
        await this.userInRoomRepository.findOneByRoomByUser(userId, roomId);

      if (!checkUserInRoom) {
        throw new UnauthorizedException();
      }

      let dataMessageQuery = undefined;

      const sort = query.sort || 'DESC';

      const limit = query.limit || 20;

      const search = query.search || '';

      dataMessageQuery = {
        where: {
          roomId,
          content: Like(`%${search.toLocaleLowerCase()}%`),
        },

        take: limit,

        order: {
          createdAt: sort,
        },
      };

      if (query.messageId && (query.up || query.down)) {
        const findOneMessage = await this.messageRepository.findOne({
          where: { id: query.messageId },
        });

        if (!findOneMessage) {
          throw new BadRequestException();
        }

        dataMessageQuery = {
          where: {
            roomId,
            createdAt: query.up
              ? MoreThanOrEqual(findOneMessage.createdAt)
              : LessThanOrEqual(findOneMessage.createdAt),
          },

          take: limit,

          order: {
            createdAt: query.up ? 'ASC' : 'DESC',
          },
        };
      }

      return await this.messageRepository.findAllByRoom({
        ...dataMessageQuery,

        relations: {
          user: true,
        },

        select: {
          user: {
            firstName: true,
            lastName: true,
            id: true,
            createdAt: true,
            avatar: true,
            role: true,
          },
        },
      });
    } catch (error) {
      console.log(error);

      logger.error(error.message);
      throw new Error(error.message);
    }
  }

  /**
   *
   * @returns Promise{}
   * describe:find one message for socket event
   * @param id:number
   * @returns Promise{}
   *
   *
   * describe:find one message to event chat
   */
  async findOne(id: number): Promise<MessageResponse> {
    try {
      const dataMessageQuery = {
        where: { id },
        relations: { user: true },
        select: {
          user: {
            firstName: true,
            lastName: true,
            id: true,
            createdAt: true,
            avatar: true,
            role: true,
          },
        },
      };
      return await this.messageRepository.findOne(dataMessageQuery);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**Create message
   * @async:
   * @param  messageData :{
   *  roomId: the id of room entity
   *  userId: the id of user entity
   *  content : message content
   *  tagName?:[]number ,
   * }
   *
   *
   * describe: create message -> update room -> create notice
   *
   * @returns Promise {number}:status
   */
  async createMessage(
    messageData: MessageRequestCreate,
  ): Promise<MessageResponse> {
    let queryRunner: QueryRunner;
    let responseData: MessageResponse = {};
    let resultNotice = [];

    try {
      queryRunner = this.entityManager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const checkUserInRoom =
        await this.userInRoomRepository.findOneByRoomByUser(
          messageData.userId,
          messageData.roomId,
        );

      if (!checkUserInRoom) {
        await queryRunner.rollbackTransaction();
        throw new UnauthorizedException();
      }

      const resultNewMessage = await this.messageRepository.createMessage({
        roomId: messageData.roomId,
        userId: messageData.userId,
        content: messageData.content,
      });

      const resultUpdateRoom = await this.roomRepository.updateRoom(
        messageData.roomId,
        { lastMessageId: resultNewMessage.id },
      );

      if (!resultNewMessage || resultUpdateRoom[0] === 0) {
        await queryRunner.rollbackTransaction();
        throw new BadRequestException();
      }

      if (messageData.tagName.length > 0) {
        const dataNotice = messageData.tagName.map((item: any) => {
          return {
            userId: item.userId,
            messageId: resultNewMessage.id,
            status: item.status,
          };
        });
        resultNotice =
          await this.noticeRepository.createNotification(dataNotice);
      }

      await queryRunner.commitTransaction();

      responseData = {
        message: resultNewMessage,
        status: HttpStatus.OK,
        notice: resultNotice,
      };
    } catch (error) {
      console.log(error);

      await queryRunner.rollbackTransaction();

      logger.error(error.message);

      responseData = {
        message: error?.message,
        status: error?.status,
        notice: [],
      };

      throw new Error(error.message);
    } finally {
      await queryRunner.release();

      return responseData;
    }
  }

  /**
   *
   * @param userId
   * @returns Promise[]
   * describe: find all room for user  to join socket
   * describe find all list room by user
   */
  async findAllRoomByUser(userId: number): Promise<UserInRoomResponse[]> {
    try {
      const dataUserInRoomQuery = {
        where: {
          userId,
        },
        select: {
          user: {
            firstName: true,
            lastName: true,
            id: true,
            createdAt: true,
            avatar: true,
            role: true,
          },
        },
      };
      return await this.userInRoomRepository.getAllByUser(dataUserInRoomQuery);
    } catch (error) {
      logger.error(error.message);
      throw new Error(error.message);
    }
  }
}
export default MessageService;
