import {
  BadGatewayException,
  Logger,
  OnModuleInit,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import MessageService from '../services/message.service';
import { MessageRequestCreate } from '../requests/message.request';
import { MessageResponse } from '../responses/message.response';
import { UserInRoomResponse } from 'src/modules/user-in-room/responses/userInRoom.response';
import { ENDPOINT } from 'src/common/endpoint';
import { RequestGlobal } from 'src/common/requestGlobal';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
const logger = new Logger('MessageGateway');
@WebSocketGateway({ cors: { origin: '*' } })
class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  constructor(private readonly messageService: MessageService) {}

  @WebSocketServer()
  server: Server;

  /**
   * init socket server
   */
  async onModuleInit(): Promise<void> {
    logger.log('WebSocket gateway message initialized');
  }

  /**
   *
   * @param socket :Socket
   * describe:connection to socket
   */
  async handleConnection(socket: Socket): Promise<void> {
    try {
      logger.log(`Client message connected: ${socket.id}`);
    } catch (error) {
      this.disconnect(socket);
    }
  }

  /**
   *
   * @param socket
   * @param userId
   *
   * describe:join all room for user to send event
   */
  @SubscribeMessage(ENDPOINT.SOCKET.CONNECTION)
  async connect(socket: Socket, userId: number): Promise<void> {
    try {
      logger.log(`Client message connected: helo ${socket.id}`);

      const resultUserInRooms: UserInRoomResponse[] =
        await this.messageService.findAllRoomByUser(Number(userId));

      const result = resultUserInRooms.map((userInRoom: UserInRoomResponse) => {
        return `room_${userInRoom.roomId}`;
      });
      socket.join(`notice_${userId}`);

      socket.join(result);
    } catch (error) {
      this.disconnect(socket);
    }
  }

  /**
   *
   * @param socket
   * describe:disconnect server socket when offline
   */
  async handleDisconnect(socket: Socket): Promise<void> {
    this.disconnect(socket);
  }

  /**
   *
   * @param socket
   * describe:disconnect server socket when error
   */
  private disconnect(socket: Socket) {
    socket?.emit('Error', new BadGatewayException('Message'));
    socket?.disconnect();
  }

  /**
   * @async
   * @gateway
   * @param socket event socket
   * @param messageData {
   *    roomId: the id of room entity
   *    userId: the id of user entity
   *    content : message content
   *    tagName?:[]number ,
   * }
   * @returns {number} status
   *
   * @emits {
   * roomId:number
   * tagName:[]number
   * }
   *
   * describe:connecting to address socket server createMessage and emit data to all client
   *    */
  @UseGuards(AuthGuard)
  @SubscribeMessage(ENDPOINT.SOCKET.CREATE_MESSAGE)
  async createMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() messageData: MessageRequestCreate,
    @Req() req: RequestGlobal,
  ): Promise<MessageResponse> {
    try {
      const result: MessageResponse = await this.messageService.createMessage({
        ...messageData,
        userId: req.user.id,
      });

      const findOneMessage: MessageResponse = await this.messageService.findOne(
        result.message.id,
      );

      if (messageData.tagName?.length > 0) {
        messageData.tagName.map((item: any) => {
          this.server.to(`notice_${item.userId}`).emit(ENDPOINT.SOCKET.NOTICE, {
            dataCreateNotice: result.notice,
          });
        });
      }

      this.server
        .to(`room_${findOneMessage.roomId}`)
        .emit(ENDPOINT.SOCKET.MESSAGES, {
          message: findOneMessage,
        });

      return result;
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage(ENDPOINT.SOCKET.JOINING_ROOM)
  async joiningRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dataRoom: MessageRequestCreate,
  ): Promise<void> {
    try {
      this.server
        .to(`room_${dataRoom.roomId}`)
        .emit(ENDPOINT.SOCKET.JOINING_ROOM, {
          data: {
            roomId: dataRoom.roomId,
            userId: dataRoom.userId,
          },
        });
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage(ENDPOINT.SOCKET.LEAVING_ROOM)
  async leavingRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() dataRoom: MessageRequestCreate,
  ): Promise<void> {
    try {
      this.server
        .to(`room_${dataRoom.roomId}`)
        .emit(ENDPOINT.SOCKET.LEAVING_ROOM, {
          data: {
            roomId: dataRoom.roomId,
            userId: dataRoom.userId,
          },
        });
    } catch (error) {
      throw error;
    }
  }
}

export default MessageGateway;
