// pages/api/about.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { join } from 'path';
import { writeFile, unlink } from 'fs/promises'; // Added unlink
import fs from 'fs';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const payload = await req.formData();
    const id = payload.get('id'); // Assuming id is passed in the request payload for updating

    // If id is provided, update the existing about page
    if (id) {
      const aboutToUpdate = await prisma.about.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      if (!aboutToUpdate) {
        return NextResponse.json({ error: 'About page not found' }, { status: 404 });
      }

      // Unlink old images
      if (aboutToUpdate.iconBigUrl) {
        const oldIconBigPath = join(process.cwd(), 'public', aboutToUpdate.iconBigUrl);
        if (fs.existsSync(oldIconBigPath)) {
          await unlink(oldIconBigPath);
        }
      }
      if (aboutToUpdate.iconSmallUrl) {
        const oldIconSmallPath = join(process.cwd(), 'public', aboutToUpdate.iconSmallUrl);
        if (fs.existsSync(oldIconSmallPath)) {
          await unlink(oldIconSmallPath);
        }
      }

      // Update the existing about page
      const heading = payload.get('heading');
      const content = payload.get('content');

      const headingWithUnderscore = heading.replace(/ /g, '_').substring(0, 10);

      const timestamp = Date.now();

      // Save imageData image
      let iconBigUrl = aboutToUpdate.iconBigUrl;
      if (payload.get('imageData')) {
        const imageData = payload.get('imageData');

        const imageDataBuffer = await imageData.arrayBuffer();
        const imageDataPath = join(process.cwd(), 'public/assets/images/about', `${headingWithUnderscore}_${timestamp}_big.png`);
        await writeFile(imageDataPath, Buffer.from(imageDataBuffer));
        iconBigUrl = `/assets/images/about/${headingWithUnderscore}_${timestamp}_big.png`;

        // Check if the file exists
        const fileExists = fs.existsSync(imageDataPath);
        if (!fileExists) {
          return NextResponse.json({ error: 'Failed to save the imageData file' }, { status: 500 });
        }
      }

      // Save iconSmall image
      let iconSmallUrl = aboutToUpdate.iconSmallUrl;
      if (payload.get('smallIconFile')) {
        const iconSmall = payload.get('smallIconFile');
        const iconSmallBuffer = await iconSmall.arrayBuffer();
        const iconSmallPath = join(process.cwd(), 'public/assets/images/about', `${headingWithUnderscore}_${timestamp}_small.png`);
        await writeFile(iconSmallPath, Buffer.from(iconSmallBuffer));
        iconSmallUrl = `/assets/images/about/${headingWithUnderscore}_${timestamp}_small.png`;

        // Check if the file exists
        const fileExists = fs.existsSync(iconSmallPath);
        if (!fileExists) {
          return NextResponse.json({ error: 'Failed to save the iconSmall file' }, { status: 500 });
        }
      }

      // Update the about in the database
      const updatedAbout = await prisma.about.update({
        where: {
          id: parseInt(id),
        },
        data: {
          heading,
          content,
          iconBigUrl,
          iconSmallUrl,
        },
      });

      return NextResponse.json({ data: updatedAbout, status: 200 });
    } else {
      // If id is not provided, create a new about page
      // Your code for creating a new about page goes here
    }

    // Return response
    // Your code for returning response goes here
  } catch (error) {
    console.error('Error creating/updating about:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection
  }
}
