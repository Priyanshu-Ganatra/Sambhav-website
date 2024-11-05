import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {

    try {
        const { id, newPosition, currentPosition } = await req.json();

        // console.log("id of about release: ", id, "newPosition of about release: ", newPosition, "currentPosition of about release: ", currentPosition);

        await prisma.$transaction(async (tx) => {
            // Find the about to be updated
            const about = await tx.about.findUnique({
                where: { id },
            });

            if (!about) {
                return NextResponse.json({ error: 'About content\'s not found' }, { status: 404 });
            }
            const maxPosition = await prisma.about.findMany({
                select: {
                    position: true,
                },
                orderBy: {
                    position: 'desc',
                },
            }).then(abouts => (abouts.length > 0 ? abouts[0].position : 0));

            // Find the about at the new position
            const aboutAtNewPosition = await tx.about.findUnique({
                where: { position: newPosition },
            });
            // Temporary variable to hold the position of the about at newPosition
            let tempPosition;

            if (aboutAtNewPosition) {
                // Swap positions between the two abouts
                tempPosition = maxPosition + 1;
                await tx.about.update({
                    where: { id: aboutAtNewPosition.id },
                    data: { position: tempPosition },
                });
            }

            // Update the position of the specified about
            await tx.about.update({
                where: { id },
                data: { position: newPosition },
            });
            
            console.log('before restoring the original position of the about at newPosition', aboutAtNewPosition);

            // Restore the original position of the about at newPosition
            await tx.about.update({
                where: { id: aboutAtNewPosition.id },
                data: { position: currentPosition },
            });
        });
        
        return NextResponse.json({ message: 'About content\'s position updated successfully' });
    } catch (error) {
        console.error('Error updating about position:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
