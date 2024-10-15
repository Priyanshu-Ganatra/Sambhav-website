// pages/api/projects/[id].js
import { join } from 'path';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { createFolderIfNotExists } from '@/assets/js/helper';

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const payload = await req.formData();

        const id = payload.get('id');
        const title = payload.get('title');
        const description = payload.get('description');
        const projectId = payload.get('projectId');
        const imageFile = payload.get('imageFile');

        let imageUrl = "";
        // If an image file is provided, save it and update the imageUrl
        if (imageFile) {
            const imageBytes = await imageFile.arrayBuffer();
            const imageBuffer = Buffer.from(imageBytes);
            const imageName = `${title}_${Date.now()}.jpg`; // Use id instead of projectId
            const folderPath = `/assets/images/projects/${projectId}`;

            // Create folder if it doesn't exist
            await createFolderIfNotExists(folderPath);

            // Save new image
            imageUrl = join('./public', folderPath, imageName);
            await writeFile(imageUrl, imageBuffer);
            // console.log('Image saved to:', imageUrl);
            imageUrl = `${folderPath}/${imageName}`;
            // Delete old image if exists
            const oldProjectData = await prisma.projectData.findUnique({ where: { id: parseInt(id) } });
            if (oldProjectData) {
                const oldImagePath = join('./public', oldProjectData.imageUrl);
                await unlink(oldImagePath);
                // console.log('Old image deleted from:', oldImagePath);
            }
        }

        // Update project data if provided
        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (imageUrl) updateData.imageUrl = imageUrl;

        if (Object.keys(updateData).length > 0) {
            const updatedProjectData = await prisma.projectData.update({
                where: { id: parseInt(id) },
                data: updateData,
            });

            return NextResponse.json({
                status: 200,
                body: {
                    message: 'Project data updated successfully',
                    status: 200,
                    data: updatedProjectData,
                },
            });
        } else {
            return NextResponse.json({
                status: 400,
                body: {
                    message: 'No data provided for update',
                    status: 400,
                },
            });
        }
    } catch (error) {
        console.error('Error updating project data:', error);
        return NextResponse.error({
            message: 'Internal Server Error',
            status: 500,
        });
    } finally {
        await prisma.$disconnect(); // Close Prisma client connection
    }
}
