export interface NotificationIntf extends MessageForNoticeIntf {
  id: number;
  status: number;
  isDelete: number;
  messageId: number;
  message: MessageForNoticeIntf;
}
interface MessageForNoticeIntf {
  roomId: number;
  content: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    avatar: string;
  };
  rooms: {
    name: string;
  };
}
