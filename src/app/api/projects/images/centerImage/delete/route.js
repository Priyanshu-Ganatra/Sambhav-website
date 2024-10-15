import { NextResponse } from 'next/server';
import { join } from 'path';
import { unlink } from 'fs/promises';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
    const {id} = await req.json();

    const getData = await prisma.project.findUnique({ where: { id: parseInt(id) } })

    if (getData.centerImage && getData.centerImage.length > 0) {
        try {
            const ImagePath = join(process.cwd(), 'public', getData.centerImage);
            await unlink(ImagePath);
            // console.log('Image file deleted:', ImagePath);
        } catch (error) {
            // console.log('error deleting old image:', error)
        }
    }

    try {

        const updatedProject = await prisma.project.update({
            where: {
                id: parseInt(id),
            },
            data: {
                centerImage: null
            },
        });

        return NextResponse.json({ message: "Image deleted successfully", body: updatedProject });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" });
    } finally {
        await prisma.$disconnect(); 
    }
}
