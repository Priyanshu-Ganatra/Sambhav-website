// /api/projects/extraData/get
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { parse } from 'url';

const prisma = new PrismaClient();

export async function GET(req){
  const { query } = parse(req.url, true);
  const { id } = query;
  // console.log(id);
  try {
    const aboutData = await prisma.about.findUnique({
      where: {
        id: parseInt(id)
      },
    });
    // console.log(aboutData)
    return NextResponse.json({body: aboutData, status: 200});
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection
}
}
