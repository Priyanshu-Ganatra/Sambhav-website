import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { createFolderIfNotExists } from '@/assets/js/helper';
// Initialize PrismaClient
const prisma = new PrismaClient();

export async function POST(req) {
    const payload = await req.formData();
    // console.log("Payload:", payload);

    const projectId = payload.get('projectId');
    // console.log("Project ID:", projectId);

    const getData = await prisma.project.findUnique({ where: { id: parseInt(projectId) } });
    // console.log("Project Data:", getData);

    const projectName = getData.name;
    // console.log("Project Name:", projectName);

    const createImagesPromises = [];

    // Iterate over all keys in the payload
    for (const [key, image] of payload.entries()) {
        if (key.startsWith('amenityImage')) { 
            // console.log("Processing image with key:", key);

            const imageName = projectName.replace(" ", "_") + "_" + Date.now();
            // console.log("Image Name:", imageName);

            const imageBytes = await image.arrayBuffer();
            // console.log("Image Bytes:", imageBytes);

            const buffer = Buffer.from(imageBytes);

            await createFolderIfNotExists(`${process.cwd()}/public/assets/images/projects/${projectId}/amenity`);

            const path = join("./", `public/assets/images/projects/${projectId}/amenity`, `${imageName}.png`);
            // console.log("Image Path:", path);

            const amenityUrl = `/assets/images/projects/${projectId}/amenity/${imageName}.png`;
            // console.log("Amenity URL:", amenityUrl);

            try {
                await writeFile(path, buffer);

                const createAmenity = await prisma.amenityImage.create({
                    data: {
                        amenityUrl,
                        projectId: parseInt(projectId)
                    },
                });

                createImagesPromises.push(createAmenity);
                // console.log("Image uploaded and database entry created.");
            } catch (error) {
                // console.log("Error uploading image:", error);
                throw new Error('Failed to upload one or more images');
            }
        }
    }

    try {
        const createdAmenities = await Promise.all(createImagesPromises);
        // console.log("All images uploaded successfully:", createdAmenities);

        return NextResponse.json({ message: "Images uploaded successfully", body: createdAmenities }, { status: 200 });
    } catch (error) {
        // console.log("Error:", error);
        return NextResponse.json({ error: "Failed to upload one or more images" }, { status: 500 });
    } finally {
        await prisma.$disconnect(); 
        // console.log("Prisma disconnected.");
    }
}
