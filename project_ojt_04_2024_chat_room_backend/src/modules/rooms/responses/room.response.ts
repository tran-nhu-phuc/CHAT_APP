import { MessageResponse } from 'src/modules/messages/responses/message.response';
import { UserResponse } from 'src/modules/users/response/user.response';

export interface RoomResponse {
  id?: number;
  creator?: UserResponse;
  message?: MessageResponse;
  name?: string;
  isDelete?: number;
  createdAt?: Date;
  updatedAt?: Date;
  status?: number;
}

export interface RoomType {
  id?: number;
  creatorId?: number;
  lastMessageId?: number;
  name?: string;
  isDelete?: number;
  createdAt?: Date;
  updatedAt?: Date;
  members?: unknown[];
}
