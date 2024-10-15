import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(req) {
  const { videoId } = await req.json();
  // console.log(videoId);

  if (!videoId) {
    return NextResponse.json({
      body: { error: 'Missing video ID' },
    }, { status: 400 }); // Bad request if video ID is missing
  }

  try {
    const deletedVideo = await prisma.projectVideo.delete({
      where: {
        id: videoId,
      },
      include: {
        project: true, // Include the associated project to get the video URL
      },
    });

    if (!deletedVideo) {
      return NextResponse.json({
        body: { error: 'Project video not found' },
      }, { status: 404 }); // Not Found if video ID doesn't exist
    }

    // console.log('Project video deleted:', deletedVideo);

    // Delete the actual video file from the public directory
    const videoPath = path.join(process.cwd(), 'public', deletedVideo.videoUrl);
    await fs.unlink(videoPath); // Delete the video file

    // console.log('Video file deleted:', videoPath);

    return NextResponse.json({
      status: 200,
      body: { message: 'Project video deleted successfully' },
    });
  } catch (error) {
    console.error('Error deleting project video:', error);
    return NextResponse.json({
      body: { error: 'Internal Server Error' },
    }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection
  }
}
