import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {

    try {
        const { id, newPosition, currentPosition } = await req.json();

        console.log("id of press release: ", id, "newPosition of press release: ", newPosition, "currentPosition of press release: ", currentPosition);

        await prisma.$transaction(async (tx) => {
            // Find the press to be updated
            const press = await tx.press.findUnique({
                where: { id },
            });

            if (!press) {
                return NextResponse.json({ error: 'Press release content\'s not found' }, { status: 404 });
            }
            const maxPosition = await prisma.press.findMany({
                select: {
                    position: true,
                },
                orderBy: {
                    position: 'desc',
                },
            }).then(presses => (presses.length > 0 ? presses[0].position : 0));

            // Find the press release at the new position
            const pressReleaseAtNewPosition = await tx.press.findUnique({
                where: { position: newPosition },
            });
            // Temporary variable to hold the position of the press at newPosition
            let tempPosition;

            if (pressReleaseAtNewPosition) {
                // Swap positions between the two pressReleases
                tempPosition = maxPosition + 1;
                await tx.press.update({
                    where: { id: pressReleaseAtNewPosition.id },
                    data: { position: tempPosition },
                });
            }

            // Update the position of the specified press
            await tx.press.update({
                where: { id },
                data: { position: newPosition },
            });

            console.log('before restoring the original position of the press at newPosition', pressReleaseAtNewPosition);

            // Restore the original position of the press at newPosition
            await tx.press.update({
                where: { id: pressReleaseAtNewPosition.id },
                data: { position: currentPosition },
            });
        });

        return NextResponse.json({ message: 'Press release content\'s position updated successfully' });
    } catch (error) {
        console.error('Error updating press position:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
