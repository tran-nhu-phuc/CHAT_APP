import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import MessageController from './controllers/message.controller';
import MessageService from './services/message.service';
import MessageRepository from './repositories/message.repository';
import { RoomModule } from '../rooms/room.module';
import MessageGateway from './gateways/message.gateway';
import { User } from '../users/entities/user.entity';
import { Room } from '../rooms/entities/room.entity';
import { NotificationModule } from '../notifications/notification.module';
import { UserInRoomModule } from '../user-in-room/userInRoom.module';

@Module({
  imports: [
    UserInRoomModule,
    NotificationModule,
    RoomModule,
    TypeOrmModule.forFeature([Message, User, Room]),
  ],
  controllers: [MessageController],
  providers: [MessageGateway, MessageService, MessageRepository],
})
export class MessageModule {}
