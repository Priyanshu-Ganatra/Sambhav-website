import { NextResponse } from 'next/server';
import { join } from 'path';
import { unlink } from 'fs/promises';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
    const {imageId} = await req.json();
    try {
        const deleteAmenity = await prisma.amenityImage.delete({
            where: {
                id: parseInt(imageId),
            }
        });

        return NextResponse.json({ message: "Image deleted successfully", body: deleteAmenity });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" });
    } finally {
        await prisma.$disconnect(); 
    }
}
