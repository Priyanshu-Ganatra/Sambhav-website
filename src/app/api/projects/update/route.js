// pages/api/projects/[id].js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';


const prisma = new PrismaClient();

export async function POST(req) {
    const payload = await req.formData();

    const id = payload.get('id');
    const name = payload.get('name');
    
    const buildingName = payload.get('buildingName');

    const type = payload.get('type');
    const status = payload.get('status');
    const addressLine1 = payload.get('addressLine1');
    const addressLine2 = payload.get('addressLine2');
    const street = payload.get('street');
    const landmark = payload.get('landmark');
    const city = payload.get('city');
    const state = payload.get('state');

    const tagLine = payload.get('tagLine');
    const shortDescription = payload.get('shortDescription');
    const longDescription = payload.get('longDescription');


    try {
        const updatedProjectData = {
            name,

            type,
            status,

            buildingName,

            addressLine1,
            addressLine2,
            street,
            landmark,
            city,
            state,

            tagLine,
            shortDescription,
            longDescription
        };
        const updatedProject = await prisma.project.update({
            where: {
                id: parseInt(id),
            },
            data: updatedProjectData,
        });

        return NextResponse.json({
            status: 200,
            body: updatedProject,
        });
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json({
            body: { error: 'Internal Server Error' },
        }, { status: 500 });
    } finally {
        await prisma.$disconnect(); 
    }
}
