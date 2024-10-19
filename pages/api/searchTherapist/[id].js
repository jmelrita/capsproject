// pages/api/spa/[id].js
import prisma from '@/app/libs/prismadb';

export default async function handler(req, res) {
  const { query: { id } } = req;

  try {
    const therapist = await prisma.therapist.count({
      where: {
        spaId:  parseInt(id, 10),
        status: 1
      },
    });
    res.status(200).json(therapist);
  } catch (error) {
    console.error('Error fetching therapist data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
