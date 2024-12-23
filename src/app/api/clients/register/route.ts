import { NextResponse } from "next/server";
import db from '@/libs/db'
import bcrypt from 'bcrypt'

export async function POST(req: Request) {

    const body = await req.json();
    const { email, nombre, apellido, password, cedula, coordenadas, username } = body;

    try {
        // Validar si ya existe un usuario con el mismo correo o cédula
        const existingUser = await db.usuario.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ message: 'El correo ya está registrado.' }, { status: 400 });
        }

        const existingClient = await db.cliente.findUnique({ where: { cedula } });
        if (existingClient) {
            return NextResponse.json({ message: 'La cédula ya está registrada.' }, { status: 400 });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario y cliente
        const newUser = await db.usuario.create({
            data: {
                email,
                usuario: username,
                password: hashedPassword,
                nombre,
                apellido,
                rol: 'CLIENTE',
                Cliente: {
                    create: {
                        cedula,
                        coordenadas,
                    },
                },
            },
        });

        return NextResponse.json({
            message: 'Cliente registrado exitosamente',
            userId: newUser.id,
        });
    } catch (error) {
        console.error('Error al registrar cliente:', error);
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
    }
}
