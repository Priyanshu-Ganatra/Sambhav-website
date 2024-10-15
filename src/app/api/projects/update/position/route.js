import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {

    try {
        const { id, newPosition, currentPosition } = await req.json();

        await prisma.$transaction(async (tx) => {
            // Find the project to be updated
            const project = await tx.project.findUnique({
                where: { id },
            });

            if (!project) {
                return NextResponse.json({ error: 'Project not found' }, { status: 404 });
            }
            const maxPosition = await prisma.project.findMany({
                select: {
                    position: true,
                },
                orderBy: {
                    position: 'desc',
                },
            }).then(projects => (projects.length > 0 ? projects[0].position : 0));

            // Find the project at the new position
            const projectAtNewPosition = await tx.project.findUnique({
                where: { position: newPosition },
            });
            // Temporary variable to hold the position of the project at newPosition
            let tempPosition;

            if (projectAtNewPosition) {
                // Swap positions between the two projects
                tempPosition = maxPosition + 1;
                await tx.project.update({
                    where: { id: projectAtNewPosition.id },
                    data: { position: tempPosition },
                });
            }
            // Update the position of the specified project
            await tx.project.update({
                where: { id },
                data: { position: newPosition },
            });

            // Restore the original position of the project at newPosition
            await tx.project.update({
                where: { id: projectAtNewPosition.id },
                data: { position: currentPosition },
            });
        });

        return NextResponse.json({ message: 'Project position updated successfully' });
    } catch (error) {
        console.error('Error updating project position:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
