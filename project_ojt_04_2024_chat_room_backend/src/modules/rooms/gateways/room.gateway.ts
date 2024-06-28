import { Logger, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import RoomService from '../services/room.service';
import { RoomCreateRequest, RoomUpdateRequest } from '../requests/room.request';
import {
  CONSTANT_SOCKET,
  CONSTANT_SOCKET_PATH,
} from 'src/common/constantSocket.common';
import { Roles } from 'src/modules/auth/role.decorator';
import { UserRoles } from 'src/modules/users/enums/user.enum';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/role.guard';
import { IRoomUpdate } from '../types/room.type';
import UserInRoomService from 'src/modules/user-in-room/services/userInRoom.service';

const logger = new Logger('Room Gateway');

@WebSocketGateway({
  namespace: CONSTANT_SOCKET_PATH.ROOM,
  cors: { origin: 'http://localhost:5173' },
})
class RoomGateway {
  constructor(
    private readonly roomService: RoomService,
    private userInRoomService: UserInRoomService,
  ) {}

  @WebSocketServer()
  server: Server;

  /**
   * Function disconnect socket
   *
   * @param socket
   *
   * @emit - errors
   */
  private error(client: Socket, error) {
    if (error instanceof UnauthorizedException) {
      client.emit(CONSTANT_SOCKET.ERROR_AUTH, error);
    }
    client.emit(CONSTANT_SOCKET.ERROR_DISCONNECT, error);
    logger.log('Error socket');
  }

  /**
   * Add Room
   *
   * @param socket - Socket
   * @param data - RoomCreateRequest[]
   *
   * @emit - (CONSTANT_SOCKET.CHECK_JOIN_ROOM, IMemberSocketRequest)
   */
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.GROUP_LEADER)
  @SubscribeMessage(CONSTANT_SOCKET.CREATE_ROOM)
  async create(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: RoomCreateRequest[],
    @Req() req,
  ) {
    try {
      const id = req.user.id;
      const result = await this.roomService.create(data, id);
      this.server.emit(CONSTANT_SOCKET.CHECK_JOIN_ROOM, result);
    } catch (error) {
      logger.error(error);
      this.error(client, error);
    }
  }

  /**
   *
   * @param socket - Socket
   * @param data - RoomUpdateRequest
   *
   * @emit - (checkUpdateRoom, name: string)
   */
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.GROUP_LEADER)
  @SubscribeMessage(CONSTANT_SOCKET.EDIT_ROOM)
  async update(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: RoomUpdateRequest,
    @Req() req,
  ) {
    try {
      const id = req.user.id;
      const role = req.user.role;
      // Handle data to add members if has already
      const arrayAddMembers = data.members.filter(
        (members: IRoomUpdate) => members.status === 'add',
      );
      if (arrayAddMembers.length > 0) {
        const result = arrayAddMembers.map((item: IRoomUpdate) => item.id);
        const dataAddMembers = { roomId: data.roomId, membersId: result };
        const resultData = await this.userInRoomService.addMembers(
          dataAddMembers,
          id,
          role,
        );
        this.server.emit(CONSTANT_SOCKET.CHECK_JOIN_ROOM, resultData);
      }

      // Handle data to remove members if has already
      const arrayRemoveMembers = data.members.filter(
        (members: IRoomUpdate) => members.status === 'remove',
      );
      if (arrayRemoveMembers.length > 0) {
        const result = arrayRemoveMembers.map((item: IRoomUpdate) => item.id);
        const dataRemoveMembers = { roomId: data.roomId, membersId: result };
        const checkResult = await this.userInRoomService.removeMembers(
          dataRemoveMembers,
          id,
          role,
        );
        if (checkResult) {
          this.server.emit(CONSTANT_SOCKET.CHECK_LEAVE_ROOM, dataRemoveMembers);
        }
      }

      // Update room
      if (data.name) {
        const resultUpdate = await this.roomService.update(
          data.name,
          data.roomId,
          id,
          role,
        );

        // Emit socket edit room to client
        if (resultUpdate) {
          this.server
            .to(`room_${data.roomId}`)
            .emit(CONSTANT_SOCKET.CHECK_UPDATE_ROOM, data.name);
        }
      }
    } catch (error) {
      logger.error(error);
      this.error(client, error);
    }
  }
}

export default RoomGateway;
