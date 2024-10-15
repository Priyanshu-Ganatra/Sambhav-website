import { Buffer } from 'buffer';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { unlink } from 'fs/promises';

import { PrismaClient } from '@prisma/client';
import { createFolderIfNotExists } from '@/assets/js/helper';

const prisma = new PrismaClient();

export async function POST(req) {
    const payload = await req.formData();

    const image = payload.get('buildingHoverImage');
    const id = payload.get('id');

    // console.log(image)

    const getData = await prisma.project.findUnique({ where: { id: parseInt(id) } })


    const projectName = getData.name;
    const imageName = projectName.replace(" ", "_") + "_Hover_" + Date.now()

    const buildingImageBytes = await image.arrayBuffer();
    const buffer = Buffer.from(buildingImageBytes);

    await createFolderIfNotExists(`${process.cwd()}/public/assets/images/projects/building`)

    const path = join("./", `public/assets/images/projects/building`, `${imageName}.png`);
    const buildingHoverImage = `/assets/images/projects/building/${imageName}.png`;

    if (getData.buildingHoverImage && getData.buildingHoverImage.length > 0) {
        try {
            const oldImagePath = join(process.cwd(), 'public', getData.buildingHoverImage);
            await unlink(oldImagePath);
            // console.log('Image file deleted:', oldImagePath);
        } catch (error) {s
            // console.log('error deleting old image:', error)
        }
    }   

    try {
        await writeFile(path, buffer);

        const updatedProject = await prisma.project.update({
            where: {
                id: parseInt(id),
            },
            data: {
                buildingHoverImage
            },
        });

        return NextResponse.json({ message: "Image uploaded successfully", body: updatedProject });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" });
    } finally {
        await prisma.$disconnect(); 
    }
}
