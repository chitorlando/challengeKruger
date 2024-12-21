import { NextResponse } from "next/server";
import db from '@/libs/db'

export async function POST(request: Request) {
    const data = await request.json()
    console.log(data);
    const userFound = await db.usuario.findUnique({
        where: {
            id: data.id,
            email: data.email
        }
    })
    
    if(userFound){
        return NextResponse.json({
            message: 'Usuario ya existe'
        }, {
            status: 400
        })
    }
    const newUser = await db.usuario.create({
        data
    })

    return NextResponse.json((newUser))
}
