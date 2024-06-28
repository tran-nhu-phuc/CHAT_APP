import { IsNotEmpty, IsNumber } from 'class-validator';

/**
 * DTO Create members request
 */
export class CreateMembersRequest {
  @IsNotEmpty()
  membersId: number[];

  @IsNumber()
  @IsNotEmpty()
  roomId: number;
}

/**
 * DTO Remove members request
 */
export class RemoveMembersRequest {
  @IsNotEmpty()
  membersId: number[];

  @IsNumber()
  @IsNotEmpty()
  roomId: number;
}

export class UserInRoomRequest {
  @IsNumber()
  userId: number;

  @IsNumber()
  roomId: number;
}
