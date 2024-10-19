import prisma from '@/app/libs/prismadb';

export default async function handler(req, res) {
    const { query: { id } } = req;

    try {
        const voucher = await prisma.voucher.findMany({
            where: {
                OR: [
                    { userId: parseInt(id) },
                    { userId: null }
                ],
                remainingUses: {
                    not: 0
                }
            },
            include: {
                spa: {
                    select: {
                        image: true
                    }
                }
            }
        });

        res.status(200).json(voucher);
    } catch (error) {
        console.error('Error fetching spa data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
