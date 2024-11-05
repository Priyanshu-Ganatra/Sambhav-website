import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { parse } from "url";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { query } = parse(req.url, true);

    const press = await prisma.press.findMany({ orderBy: [{ position: 'asc' }] });
    return NextResponse.json({ data: press, status: 200 });
  } catch (error) {
    console.error('Error fetching press:', error);
    return NextResponse.error({ error: 'Internal server error', status: 500 });
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection
  }
}