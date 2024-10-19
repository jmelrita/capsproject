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

        // Fetch the ongoing booking if exists
        const ongoingBooking = await prisma.booking.findFirst({
            where: {
                userId: parseInt(id, 10),
                status: 2,
            },
        });
        const activeTherapist = await prisma.therapist.findFirst({
            where: {
                status: 1,
                spaId: book.spaId
            },
            orderBy: {
                updatedAt: 'asc'
            }
        });

        // Update booking if there's an ongoing booking

        await prisma.booking.update({
            where: {
                id: book.id,
            },
            data: {
                status: 2,
                therapistId: activeTherapist.id,
            },
        });
        await prisma.therapist.update({
            where: {
                id: activeTherapist.id,
            },
            data: {
                status: 2,
            },
        });
        res.status(200).json();

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
