import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const prisma = new PrismaClient();

export async function POST(req) {
  // console.log('Request received:', req.body); // Log incoming request data

  const payload = await req.formData();

  const projectId = parseInt(payload.get('projectId')); // Assuming project ID is sent in the request

  if (!projectId) {
    return NextResponse.json({
      body: { error: 'Missing required field: projectId' },
      status: 400, // Bad request if project ID is missing
    });
  }

  const videoFile = payload.get('videoFile'); // Assuming single video file is sent

  try {
    // console.log('Processing video:', videoFile); // Log video details

    if (videoFile) { // Check if video file exists
      const videoBytes = await videoFile.arrayBuffer();
      const videoBuffer = Buffer.from(videoBytes);
      const videoName = `${projectId}_${Date.now()}.mp4`; // Assuming video format is mp4
      const videoPath = join('./', 'public/assets/videos/projects/projectVideo', videoName);
      await writeFile(videoPath, videoBuffer);
      // console.log('Video saved to:', videoPath); // Log saved video path

      const createdVideo = await prisma.projectVideo.create({
        data: {
          projectId,
          videoUrl: `/assets/videos/projects/projectVideo/${videoName}`, // Update video URL path
        },
      });
      // console.log('Project video record created:', createdVideo);

      return NextResponse.json({
        status: 200,
        body: { message: 'Project video added successfully' },
        addedVideoData: createdVideo
      });
    } else {
      throw new Error('No video file received.');
    }
  } catch (error) {
    console.error('Error adding project video:', error);
    return NextResponse.json({
      body: { error: 'Internal Server Error' },
      status: 500,
    });
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection
  }
}
