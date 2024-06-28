import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../messages/entities/message.entity';
import { File } from './entities/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, File])],
  controllers: [],
  providers: [],
  exports: [],
})
export class FileModule {}
