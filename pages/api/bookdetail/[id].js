import prisma from '@/app/libs/prismadb';

export default async function handler(req, res) {
    const { query: { id } } = req;

    try {
        // Fetch the booking based on userId and status 0 or 2
        const book = await prisma.booking.findFirst({
            where: {
                userId: parseInt(id, 10),
                status: {
                    in: [0, 2],
                },
            },
        });

        if (!book) {
            return res.status(404).json({ error: 'Booking not found' });
           
        }
        
        // Fetch user, massage, and spa data
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(id, 10),
            },
        });
        const massage = await prisma.massage.findUnique({
            where: {
                id: book.massageId,
            },
        });
        const spa = await prisma.spa.findUnique({
            where: {
                id: book.spaId,
            },
        });
        if (book.therapistId !== null) {
            const therapist = await prisma.therapist.findUnique({
                where: {
                    id: book.therapistId,
                },
            });
            const responseData = {
                booking: book,
                massage: massage,
                spa: spa,
                user: user,
                therapist: therapist

            };
            res.status(200).json(responseData);
        }

        const responseData = {
            booking: book,
            massage: massage,
            spa: spa,
            user: user,

        };

        res.status(200).json(responseData);

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        
    }
}
