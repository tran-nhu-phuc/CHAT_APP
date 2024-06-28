import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import UserInRoomService from '../services/userInRoom.service';
import { UserInRoomResponse } from '../responses/userInRoom.response';
import { ENDPOINT } from 'src/common/endpoint';
import { RequestGlobal } from 'src/common/requestGlobal';
import { QueryRequest } from 'src/common/queryRequest';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';

@Controller(ENDPOINT.USER_IN_ROOM.BASE)
class UserInRoomController {
  constructor(private readonly userInRoomService: UserInRoomService) {}

  /**
   * 
    @param limit — the value to limit
    @param page — the value to get count page
    @param search — the value to search
    @param roomId — the id value room entity
    @returns
    Promise [] 
    describe: get all value users in room with relationship room
  */
  @UseGuards(AuthGuard)
  @Get(`${ENDPOINT.USER_IN_ROOM.BY_ROOM}/:roomId`)
  async getAllMemberByRoom(
    @Query() query: QueryRequest,
    @Param('roomId') roomId: number,
  ): Promise<UserInRoomResponse[]> {
    return await this.userInRoomService.getAllUserByRoom(query, roomId);
  }

  /**
   *
   * @param query {
   * @param limit — the value to limit
   * @param page — the value to get count page
   * @param search — the value to search
   * @param userId
   * }
   * @returns Promise[]
   * describe:find all UserInRoom by userId
   */
  @UseGuards(AuthGuard)
  @Get(ENDPOINT.USER_IN_ROOM.BY_USER)
  async getAllByUser(
    @Query() query: QueryRequest,
    @Req() req: RequestGlobal,
  ): Promise<UserInRoomResponse[]> {
    return await this.userInRoomService.getAllByUser(query, req.user.id);
  }
}

export default UserInRoomController;
