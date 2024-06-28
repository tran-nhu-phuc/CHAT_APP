import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserInRoomService from './services/userInRoom.service';
import UserInRoomRepository from './repositories/userInRoom.repository';
import { Room } from '../rooms/entities/room.entity';
import { User } from '../users/entities/user.entity';
import { UserInRoom } from './entities/user-in-room.entity';
import RoomRepository from '../rooms/repositories/room.repository';
import UserInRoomController from './controllers/userInRoom.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserInRoom, Room, User])],
  providers: [UserInRoomService, RoomRepository, UserInRoomRepository],
  controllers: [UserInRoomController],
  exports: [UserInRoomRepository, UserInRoomService],
})
export class UserInRoomModule {}
