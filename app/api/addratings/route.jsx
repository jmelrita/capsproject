// pages/api/bookings.js
import prisma from '@/app/libs/prismadb';

export async function POST(request) {
    const { spaId, userId, rating } = await request.json();

    const ratingRow = await prisma.rating.findFirst({
        where: {
            userId: userId,
            spaId: parseInt(spaId, 10),
        }
    });
    if (ratingRow) {
        const updateRating = await prisma.rating.update({
            where: {
                id: ratingRow.id,
            },
            data: {
                ratings: rating,
            },
        });
    } else {
        const newRating = await prisma.rating.create({
            data: {
                spaId: parseInt(spaId, 10),
                userId: userId,
                ratings: rating,
            },
        });
    }
    return new Response('OK');
}
