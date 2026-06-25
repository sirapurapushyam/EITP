import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/user.model.js';
import {
  uploadBufferToCloudinary,
  deleteFromCloudinary
} from '../utils/fileUpload.js';
import { CLOUDINARY_FOLDERS } from '../constants/cloudinaryFolders.js';

export const uploadProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Profile image is required');
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // delete previous profile image
  if (user.profileImage?.publicId) {
    await deleteFromCloudinary(
      user.profileImage.publicId,
      'image'
    );
  }

  const uploadedFile = await uploadBufferToCloudinary(
    req.file.buffer,
    CLOUDINARY_FOLDERS.PROFILE_IMAGES
  );

  user.profileImage = {
    url: uploadedFile.url,
    publicId: uploadedFile.publicId
  };

  await user.save();

  res.json({
    success: true,
    message: 'Profile image uploaded successfully',
    data: user.profileImage
  });
});

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Resume file is required');
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // delete previous resume
  if (user.resume?.publicId) {
    await deleteFromCloudinary(
      user.resume.publicId,
      'raw'
    );
  }

  const uploadedFile = await uploadBufferToCloudinary(
    req.file.buffer,
    CLOUDINARY_FOLDERS.RESUMES,
    {
      resource_type: 'raw'
    }
  );

  user.resume = {
    url: uploadedFile.url,
    publicId: uploadedFile.publicId
  };

  await user.save();

  res.json({
    success: true,
    message: 'Resume uploaded successfully',
    data: user.resume
  });
});