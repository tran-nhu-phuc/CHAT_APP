import { IsNumber, IsString } from 'class-validator';

export class MessageRequestCreate {
  @IsNumber()
  userId?: number;

  @IsNumber()
  roomId?: number;

  @IsString()
  content?: string;

  @IsNumber()
  tagName?: number[];
}
