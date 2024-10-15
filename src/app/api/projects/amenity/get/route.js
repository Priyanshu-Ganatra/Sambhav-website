// pages/api/projects/index.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { parse } from 'url';

const prisma = new PrismaClient();

export async function GET(req){
  const { query } = parse(req.url, true);
  const { id } = query;
  // console.log(id)
  try {
    const projects = await prisma.amenities.findUnique({
      where: {
        projectId: parseInt(id)
      },
    });
    // console.log(projects)
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection
}
}
