import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Notice } from './entities/notification.entity';
import NotificationController from './controllers/notification.controller';
import NotificationService from './services/notification.service';
import NotificationRepository from './repositories/notification.repository';
import { Message } from '../messages/entities/message.entity';
import { Room } from '../rooms/entities/room.entity';
import { UserInRoom } from '../user-in-room/entities/user-in-room.entity';
import { File } from '../files/entities/file.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule,
    TypeOrmModule.forFeature([Notice, User, Message, Room, UserInRoom, File]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
  exports: [NotificationRepository],
})
export class NotificationModule {}
