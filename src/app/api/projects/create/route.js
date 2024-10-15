// pages/api/projects/create.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { join } from "path";
import { writeFile } from "fs/promises";
import fs from "fs";
import { createFolderIfNotExists } from "@/assets/js/helper";
import { hasValue } from "@/utils/helpers";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const payload = await req.formData();

    const logo = payload.get("logo");
    const name = payload.get("name");
    const buildingName = payload.get("buildingName");
    const buildingImage = payload.get("buildingImage");

    const type = payload.get("type");
    const status = payload.get("status");
    const addressLine1 = payload.get("addressLine1");
    const addressLine2 = payload.get("addressLine2");
    const street = payload.get("street");
    const landmark = payload.get("landmark");
    const city = payload.get("city");
    const state = payload.get("state");

    const shortDescription = payload.get("shortDescription");
    const longDescription = payload.get("longDescription");

    const logoName = name.replace(" ", "_") + "_" + Date.now();
    const logoFolderPath = `/assets/images/projects/logo/`;
    const logoUrl = `${logoFolderPath}${logoName}.png`;

    if (!hasValue(logo)) {
      return NextResponse.json(
        { error: "Logo file is missing" },
        { status: 400 }
      );
    }

    if (!hasValue(buildingImage)) {
      return NextResponse.json(
        { error: "building Image file is missing" },
        { status: 400 }
      );
    }

    try {
      // Save the logo without compressing
      const logoBytes = await logo?.arrayBuffer();
      const buffer = Buffer.from(logoBytes);
      await createFolderIfNotExists(
        `${process.cwd()}/public/${logoFolderPath}`
      );
      const path = join(
        process.cwd(),
        "public",
        logoFolderPath,
        `${logoName}.png`
      );
      await writeFile(path, buffer);

      const fileExists = fs.existsSync(path);
      if (!fileExists) {
        return NextResponse.json(
          { error: "Failed to save the logo file" },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error("Error saving logo file:", error);
      return NextResponse.json(
        { error: "Error saving logo file" },
        { status: 500 }
      );
    }

    const bldgImageName = name.replace(" ", "_") + "_" + Date.now();
    const bldgImageFolderPath = `/assets/images/projects/building/`;

    const buildingImageUrl = `${bldgImageFolderPath}${bldgImageName}.png`;

    try {
      // Save the logo without compressing
      const bldgImgBytes = await buildingImage?.arrayBuffer();
      const bldgImgbuffer = Buffer.from(bldgImgBytes);

      await createFolderIfNotExists(
        `${process.cwd()}/public/${bldgImageFolderPath}`
      );

      const path = join(
        process.cwd(),
        "public",
        bldgImageFolderPath,
        `${bldgImageName}.png`
      );
      await writeFile(path, bldgImgbuffer);

      const fileExists = fs.existsSync(path);
      if (!fileExists) {
        return NextResponse.json(
          { error: "Failed to save the Building image" },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error("Error saving building file:", error);
      return NextResponse.json(
        { error: "Error saving building file" },
        { status: 500 }
      );
    }

    const maxPosition = await prisma.project
      .findMany({
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
        take: 1,
      })
      .then((projects) => (projects.length > 0 ? projects[0].position : 0));

    // Create a new project with the next position
    const newPosition = maxPosition + 1;

    const project = await prisma.project.create({
      data: {
        name,
        buildingName,
        buildingImageUrl,

        type,
        status,

        addressLine1: addressLine1 || "",
        addressLine2: addressLine2 || "",
        street: street || "",
        landmark: landmark || "",
        city: city || "",
        state: state || "",

        position: newPosition,

        shortDescription,
        longDescription,
        logoUrl,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection
  }
}
