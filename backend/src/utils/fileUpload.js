import { cloudinary } from '../config/cloudinary.js';
import { ApiError } from './apiError.js';

export async function uploadBufferToCloudinary(buffer, folder, options = {}) {
  if (!buffer) throw new ApiError(400, 'File buffer is required');

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto', ...options },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id, fileType: result.resource_type });
      }
    );

    uploadStream.end(buffer);
  });
}

export async function deleteFromCloudinary(publicId, resourceType = 'image') {
  if (!publicId) return null;
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}
