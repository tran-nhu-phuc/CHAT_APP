import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './uploadImage.service';
import { ENDPOINT } from 'src/common/endpoint';

@Controller()
export class UploadController {
  constructor(private readonly fileService: FileService) {}

  @Post(ENDPOINT.UPLOAD_AVATAR)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file): Promise<string> {
    return await this.fileService.uploadFile(file);
  }
}
