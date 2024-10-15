// pages/api/projects/index.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { parse } from 'url';

const prisma = new PrismaClient();

export async function GET(req){
  const { query } = parse(req.url, true);
  const { id } = query;
  try {
    const projects = await prisma.project.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        projectImages: true,
        projectData: true,
        amenityImage: true
      }
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection
}
}
