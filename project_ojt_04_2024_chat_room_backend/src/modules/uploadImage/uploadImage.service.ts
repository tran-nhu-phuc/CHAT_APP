import { Injectable, BadRequestException } from '@nestjs/common';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';

@Injectable()
export class FileService {
  async uploadFile(file: any, nameFolder?: string): Promise<string> {
    try {
      const result: UploadApiResponse = await cloudinary.uploader.upload(
        file.path,
        {
          folder: nameFolder ?? 'chat-app',
        },
      );
      return result.secure_url;
    } catch (error) {
      throw new BadRequestException('Failed to upload file');
    }
  }
}
