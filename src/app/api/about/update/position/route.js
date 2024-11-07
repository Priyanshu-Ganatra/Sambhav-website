import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {

    try {
        const { id, newPosition, currentPosition } = await req.json();

        // console.log("id of about release: ", id, "newPosition of about release: ", newPosition, "currentPosition of about release: ", currentPosition);
        
        if(currentPosition === 1 && newPosition === 0) {
            return NextResponse.json({ error: 'Already at the top position' }, { status: 400 });
        }

        const maxPosition = await prisma.about.findMany({
            select: {
                position: true,
            },
            orderBy: {
                position: 'desc',
            },
        }).then(abouts => (abouts.length > 0 ? abouts[0].position : 0));

        if (newPosition > maxPosition) {
            return NextResponse.json({ error: 'Already at the last position' }, { status: 400 });
        }

        await prisma.$transaction(async (tx) => {
            // Find the about to be updated
            const about = await tx.about.findUnique({
                where: { id },
            });

            // console.log('maxPosition:', maxPosition);

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
            
            // Restore the original position of the about at newPosition
            await tx.about.update({
                where: { id: aboutAtNewPosition.id },
                data: { position: currentPosition },
            });
        });
        
        return NextResponse.json({ message: 'Position updated successfully' });
    } catch (error) {
        console.error('Error updating about position:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
