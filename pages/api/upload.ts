import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import { uploadImages } from '../../lib/storage';
import { withCors, withErrorHandler } from '../../lib/middleware';
import { ApiResponse } from '../../types';

// Disable default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<{ urls: string[] }>>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed`,
    });
  }

  try {
    // Parse form data
    const form = formidable({
      maxFiles: 10,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    });

    const [fields, files] = await form.parse(req);

    if (!files.images) {
      return res.status(400).json({
        success: false,
        error: 'No images provided',
      });
    }

    // Convert to buffer objects and upload to Cloudinary
    const fileArray = Array.isArray(files.images) ? files.images : [files.images];

    const fileBuffers = await Promise.all(
      fileArray.map(async (file) => {
        const buffer = await fs.promises.readFile(file.filepath);

        // Clean up temp file
        await fs.promises.unlink(file.filepath);

        return {
          buffer,
          name: file.originalFilename || 'image.jpg',
        };
      })
    );

    // Upload to Cloudinary
    const urls = await uploadImages(fileBuffers);

    return res.status(200).json({
      success: true,
      data: { urls },
      message: 'Images uploaded successfully',
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Upload failed',
    });
  }
}

export default withCors(withErrorHandler(handler));
