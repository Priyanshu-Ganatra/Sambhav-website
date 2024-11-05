// pages/api/about.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { join } from "path";
import { writeFile } from "fs/promises";
import fs from "fs";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const payload = await req.formData();

    const heading = payload.get("heading");
    const content = payload.get("content");
    const imageData = payload.get("imageData");

    const headingWithUnderscore = heading.replace(/ /g, "_").substring(0, 10);

    const timestamp = Date.now();

    let iconBigUrl = "";
    if (imageData !== "null" || imageData !== "undefined") {
      try {
        const imageDataBuffer = await imageData?.arrayBuffer();

        const imageDataPath = join(
          process.cwd(),
          "public/assets/images/about",
          `${headingWithUnderscore}_${timestamp}_big.png`
        );

        console.log({ imageDataBuffer, imageDataPath });
        await writeFile(imageDataPath, Buffer.from(imageDataBuffer));

        iconBigUrl = `/assets/images/about/${headingWithUnderscore}_${timestamp}_big.png`;

        // Check if the file exists
        const fileExists = fs.existsSync(imageDataPath);
        if (!fileExists) {
          return NextResponse.json(
            { error: "Failed to save the imageData file" },
            { status: 500 }
          );
        }
      } catch (error) {
        console.error("Error saving imageData file:", error);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
      }
    }

    // Save iconSmall image
    // let iconSmallUrl = '';
    // if (iconSmall) {
    //   try {
    //     const iconSmallBuffer = await iconSmall.arrayBuffer();
    //     const iconSmallPath = join(process.cwd(), 'public/assets/images/about', `${headingWithUnderscore}_${timestamp}_small.png`);
    //     await writeFile(iconSmallPath, Buffer.from(iconSmallBuffer));
    //     iconSmallUrl = `/assets/images/about/${headingWithUnderscore}_${timestamp}_small.png`;

    //     // Check if the file exists
    //     const fileExists = fs.existsSync(iconSmallPath);
    //     if (!fileExists) {
    //       return NextResponse.json({ error: 'Failed to save the iconSmall file' }, { status: 500 });
    //     }
    //   } catch (error) {
    //     console.error('Error saving iconSmall file:', error);
    //     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    //   }
    // }

    const maxPosition = await prisma.about
      .findMany({
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
        take: 1,
      })
      .then((abouts) => (abouts.length > 0 ? abouts[0].position : 0));

    // Create a new about release with the next position
    const newPosition = maxPosition + 1;

    // Create the about in the database
    const about = await prisma.about.create({
      data: {
        heading,
        content,
        iconBigUrl,
        position: newPosition,
      },
    });

    return NextResponse.json({ data: about, status: 201 });
  } catch (error) {
    console.error("Error creating about:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection
  }
}