import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { v2 as cloudinary } from 'cloudinary';
import { diskStorage } from 'multer';
export const multerConfig = async (): Promise<MulterOptions> => {
  return {
    storage: diskStorage({}),
    limits: {
      files: 1,
      fileSize: 1024 * 1024 * 10,
    },
  };
};

export const cloudinaryConfig = async () => {
  cloudinary.config({
    cloud_name: `${process.env.CLOUDINARY_NAME || 'dv9tkz5pa'}`,
    api_key: `${process.env.CLOUDINARY_API_KEY || '674178638899189'}`,
    api_secret: `${
      process.env.CLOUDINARY_API_SECRETKEY || 'cKcMQXVogDxvdiOSjXJP_96Wkdo'
    }`,
  });
};
