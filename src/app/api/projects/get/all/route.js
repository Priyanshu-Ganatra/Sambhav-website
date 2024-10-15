import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { parse } from "url";

const prisma = new PrismaClient();

export async function GET(req) {
  // const { query } = parse(req.url, true);

  try {
    const projects = await prisma.project.findMany({
      include: {
        projectImages: true,
      },
      orderBy: {
        position: "asc",
      },
    });
    return NextResponse.json(projects, {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Expires: "0",
        Pragma: "no-cache",
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection
  }
}

export const dynamic = "force-dynamic";
