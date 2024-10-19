import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function POST(
  request
) {
  const body = await request.json();
  const {
    id,
    field,
    value
  } = body;

  let updatedUser;
  switch (field) {
    case 'name':
      updatedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: { name: value },
      });
      break;
    case 'mname':
      updatedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: { mname: value },
      });
      break;
    case 'lname':
      updatedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: { lname: value },
      });
      break;
    case 'gender':
      updatedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: { gender: value },
      });
      break;
      case 'Birthdate':
      updatedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: { Birthdate: new Date(value) },
      });
      break;
      case 'email':
      updatedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: { email: value },
      });
      break;
      case 'Address':
      updatedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: { Address: value },
      });
      break;
      case 'image':
      updatedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: { image: value },
      });
      break;
      case 'Address':
      updatedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: { Address: value },
      });
      break;
      
    // Add cases for other fields as needed
    default:
      return res.status(400).json({ message: 'Invalid field' });
  }

  return NextResponse.json(updatedUser);
}