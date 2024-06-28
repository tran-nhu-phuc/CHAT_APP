import { Module } from '@nestjs/common';
import RoomRepository from './repositories/room.repository';
import RoomService from './services/room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { UserInRoomModule } from '../user-in-room/userInRoom.module';
import RoomController from './controllers/room.controller';
import RoomGateway from './gateways/room.gateway';

@Module({
  imports: [UserInRoomModule, TypeOrmModule.forFeature([Room])],
  providers: [RoomGateway, RoomService, RoomRepository],
  controllers: [RoomController],
  exports: [RoomRepository],
})
export class RoomModule {}
