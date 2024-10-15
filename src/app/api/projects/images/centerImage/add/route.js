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

    const image = payload.get('centerImage');
    const id = payload.get('id');

    const getData = await prisma.project.findUnique({ where: { id: parseInt(id) } })


    const projectName = getData.name;
    const imageName = projectName.replace(" ", "_") + "_" + Date.now()

    const buildingImageBytes = await image.arrayBuffer();
    const buffer = Buffer.from(buildingImageBytes);

    await createFolderIfNotExists(`${process.cwd()}/public/assets/images/projects/${id}`)

    const path = join("./", `public/assets/images/projects/${id}`, `${imageName}.png`);
    const centerImage = `/assets/images/projects/${id}/${imageName}.png`;

    if (getData.centerImage && getData.centerImage.length > 0) {
        try {
            const oldImagePath = join(process.cwd(), 'public', getData.centerImage);
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
                centerImage
            },
        });

        return NextResponse.json({ message: "Image uploaded successfully", body: updatedProject });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" });
    } finally {
        await prisma.$disconnect(); // Close Prisma client connection
    }
}
