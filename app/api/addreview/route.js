// pages/api/bookings.js
import prisma from '@/app/libs/prismadb';



export async function POST(request) {
    const { spaId, userId, feedback } = await request.json();

    const newReview = await prisma.Feedback.create({
        data: {
            spaId: parseInt(spaId, 10),
            userId: userId,
            feedback: feedback,
        },
    });


    return new Response('OK');
}
