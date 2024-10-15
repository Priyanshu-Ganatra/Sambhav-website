// pages/api/contact.js

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  const { email } = await req.json();
 
  try {
    await prisma.newsletter.create({
      data: {
        email,
      },
    });

    return NextResponse.json({
      status: 201,
      body: { success: true, message: 'Submitted successfully' }
    });
  } catch (error) {
    console.error('Error handling contact form submission:', error);
    return NextResponse.error({
      status: 500,
      body: { error: 'Internal Server Error' }
    });
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection
}
}
