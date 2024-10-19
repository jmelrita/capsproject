// pages/api/spa/[id].js
import prisma from '@/app/libs/prismadb';

export default async function handler(req, res) {
  const { query: { code, userId, spaId } } = req;

  try {
    const voucher = await prisma.voucher.findUnique({
      where: {
        code: code,
      },
    });

    if (!voucher) {
      res.status(404).json({ error: 'Voucher not found' });
      return;
    }
    if (voucher.remainingUses === 0) {
      res.status(403).json({ error: 'This voucher has no remaining uses' });
      return;
    }

    if (voucher.spaId === parseInt(spaId)) {
      res.status(200).json(voucher);
    } else {
      res.status(400).json({ error: 'This voucher is not for this spa' });
    }
    res.status(200).json(voucher);
  } catch (error) {
    console.error('Error voucher code:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
