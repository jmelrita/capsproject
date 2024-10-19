// pages/api/bookings.js

import prisma from '@/app/libs/prismadb';
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function POST(request) {
  const session = await getSession();
  const { spaId, massageId, status, address, ETA, serviceType, paymentImage, discount, voucherCode } = await request.json();

  console.log(session.user.email);
  console.log(spaId);
  console.log(voucherCode);

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email
    }
  });

  console.log(user.id);

  // Check if there's an existing booking with the current user's ID and status 0
  const existingBooking = await prisma.Booking.findFirst({
    where: {
      AND: [
        { userId: user.id },
        { status: 0 }
      ]
    }
  });

  if (existingBooking) {
    // If an existing booking is found, return an error or handle it accordingly
    return new Response('Booking with status 0 already exists for this user', { status: 400 });
  }

  // If no existing booking is found, create a new booking
  const book = await prisma.Booking.create({
    data: {
      spaId: parseInt(spaId),
      massageId: parseInt(massageId),
      userId: user.id,
      status: parseInt(status),
      address: address,
      ETA: ETA,
      serviceTypeId: parseInt(serviceType),
      discount: parseInt(discount),
    }
  });
  console.log('this booking ID that just added', book.id);


  if (book) {
    const expectedAmount = await prisma.booking.findUnique({
      where: {
        id: book.id,
      },
      include: {
        massage: {
          select: {
            price: true,
          },
        },
      },
    })

    const payment = await prisma.payment.create({
      data: {
        bookingId: book.id,
        expectedAmount: (expectedAmount.massage.price) - (expectedAmount.discount),
        paymentProofImg: paymentImage,
        spaId:  parseInt(spaId),
      }
    })

    if (voucherCode) {
      const updateVoucherLimit = await prisma.voucher.update({
        where: {
          code: voucherCode,
        },
        data: {
          remainingUses: {
            decrement: 1,
          },
        },
      });
    }
  }


  return new Response('OK');
}
