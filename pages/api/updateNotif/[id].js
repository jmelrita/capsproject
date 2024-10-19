// pages/api/spa/[id].js
import prisma from '@/app/libs/prismadb';

export default async function handler(req, res) {
    const { query: { id } } = req;

    try {
        const updatenotification = await prisma.notification.updateMany({
            where: {
                userId: parseInt(id, 10),
                status: "new"
            },
            data:{
                status: "old"
            }
        });
        res.status(200).json(updatenotification);
    } catch (error) {
        console.error('Error fetching notification data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
