export interface IRoomCreate {
  creatorId: number;
  name: string;
  createdAt: Date;
}

export interface IRoomUpdate {
  id: number;
  status: string;
}
