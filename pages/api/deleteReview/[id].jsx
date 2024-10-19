import prisma from '@/app/libs/prismadb';

export default async function handler(req, res) {
  const { query: { id, reviewId } } = req;
  try {
    const deleteFeedback = await prisma.feedback.delete({
        where:{
            id: parseInt(reviewId, 10),
            userId: parseInt(id, 10),
        }
    })
    res.status(200).json();
  } catch (error) {
    console.error('Error deleting review data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
