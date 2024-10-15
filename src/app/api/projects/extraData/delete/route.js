// pages/api/projects/[id].js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import fs from 'fs/promises'; 
import path from 'path'; 

const prisma = new PrismaClient();

export async function POST(req) {
  const { dataId } = await req.json();
  // console.log(dataId);

  try {
    const deletedProjectData = await prisma.projectData.delete({
      where: {
        id: parseInt(dataId),
      },
    });

    if (!deletedProjectData) {
      return NextResponse.json({
        body: { error: 'Project data not found' },
      }, { status: 404 }); 
    }

    // console.log('Project data deleted:', deletedProjectData);

    try {
      const imagePath = path.join(process.cwd(), 'public', deletedProjectData.imageUrl);
      await fs.unlink(imagePath); 
      // console.log('Image deleted:', imagePath);
    } catch (error) {
      // console.error("Failed to delete image:", error);
      // Don't return here; proceed with the response.
    }

    return NextResponse.json({
      status: 200,
      body: { message: 'Project data and associated image deleted successfully' },
    });
  } catch (error) {
    // console.error('Error deleting project data:', error);
    return NextResponse.json({
      body: { error: 'Internal Server Error' },
    }, { status: 500 });
  } finally {
    await prisma.$disconnect(); 
  }
}
