// Import NextResponse
import { NextResponse } from 'next/server';
// Import PrismaClient
import { PrismaClient } from '@prisma/client';

// Initialize PrismaClient
const prisma = new PrismaClient();

// POST request to create a social media account
export async function POST(req) {
  try {
    const { amenity, projectId } = await req.json(); // Use await to parse JSON data
    // console.log(amenity)
    if (!amenity) {
      return NextResponse.error({
        status: 400,
        body: { error: 'Both amenity and projectId  are required' },
      });
    }

    // Create the social media account in the database
    const amenityQuery = await prisma.amenities.create({
      data: {
        amenity,
        projectId: parseInt(projectId)
      },
    });

    return NextResponse.json({
      status: 201,
      body: { data: amenityQuery, message: 'Social media  created successfully' },
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
