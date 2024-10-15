// Import NextResponse
import { NextResponse } from 'next/server';
// Import PrismaClient
import { PrismaClient } from '@prisma/client';

// Initialize PrismaClient
const prisma = new PrismaClient();

// POST request to create a social media account
export async function POST(req) {
  try {
    const { socialMedia, link } = await req.json(); // Use await to parse JSON data
    // console.log(socialMedia, link)
    // Validate incoming data
    if (!socialMedia || !link) {
      return NextResponse.error({
        status: 400,
        body: { error: 'Both socialMedia and link are required' },
      });
    }

    // Create the social media account in the database
    const socialMediaQuery = await prisma.social.create({
      data: {
        socialMedia, // Save the social media name exactly as provided
        link, // Save the link exactly as provided
      },
    });

    return NextResponse.json({
      status: 201,
      body: { data: socialMedia, message: 'Social media link created successfully' },
    });
  } catch (error) {
    console.error('Error creating social media account:', error);
    return NextResponse.error({
      status: 500,
      body: { error: 'Internal server error' },
    });
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection
  }
}
