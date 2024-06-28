import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import RoomService from '../services/room.service';
import { ENDPOINT } from 'src/common/endpoint';
import { RoomResponse } from '../responses/room.response';
import { QueryRequest } from 'src/common/queryRequest';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/role.guard';
import { Roles } from 'src/modules/auth/role.decorator';
import { UserRoles } from 'src/modules/users/enums/user.enum';

@Controller(ENDPOINT.ROOMS.BASE)
class RoomController {
  constructor(private readonly roomService: RoomService) {}

  /**
   * 
    @param sort — The value to order
    @param limit — the value to limit
    @param page — the value to get count page
    @param search — the value to search
    @returns
    Promise[] 
    describe : get all room
   */
  // @UseGuards(AuthGuard, RolesGuard)
  @Get()
  async getAll(@Query() query: QueryRequest): Promise<RoomResponse[]> {
    return await this.roomService.getAll(query);
  }

  /**
   * Soft deletes room
   *
   * @param params - id of the room
   */
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRoles.GROUP_LEADER, UserRoles.ADMIN)
  @Patch()
  async delete(@Param() params, @Res() res) {
    const roomId: number = params.id;
    const result = await this.roomService.delete(roomId);
    if (result) res.status(200).json({ msg: 'Room deleted successfully' });
  }
}
export default RoomController;
