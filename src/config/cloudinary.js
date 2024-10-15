import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
const prisma = new PrismaClient();

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SERCRET
});

export async function uploadAndTransformImage(file) {
    try {
        const fileUrl = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { format: 'png' },
                async (err, result) => {
                    if (err) {
                        console.error("Error uploading to Cloudinary:", err);
                        reject(new Error('Failed to upload image'));
                    } else {
                        console.log("Uploaded Image URL:", result.url, result.public_id);
                        try {
                            await prisma.cloudinaryPublicId.create({
                                data: {
                                    url: result.url,
                                    publicId: result.public_id,
                                }
                            });
                            resolve(result.url);
                        } catch (dbError) {
                            console.error("Error saving publicId to the database:", dbError);
                            reject(new Error('Failed to save image metadata to the database'));
                        }
                    }
                }
            );
            uploadStream.end(file);
        });

        return fileUrl;
    } catch (error) {
        console.error('Error uploading or transforming image:', error);
        throw new Error('Failed to upload and transform image');
    } finally {
        await prisma.$disconnect(); // Ensure that the Prisma client connection is closed
    }
}

export async function deleteImage(url) {
    try {
        const ImageData = await prisma.cloudinaryPublicId.delete({
            where:{
                url
            }
        })
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(ImageData.publicId, (error, result) => {
                if (error) {
                    console.error("Error deleting image from Cloudinary:", error);
                    reject(new Error('Failed to delete image'));
                } else {
                    console.log("Deleted Image Result:", result);
                    resolve(result);
                }
            });
        });

        return result;
    } catch (error) {
        console.error('Error deleting image:', error);
        throw new Error('Failed to delete image');
    }
}
