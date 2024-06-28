import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileService } from './uploadImage.service';
import { UploadController } from './uploadImage.controller';
import { cloudinaryConfig, multerConfig } from 'src/@config/uploadFile.config';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: multerConfig,
    }),
  ],
  controllers: [UploadController],
  providers: [FileService],
})
export class UploadModule {
  constructor() {
    cloudinaryConfig();
  }
}
