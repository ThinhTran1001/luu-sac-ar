import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// 10MB per file (Render/proxy thường cho phép request body lớn hơn)
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (_req, _file) => {
    return {
      folder: 'luu-sac/products',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      resource_type: 'image',
    };
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 12, // imageUrl + thumbnail + tối đa 10 gallery
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype || !ALLOWED_MIMES.includes(file.mimetype)) {
      cb(new Error('Định dạng ảnh không hợp lệ. Chỉ chấp nhận: JPG, PNG, WebP.'));
      return;
    }
    cb(null, true);
  },
});

export class UploadService {
  static async delete(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  }
}
