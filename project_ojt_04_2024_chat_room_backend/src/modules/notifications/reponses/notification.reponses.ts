/**
 * Interface for response for notification classes .
 */
export interface NotificationResponse {
  id?: number;
  messageId?: number;
  roomName?: string;
  userId?: number;
  createdAt?: Date;
  roomId?: number;
  content?: string;
  status?: number;
  type?: number;
}
