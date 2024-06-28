export interface IRoom {
  id: number;
  name: string;
  creatorId: number;
  lastMessageId: number;
  isDelete?: number;
  createdAt?: string;
  updatedAt?: string;
  members: unknown[];
}
