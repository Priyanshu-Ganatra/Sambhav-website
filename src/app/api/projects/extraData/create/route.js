// pages/api/projects/[id].js
import { join } from 'path';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { createFolderIfNotExists } from '@/assets/js/helper';

const prisma = new PrismaClient();


export async function POST(req) {
  const payload = await req.formData();

  const title = payload.get('title');
  const description = payload.get('description');
  const projectId = payload.get('projectId');
  const imageFile = payload.get('imageFile');
  // console.log(title, projectId)
  let imageUrl = "";

  const imageBytes = await imageFile.arrayBuffer();
  const imageBuffer = Buffer.from(imageBytes);
  const imageName = `${Date.now()}.jpg`;
  const folderPath = `/assets/images/projects/${projectId}`;

  await createFolderIfNotExists(`./public/${folderPath}`);

  imageUrl = join('./public', folderPath, imageName.replace(" ","_").toLowerCase());
  await writeFile(imageUrl, imageBuffer);
  // console.log('Image saved to:', imageUrl);

  try {
    const createdProjectData = await prisma.projectData.create({
      data: {
        title,
        description,
        imageUrl: `${folderPath}/${imageName}`,
        projectId: parseInt(projectId),
      },
    });

    return (NextResponse.json({
      status: 200,
      body: createdProjectData,
    }));
  } catch (error) {
    console.error('Error creating project data:', error);
    return (NextResponse.error('Internal Server Error', { status: 500 }));
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection
  }
}
