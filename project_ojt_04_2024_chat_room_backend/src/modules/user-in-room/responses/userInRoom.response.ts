import { RoomResponse } from 'src/modules/rooms/responses/room.response';
import { UserResponse } from 'src/modules/users/response/user.response';
export interface IMemberResponse {
  id?: number;
  userId: number;
  roomId: number;
}

export interface IMemberSocketResponse {
  roomId: number;
  membersId: number[];
}

export interface IMemberResponse {
  id?: number;
  userId: number;
  roomId: number;
}
export interface UserInRoomResponse {
  id?: number;
  roomId?: number;
  userId?: number;
  user?: UserResponse;
  room?: RoomResponse;
  status?: number;
}
