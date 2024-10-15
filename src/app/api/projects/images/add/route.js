import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { createFolderIfNotExists } from '@/assets/js/helper';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const payload = await req.formData();

    const projectId = parseInt(payload.get('projectId'));

    if (!projectId) {
      return NextResponse.json({
        body: { error: 'Missing required field: projectId' },
        status: 400,
      });
    }

    const addedImageData = [];

    for (const [key, imageFile] of payload.entries()) {
      if (key.startsWith('imageFile')) {
        // console.log('Processing image:', imageFile);

        const imageBytes = await imageFile.arrayBuffer();
        const imageBuffer = Buffer.from(imageBytes);
        const imageName = `${projectId}_${Date.now()}.jpg`;

        const imageFolderPath = `/assets/images/projects/${projectId}`
        await createFolderIfNotExists(`./public/${imageFolderPath}`);

        const imagePath = join('./public', imageFolderPath, imageName);
        await writeFile(imagePath, imageBuffer);
        // console.log('Image saved to:', imagePath);

        const createdImage = await prisma.projectImage.create({
          data: {
            projectId,
            imageUrl: `${imageFolderPath}/${imageName}`,
          },
        });

        addedImageData.push(createdImage);
      }
    }

    if (addedImageData.length > 0) {
      return NextResponse.json({
        status: 200,
        body: { message: 'Project images added successfully' },
        addedImageData,
      });
    } else {
      return NextResponse.json({
        status: 400,
        body: { error: 'No image files received' },
      });
    }

  } catch (error) {
    console.error('Error adding project image:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection
  }
}
