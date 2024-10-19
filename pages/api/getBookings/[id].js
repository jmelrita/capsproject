// pages/api/spa/[id].js
import prisma from '@/app/libs/prismadb';

export default async function handler(req, res) {
  const { query: { id } } = req;

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: parseInt(id, 10),
      },
      include: {
        therapist: {
            select: {
                fname: true,
                mname: true,
                lname: true,
            },
        },
        serviceType: {
            select: {
                type: true,
            },
        },
        massage: {
            select: {
                type: true,
                duration: true,
                price: true,
            },
        },
        bookingStatus: {
            select: {
                status: true,
            },
        },
        spa: {
          select: {
            name: true,
            address: true,
            image: true,
          },
        }
       
      },
      orderBy: {
        id: 'desc'
      }
    });

   

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching spa data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
