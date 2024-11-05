// /api/press/extraData/get
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { parse } from 'url';

const prisma = new PrismaClient();

export async function GET(req){
  const { query } = parse(req.url, true);
  const { id } = query;
  // console.log(id);
  try {
    const pressData = await prisma.press.findUnique({
      where: {
        id: parseInt(id)
      },
    });
    // console.log(pressData)
    return NextResponse.json({body: pressData, status: 200});
  } catch (error) {
    console.error('Error fetching abouts:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection
}
}
