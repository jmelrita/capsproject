
import prisma from '@/app/libs/prismadb';

export default async function handler(req, res) {
  const { query: { id } } = req;
  try {
    const booking = await prisma.booking.findFirst({
      where: {
        id: parseInt(id, 10),
      }

    })

    const updateBook = await prisma.booking.update({
      where: {
        id: parseInt(id, 10),
        userId: booking.userId,
        status: 0
      },
      data: {
        status: 3,
    },
    });
    res.status(200).json();
  } catch (error) {
    console.error('Error fetching massage data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
