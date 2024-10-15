import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { unlink } from 'fs/promises';
import { join } from 'path';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { id } = await req.json();
    // console.log(id);
    if (!id) {
      return NextResponse.error({ message: 'ID parameter is missing', status: 400 });
    }

    // Retrieve the pressRelease entry from the database
    const pressRelease = await prisma.press.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!pressRelease) {
      return NextResponse.error({ message: 'Press release entry not found', status: 404 });
    }

    // Delete the associated files from storage
    const imagePath = join('./public', pressRelease.imageUrl);
    // const iconSmallPath = join('./public', pressRelease.iconSmallUrl);

    try {
      await Promise.all([
        unlink(imagePath), // Delete the image file
        // unlink(iconSmallPath), // Delete the iconSmall file
      ]);
      // console.log('Files deleted:', imagePath, iconSmallPath);
    } catch (error) {
      console.error("Failed to delete files:", error);
      // Don't return here; proceed with the response.
    }

    // Delete the pressRelease entry from the database
    await prisma.press.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json({ message: 'Press release data deleted successfully', status: 200 });
  } catch (error) {
    console.error('Error deleting press release:', error);
    return NextResponse.error({ message: 'Internal server error', status: 500 });
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection
  }
}
