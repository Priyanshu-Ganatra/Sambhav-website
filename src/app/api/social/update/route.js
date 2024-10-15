// Import PrismaClient
import { PrismaClient } from '@prisma/client';

// Initialize PrismaClient
const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const { id, social, link } = req.body;

        // Update the social media account in the database
        const updatedSocialMedia = await prisma.social.update({
            where: {
                id: parseInt(id),
            },
            data: {
                social,
                link,
            },
        });

        return {
            status: 200,
            body: { data: updatedSocialMedia, message: 'Social media account updated successfully' },
        };
    } catch (error) {
        console.error('Error updating social media account:', error);
        return {
            status: 500,
            body: { error: 'Internal server error' },
        };
    } finally {
        await prisma.$disconnect(); // Close Prisma client connection
    }
}
