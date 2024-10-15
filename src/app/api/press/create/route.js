import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { join } from 'path';
import { writeFile } from 'fs/promises';
import fs from 'fs';
import { createFolderIfNotExists } from '@/assets/js/helper';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const payload = await req.formData();

    const heading = payload.get('heading');
    const content = payload.get('content');
    const redirection = payload.get('redirection');
    const imageData = payload.get('imageData');
    // const iconSmall = payload.get('smallIconFile');

    const headingWithUnderscore = heading.replace(' ', '_');
    const timestamp = Date.now();
    
    await createFolderIfNotExists(`${process.cwd()}/public/assets/images/press`)

    // Save imageData image
    let imageUrl = '';
    if (imageData) {
      try {
        const imageDataBuffer = await imageData.arrayBuffer();
        const imageDataPath = join(process.cwd(), 'public/assets/images/press', `${headingWithUnderscore}_${timestamp}_big.png`);
        await writeFile(imageDataPath, Buffer.from(imageDataBuffer));
        imageUrl = `/assets/images/press/${headingWithUnderscore}_${timestamp}_big.png`;

        // Check if the file exists
        const fileExists = fs.existsSync(imageDataPath);
        if (!fileExists) {
          return NextResponse.json({ error: 'Failed to save the imageData file' }, { status: 500 });
        }
      } catch (error) {
        console.error('Error saving imageData file:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }
    }

    // Save iconSmall image
    // let iconSmallUrl = '';
    // if (iconSmall) {
    //   try {
    //     const iconSmallBuffer = await iconSmall.arrayBuffer();
    //     const iconSmallPath = join(process.cwd(), 'public/assets/images/press', `${headingWithUnderscore}_${timestamp}_small.png`);
    //     await writeFile(iconSmallPath, Buffer.from(iconSmallBuffer));
    //     iconSmallUrl = `/assets/images/press/${headingWithUnderscore}_${timestamp}_small.png`;

    //     // Check if the file exists
    //     const fileExists = fs.existsSync(iconSmallPath);
    //     if (!fileExists) {
    //       return NextResponse.json({ error: 'Failed to save the iconSmall file' }, { status: 500 });
    //     }
    //   } catch (error) {
    //     console.error('Error saving iconSmall file:', error);
    //     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    //   }
    // }

    // Create the press in the database
    const press = await prisma.press.create({
      data: {
        heading,
        content,
        redirection,
        imageUrl,
      },
    });

    return NextResponse.json({ data: press, status: 201 });
  } catch (error) {
    console.error('Error creating press:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection
  }
}
