import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';

export async function POST(
    request
) {
    const body = await request.json();
    const {
        spaId,
        gender,
        firstName,
        middleName,
        lastName,
        phoneNumber,
        birthdate,
        address,
        image


    } = body;

    

    const therapist = await prisma.therapist.create({
        data: {
            spaId: parseInt(spaId, 10),
            gender: gender,
            fname: firstName,
            mname: middleName,
            lname: lastName,
            phoneNum:  phoneNumber,
            Birthdate: birthdate,
            address: address,
            pwdCardImage :image
        }
    });

    return NextResponse.json(therapist);
}