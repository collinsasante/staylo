import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload a single image to Cloudinary
 * @param file - File object or buffer
 * @param folder - Cloudinary folder path (default: 'hostels')
 * @returns Promise with secure URL of uploaded image
 */
export const uploadImage = async (
  fileBuffer: Buffer,
  fileName: string,
  folder: string = 'hostels'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const publicId = `${timestamp}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\.[^/.]+$/, '')}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        public_id: publicId,
        resource_type: 'image',
        overwrite: false,
        transformation: [
          { width: 1920, crop: 'limit' }, // Limit max width to 1920px
          { quality: 'auto:good' }, // Auto quality optimization
          { fetch_format: 'auto' }, // Auto format (WebP for modern browsers)
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Upload failed - no result returned'));
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Upload multiple images to Cloudinary
 * @param files - Array of file buffers with names
 * @param folder - Cloudinary folder path (default: 'hostels')
 * @returns Promise with array of secure URLs
 */
export const uploadImages = async (
  files: Array<{ buffer: Buffer; name: string }>,
  folder: string = 'hostels'
): Promise<string[]> => {
  const uploadPromises = files.map((file) =>
    uploadImage(file.buffer, file.name, folder)
  );
  return Promise.all(uploadPromises);
};

/**
 * Delete an image from Cloudinary
 * @param imageUrl - Full Cloudinary URL or public_id
 */
export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract public_id from Cloudinary URL
    let publicId: string;

    if (imageUrl.includes('cloudinary.com')) {
      // Extract public_id from URL
      // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/hostels/image.jpg
      const urlParts = imageUrl.split('/upload/');
      if (urlParts.length > 1) {
        // Get everything after '/upload/' and remove version
        const pathPart = urlParts[1].replace(/^v\d+\//, '');
        // Remove file extension
        publicId = pathPart.replace(/\.[^/.]+$/, '');
      } else {
        throw new Error('Invalid Cloudinary URL format');
      }
    } else {
      // Assume it's already a public_id
      publicId = imageUrl;
    }

    await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
    });
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param imageUrls - Array of Cloudinary URLs or public_ids
 */
export const deleteImages = async (imageUrls: string[]): Promise<void> => {
  const deletePromises = imageUrls.map((url) => deleteImage(url));
  await Promise.all(deletePromises);
};

/**
 * Get optimized image URL with transformations
 * @param publicId - Cloudinary public_id
 * @param width - Desired width
 * @param height - Desired height (optional)
 */
export const getOptimizedImageUrl = (
  publicId: string,
  width: number,
  height?: number
): string => {
  const transformation = height
    ? `w_${width},h_${height},c_fill,f_auto,q_auto:good`
    : `w_${width},c_limit,f_auto,q_auto:good`;

  return cloudinary.url(publicId, {
    transformation: transformation,
    secure: true,
  });
};
