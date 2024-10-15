// Import NextResponse from next/server
import { NextResponse } from "next/server";

// Import PrismaClient
import { PrismaClient } from "@prisma/client";
import { parse } from "url";

// Initialize PrismaClient
const prisma = new PrismaClient();

// GET request to fetch all social media accounts
export async function GET(req) {
  try {
    const { query } = parse(req.url, true);
    // Fetch all social media accounts from the database
    const contactDetails = await prisma.contact.findMany();

    // Return NextResponse with status 200 and social media accounts data
    return NextResponse.json({ data: contactDetails }, { status: 200 });
  } catch (error) {
    console.error("Error fetching social media accounts:", error);
    // Return NextResponse with status 500 and error message
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection
  }
}
