import bcrypt from 'bcrypt';
import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';

export async function POST(
  request
) {
  const body = await request.json();
  const {
    email,
    name,
    mname,
    lname,
    gender,
    Birthdate,
    password,
    PhoneNum,
    Address
  } = body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      mname,
      lname,
      gender,
      Birthdate,
      hashedPassword,
      PhoneNum,
      Address,
    }
  });

  return NextResponse.json(user);
}