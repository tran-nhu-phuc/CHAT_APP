import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { IRoomUpdate } from '../types/room.type';

export class RoomRequest {
  @IsNumber()
  creatorId: number;

  @IsString()
  lastMessageId: number;

  @IsString()
  name: string;
}

export class RoomCreateRequest {
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @IsNotEmpty()
  membersId: number[];
}

export class RoomUpdateRequest {
  @IsNotEmpty()
  @IsNumber()
  roomId: number;

  @Length(0, 255)
  name?: string;

  @IsNotEmpty()
  members: IRoomUpdate[];
}
