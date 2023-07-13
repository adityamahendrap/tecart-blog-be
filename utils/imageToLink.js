import { v2 as cloudinary } from 'cloudinary'

export default async (imageFile, next) => {
  cloudinary.config({
    cloud_name: process.env.IMAGE_HANDLER_CLOUD_NAME,
    api_key: process.env.IMAGE_HANDLER_API_KEY,
    api_secret: process.env.IMAGE_HANDLER_API_SECRET
  });
  
  try {
    const result = await cloudinary.uploader.upload(imageFile)
    const imageUrl = result.secure_url
    return imageUrl
  } catch (err) {
    next(err)
  }
}
