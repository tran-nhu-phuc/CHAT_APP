import { Request } from 'express';
import { UserResponse } from 'src/modules/users/response/user.response';
export interface RequestGlobal extends Request {
  user?: UserResponse;
  roomId?: number;
}
