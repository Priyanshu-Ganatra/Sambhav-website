import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { join } from "path";
import { unlink } from "fs/promises";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const payload = await req.formData();
    const projectId = payload.get("projectId");
    console.log({ deleteProject: projectId });

    if (!projectId) {
      return NextResponse.json(
        { error: "Project Id required", status: 404 },
        { status: 404 }
      );
    }

    const projectDelete = await prisma.project.findUnique({
      where: {
        id: parseInt(projectId),
      },
      include: {
        projectImages: true,
        amenityImage: true,
        projectData: true,
      },
    });

    if (!projectDelete) {
      return NextResponse.json(
        { error: "Project not found", status: 404 },
        { status: 404 }
      );
    }

    try {
      // Delete project images
      await Promise.all(
        projectDelete.projectImages.map(async (image) => {
          const imagePath = join(process.cwd(), "public", image.imageUrl);
          // console.log('Deleting project image:', imagePath);

          try {
            await unlink(imagePath);
          } catch (error) {
            if (error.code !== "ENOENT") {
              throw error;
            }
          }
        })
      );

      // Delete logo image
      const logoImagePath = join(
        process.cwd(),
        "public",
        projectDelete.logoUrl
      );
      // console.log('Deleting logo image:', logoImagePath);

      try {
        await unlink(logoImagePath);
      } catch (error) {
        if (error.code !== "ENOENT") {
          throw error;
        }
      }

      // Delete building image
      const buildingImagePath = join(
        process.cwd(),
        "public",
        projectDelete.buildingImageUrl
      );
      // console.log('Deleting building image:', buildingImagePath);

      try {
        await unlink(buildingImagePath);
      } catch (error) {
        if (error.code !== "ENOENT") {
          throw error;
        }
      }

      // Delete center image if it exists
      if (projectDelete.centerImage) {
        const centerImagePath = join(
          process.cwd(),
          "public",
          projectDelete.centerImage
        );
        // console.log('Deleting center image:', centerImagePath);

        try {
          await unlink(centerImagePath);
        } catch (error) {
          if (error.code !== "ENOENT") {
            throw error;
          }
        }
      }

      // Delete amenity images
      await Promise.all(
        projectDelete.amenityImage.map(async (image) => {
          const amenityImagePath = join(
            process.cwd(),
            "public",
            image.amenityUrl
          );
          // console.log('Deleting amenity image:', amenityImagePath);

          try {
            await unlink(amenityImagePath);
          } catch (error) {
            if (error.code !== "ENOENT") {
              throw error;
            }
          }
        })
      );

      // Delete project data images
      await Promise.all(
        projectDelete.projectData.map(async (data) => {
          const projectDataImagePath = join(
            process.cwd(),
            "public",
            data.imageUrl
          );
          // console.log('Deleting project data image:', projectDataImagePath);
          try {
            await unlink(projectDataImagePath);
          } catch (error) {
            if (error.code !== "ENOENT") {
              throw error;
            }
          }
        })
      );
    } catch (error) {
      console.log("Error deleting images:", error);
      throw error; // Re-throw the error to be caught by the outer catch block
    }

    const deletedProject = await prisma.project.delete({
      where: {
        id: parseInt(projectId),
      },
    });
    // console.log('Deleted project:', deletedProject);

    // console.log('Project deleted successfully');
    return NextResponse.json(
      { message: "Project deleted successfully", status: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Internal server error", status: 500 },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Close Prisma client connection
  }
}
