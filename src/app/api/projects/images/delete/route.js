import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(req) {
  const { imageId } = await req.json();
  // console.log(imageId);

  if (!imageId) {
    return NextResponse.json({
      body: { error: 'Missing image ID' },
    }, { status: 400 }); // Bad request if image ID is missing
  }

  try {
    const deletedImage = await prisma.projectImage.delete({
      where: {
        id: imageId,
      },
      include: {
        project: true, // Include the associated project to get the image URL
      },
    });

    if (!deletedImage) {
      return NextResponse.json({
        body: { error: 'Project image not found' },
      }, { status: 404 }); // Not Found if image ID doesn't exist
    }

    // console.log('Project image deleted:', deletedImage);

    // Delete the actual image file from the public directory
    const imagePath = path.join(process.cwd(), 'public', deletedImage.imageUrl);
    await fs.unlink(imagePath); // Delete the image file

    // console.log('Image file deleted:', imagePath);

    return NextResponse.json({
      status: 200,
      body: { message: 'Project image deleted successfully' },
    });
  } catch (error) {
    console.error('Error deleting project image:', error);
    return NextResponse.json({
      body: { error: 'Internal Server Error' },
    }, { status: 500 });
  }
  finally {
    await prisma.$disconnect(); // Close Prisma client connection
  }
}
