import { Module } from '@nestjs/common';
import DatabaseModule from './@config/database.config';
import { RoomModule } from './modules/rooms/room.module';
import { MessageModule } from './modules/messages/message.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { FileModule } from './modules/files/file.module';
import { UserInRoomModule } from './modules/user-in-room/userInRoom.module';
import { UsersModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UploadModule } from './modules/uploadImage/uploadImage.module';

// Comment
@Module({
  imports: [
    DatabaseModule,
    RoomModule,
    UsersModule,
    UserInRoomModule,
    MessageModule,
    NotificationModule,
    FileModule,
    AuthModule,
    JwtModule,
    UsersModule,
    AuthModule,
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
