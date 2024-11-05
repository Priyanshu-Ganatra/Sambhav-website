// pages/api/press.js
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

    // If id is provided, update the existing press page
    if (id) {
      const pressToUpdate = await prisma.press.findUnique({
        where: {
          id: parseInt(id),
        },
      });

      if (!pressToUpdate) {
        return NextResponse.json({ error: 'Press page not found' }, { status: 404 });
      }

      // Unlink old images
      if (pressToUpdate.imageUrl) {
        const oldImagePath = join(process.cwd(), 'public', pressToUpdate.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          await unlink(oldImagePath);
        }
      }
      if (pressToUpdate.iconSmallUrl) {
        const oldIconSmallPath = join(process.cwd(), 'public', pressToUpdate.iconSmallUrl);
        if (fs.existsSync(oldIconSmallPath)) {
          await unlink(oldIconSmallPath);
        }
      }

      // Update the existing press page
      const heading = payload.get('heading');
      const content = payload.get('content');
      const redirection = payload.get('redirection');

      const headingWithUnderscore = heading.replace(/ /g, '_').substring(0, 10);

      const timestamp = Date.now();

      // Save imageData image
      let imageUrl = pressToUpdate.imageUrl;
      if (payload.get('imageData')) {
        const imageData = payload.get('imageData');

        const imageDataBuffer = await imageData.arrayBuffer();
        const imageDataPath = join(process.cwd(), 'public/assets/images/press', `${headingWithUnderscore}_${timestamp}_big.png`);
        await writeFile(imageDataPath, Buffer.from(imageDataBuffer));
        imageUrl = `/assets/images/press/${headingWithUnderscore}_${timestamp}_big.png`;

        // Check if the file exists
        const fileExists = fs.existsSync(imageDataPath);
        if (!fileExists) {
          return NextResponse.json({ error: 'Failed to save the imageData file' }, { status: 500 });
        }
      }

      // Save iconSmall image
      let iconSmallUrl = pressToUpdate.iconSmallUrl;
      if (payload.get('smallIconFile')) {
        const iconSmall = payload.get('smallIconFile');
        const iconSmallBuffer = await iconSmall.arrayBuffer();
        const iconSmallPath = join(process.cwd(), 'public/assets/images/press', `${headingWithUnderscore}_${timestamp}_small.png`);
        await writeFile(iconSmallPath, Buffer.from(iconSmallBuffer));
        iconSmallUrl = `/assets/images/press/${headingWithUnderscore}_${timestamp}_small.png`;

        // Check if the file exists
        const fileExists = fs.existsSync(iconSmallPath);
        if (!fileExists) {
          return NextResponse.json({ error: 'Failed to save the iconSmall file' }, { status: 500 });
        }
      }

      // Update the press in the database
      const updatedPress = await prisma.press.update({
        where: {
          id: parseInt(id),
        },
        data: {
          heading,
          content,
          redirection,
          imageUrl,
          iconSmallUrl,
        },
      });

      return NextResponse.json({ data: updatedPress, status: 200 });
    } else {
      // If id is not provided, create a new press page
      // Your code for creating a new press page goes here
    }

    // Return response
    // Your code for returning response goes here
  } catch (error) {
    console.error('Error creating/updating press:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection
  }
}
