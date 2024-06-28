import { NotificationResponse } from 'src/modules/notifications/reponses/notification.reponses';
import { RoomResponse } from 'src/modules/rooms/responses/room.response';
import { UserResponse } from 'src/modules/users/response/user.response';

export interface MessageResponse {
  id?: number;
  userId?: number;
  roomId?: number;
  room?: RoomResponse;
  user?: UserResponse;
  content?: string;
  isDelete?: number;
  status?: number;
  message?: MessageResponse;
  error?: unknown;
  messageId?: number;
  createdAt?: Date;
  notice?: NotificationResponse[];
  updatedAt?: Date;
}
