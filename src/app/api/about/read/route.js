// pages/api/about.js
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parse } from "url";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { query } = parse(req.url, true);
    const about = await prisma.about.findMany();
    return NextResponse.json({ data: about, status: 200 });
  } catch (error) {
    console.error("Error fetching about:", error);
    return NextResponse.error({ error: "Internal server error", status: 500 });
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection
  }
}
