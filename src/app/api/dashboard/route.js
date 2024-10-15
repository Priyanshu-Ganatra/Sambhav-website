// pages/api/dashboard.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parse } from "url";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { query } = parse(req.url, true);

    // Fetch all projects
    const projects = await prisma.project.findMany();

    // Fetch about section
    const about = await prisma.about.findMany();

    // Fetch press releases
    const pressReleases = await prisma.press.findMany();

    // Fetch social media links
    const socialMediaLinks = await prisma.social.findMany();

    // Return data for the dashboard
    return NextResponse.json({
      projects,
      about,
      pressReleases,
      socialMediaLinks,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.error({
      message: "Internal server error",
      status: 500,
    });
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection
  }
}
