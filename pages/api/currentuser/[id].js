
import prisma from '@/app/libs/prismadb';

export default async function handler(req, res) {
    const { query: {id} } = req;
    

    try {
        const user = await prisma.user.findFirst({
            where: {
                id: parseInt(id, 10),
            },
        });
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching massage data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
