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

    // Retrieve the about entry from the database
    const about = await prisma.about.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!about) {
      return NextResponse.error({ message: 'About entry not found', status: 404 });
    }
    // console.log(about);

    // Delete the associated files from storage
    const iconBigPath = join('./public', about.iconBigUrl);
    // const iconSmallPath = join('./public', about.iconSmallUrl);

    try {
      await Promise.all([
        unlink(iconBigPath), // Delete the iconBig file
        // unlink(iconSmallPath), // Delete the iconSmall file
      ]);
    } catch (error) {
      // console.log("unable to delete images from fs.")
    }


    // Delete the about entry from the database
    await prisma.about.delete({
      where: {
        id: parseInt(id),
      },
    });

    return NextResponse.json({ message: 'About data deleted successfully', status: 200 });
  } catch (error) {
    console.error('Error deleting about:', error);
    return NextResponse.error({ message: 'Internal server error', status: 500 });
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection
}
}
