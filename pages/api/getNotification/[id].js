// pages/api/spa/[id].js
import prisma from '@/app/libs/prismadb';


export default async function handler(req, res) {
    const { query: { id } } = req;
    

    try {
        const notification = await prisma.notification.findMany({
            where: {
                userId: parseInt(id, 10),
            },
            orderBy: {
                createdAt: 'desc', // Sort by createdAt field in descending order (latest to oldest)
            },
        });
        const newNotifCount = await prisma.notification.count({
            where: {
                userId: parseInt(id, 10),
                status: "new"
            }
        })
        

        const Data = {
            notification: notification,
            newNotifCount: newNotifCount
        }
        res.status(200).json(Data);
    } catch (error) {
        console.error('Error fetching notification data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
