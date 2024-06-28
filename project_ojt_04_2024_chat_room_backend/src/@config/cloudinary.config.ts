import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';

dotenv.config();

export const multerConfig = async (): Promise<MulterOptions> => {
  return {
    limits: {
      files: 10,
      fileSize: 1024 * 1024 * 10,
    },
  };
};

export const cloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
};
