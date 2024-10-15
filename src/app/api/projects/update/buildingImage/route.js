import { Buffer } from 'buffer';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { unlink } from 'fs/promises';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
    const payload = await req.formData();

    const buildingImage = payload.get('buildingImage');
    const id = payload.get('id');

    const getData = await prisma.project.findUnique({where:{id:parseInt(id)}})

    
    const projectName = getData.name;
    const buildingImageName = projectName.replace(" ", "_") + "_" + Date.now()
    
    const buildingImageBytes = await buildingImage.arrayBuffer();
    const buffer = Buffer.from(buildingImageBytes);
    const path = join("./", `public/assets/images/projects/building`, `${buildingImageName}.png`);
    const buildingImageUrl = `/assets/images/projects/building/${buildingImageName}.png`;
    
    try {
        const oldImagePath = join(process.cwd(),'public', getData.buildingImageUrl);
        await unlink(oldImagePath); 
        // console.log('Image file deleted:', oldImagePath);
    } catch (error) {
        // console.log('error deleting old image:', error)
    }
    
    try {
        await writeFile(path, buffer);

        const updatedProject = await prisma.project.update({
            where: {
                id: parseInt(id),
            },
            data: {
                buildingImageUrl
            },
        });

        return NextResponse.json({ message: "Logo uploaded successfully", updatedProject });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" });
    } finally {
        await prisma.$disconnect(); // Close Prisma client connection
    }
}
