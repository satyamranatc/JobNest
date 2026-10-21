import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import "dotenv/config";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer memory storage configuration
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

/**
 * Upload a single file (Buffer, Multer file object, filepath, or base64) to Cloudinary
 * @param {Buffer|Object|string} file
 * @param {string} folder
 * @returns {Promise<Object>} Cloudinary upload result
 */
export const uploadToCloudinary = (file, folder = "jobnest/avatars") => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("No file provided for upload"));
    }

    // Handle multer file object (has buffer) or direct Buffer
    const buffer = file.buffer || (Buffer.isBuffer(file) ? file : null);

    if (buffer) {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: "auto" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    } else if (typeof file === "string" || (file.path && typeof file.path === "string")) {
      const pathOrUri = typeof file === "string" ? file : file.path;
      cloudinary.uploader.upload(pathOrUri, { folder, resource_type: "auto" })
        .then(resolve)
        .catch(reject);
    } else {
      reject(new Error("Unsupported file format for Cloudinary upload"));
    }
  });
};

/**
 * Upload multiple files to Cloudinary
 * @param {Array} files
 * @param {string} folder
 * @returns {Promise<Array>}
 */
export const uploadMultipleToCloudinary = async (files, folder = "jobnest/avatars") => {
  if (!Array.isArray(files) || files.length === 0) return [];
  return Promise.all(files.map((file) => uploadToCloudinary(file, folder)));
};

/**
 * Express middleware to handle avatar/image file upload via Multer and automatically upload to Cloudinary.
 * Attaches the Cloudinary URL to `req.body.avatar`.
 */
export const uploadAvatarMiddleware = (req, res, next) => {
  const handler = upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]);

  handler(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "File upload error", error: err.message });
    }

    try {
      const file =
        req.file ||
        req.files?.avatar?.[0] ||
        req.files?.image?.[0];

      if (file) {
        const result = await uploadToCloudinary(file, "jobnest/avatars");
        req.body.avatar = result.secure_url;
      }
      next();
    } catch (uploadErr) {
      return res.status(500).json({
        message: "Failed to upload image to Cloudinary",
        error: uploadErr.message,
      });
    }
  });
};

export default function cloudnaryConfig() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export { cloudinary };