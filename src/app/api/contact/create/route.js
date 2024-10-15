// pages/api/contact.js

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  const { fullName, email, contact, message } = await req.json();

  try {
    await prisma.contact.create({
      data: {
        fullName,
        email,
        contact,
        message,
      },
    });

    return NextResponse.json({
      status: 201,
      body: { success: true, message: 'Contact form submitted successfully' }
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
