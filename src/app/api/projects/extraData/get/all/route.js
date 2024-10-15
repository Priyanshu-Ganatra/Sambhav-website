// pages/api/projects/[projectId]/data.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { parse } from "url";

const prisma = new PrismaClient();

export async function GET(req){
  try {
    const { query } = parse(req.url, true);

    const projectData = await prisma.projectData.findMany();

    return NextResponse.json(projectData);

  } catch (error) {
    console.error('Error fetching project data:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection
}
}
