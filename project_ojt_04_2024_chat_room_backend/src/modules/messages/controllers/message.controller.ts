import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import MessageService from '../services/message.service';
import { MessageResponse } from '../responses/message.response';
import { QueryRequest } from 'src/common/queryRequest';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { ENDPOINT } from 'src/common/endpoint';
import { RequestGlobal } from 'src/common/requestGlobal';

@Controller(ENDPOINT.MESSAGES.BASE)
class MessageController {
  constructor(private readonly messageService: MessageService) {}

  /**
   *
   * @param query {
   * @param sort {FindOptionsOrderValue} The value to order
   * @param limit {number} the value to limit
   * @param page {number} the value to get count page
   * @param search {string} the value to search
   * @param roomId {number} The id of rooms entity
   * }
   * @param roomId
   * @param req
   * @returns Promise[]
   * describe : Get all data from message with roomId and contact users table and get user data in first message if subsequent messages are the same user
   */
  @UseGuards(AuthGuard)
  @Get(':roomId')
  async findAllByRoom(
    @Query() query: QueryRequest,
    @Param('roomId') roomId: number,
    @Req() req: RequestGlobal,
  ): Promise<MessageResponse[]> {
    return await this.messageService.findAllByRoom(query, roomId, req.user.id);
  }
}
export default MessageController;
