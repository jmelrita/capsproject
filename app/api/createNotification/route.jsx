import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';

export async function POST(
  request
) {
  const body = await request.json();
  const {
    notifMessage,
    spaId,
    
  } = body;

 
  
  const spa = await prisma.notification.create({
    data: {
     notification_message: notifMessage,
     spaId: parseInt(spaId, 10),
    }
  });

  return NextResponse.json(spa);
}