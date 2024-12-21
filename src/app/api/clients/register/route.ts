import { NextResponse } from "next/server";
import db from '@/libs/db'
import bcrypt from 'bcrypt'

export async function POST(request: Request) {

    try {
        const data = await request.json()
    console.log(data);
    const userFound = await db.usuario.findUnique({
        where: {
            id: data.id,
            email: data.email
        }
    })
    
    if(!userFound){
        return NextResponse.json({
            message: 'Usuario no registrado'
        }, {
            status: 400
        })
    }
    
    const hashedPasswd = await bcrypt.hash(data.passwd, 10);
    const newUser = await db.usuario.create({
        data: {
            ...data,
            password: hashedPasswd
        }
    })

    return NextResponse.json((newUser))
    } catch (error: unknown) {
        return NextResponse.json(
            {
            message: (error instanceof Error) ? error.message : 'Error desconocido'},
            {
                status: 500
            }
        )
    }
}
