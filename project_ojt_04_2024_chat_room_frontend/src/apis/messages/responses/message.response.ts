export interface MessageResponse {
  id?: number;
  content?: string;
  userId?: number;
  roomId?: number;
  user?: any;
  room?: unknown;
  isDelete?: number;
  createdAt?: Date;
  updatedAt?: Date;
  message?: any;
}
