/**
 * Response when create Room
 * @key id: number
 * @key creatorId: number
 * @key lastMessageId: number - have or not
 * @key name: string
 * @key isDelete: number - have or not
 * @key createdAt: Date - have or not
 * @key updatedAt: Date - have or not
 */
export interface IRoomCreateResponse {
  id: number;
  creatorId: number;
  lastMessageId?: number;
  name: string;
  isDelete?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
