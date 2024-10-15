import { Buffer } from 'buffer';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
    const payload = await req.formData();

    const logo = payload.get('logo');
    const id = payload.get('id');

    const getData = await prisma.project.findUnique({where:{id:parseInt(id)}})
    const projectName = getData.name;
    const logoName = projectName.replace(" ", "_") + "_" + Date.now()
    const logoBytes = await logo.arrayBuffer();
    const buffer = Buffer.from(logoBytes);
    const path = join("./", `public/assets/images/projects/logo`, `${logoName}.png`);
    const logoUrl = `/assets/images/projects/logo/${logoName}.png`;

    try {
        await writeFile(path, buffer);

        const updatedProject = await prisma.project.update({
            where: {
                id: parseInt(id),
            },
            data: {
                logoUrl
            },
        });

        return NextResponse.json({ message: "Logo uploaded successfully", updatedProject });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" });
    } finally {
        await prisma.$disconnect(); // Close Prisma client connection
    }
}
