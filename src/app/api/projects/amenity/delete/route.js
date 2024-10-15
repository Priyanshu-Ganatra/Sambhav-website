// Import NextResponse
import { NextResponse } from 'next/server';

// Import PrismaClient
import { PrismaClient } from '@prisma/client';

// Initialize PrismaClient
const prisma = new PrismaClient();

// DELETE request to delete a social media account by ID
export async function POST(req) {
  try {
    const { id } = await req.json(); // Parse JSON data using await

    // Delete the social media account from the database
    await prisma.amenities.delete({
      where: {
        id: parseInt(id),
      },
    });

    // Send response with status 200 and success message along with status
    return NextResponse.json({
      message: 'Social media account deleted successfully', status: 200
    });
  } catch (error) {

    // Send response with status 500 and error message along with status
    return NextResponse.error({
      error: 'Internal server error',
      status: 500
    });
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection
  }
}
