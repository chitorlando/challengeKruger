import { NextResponse } from "next/server";
import db from '@/libs/db'
import bcrypt from 'bcrypt'

//funcion para registrar un cliente
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

//actualizar un cliente
export async function PUT(req: Request, { params }: {params: Promise<{id:string}> } ) {
    const body = await req.json();
    const { email, nombre, apellido, cedula, coordenadas } = body;

    try {
        const clientId = parseInt((await params).id);

        // Validar si el cliente existe
        const existingClient = await db.cliente.findUnique({
            where: { id: clientId },
            include: { usuario: true },
        });

        if (!existingClient) {
            return NextResponse.json({ message: 'Cliente no encontrado.' }, { status: 404 });
        }

        // Validar si el correo o la cédula están en uso por otro cliente
        const emailInUse = await db.usuario.findUnique({
            where: { email },
        });

        if (emailInUse && emailInUse.id !== existingClient.usuarioId) {
            return NextResponse.json({ message: 'El correo ya está en uso por otro usuario.' }, { status: 400 });
        }

        const cedulaInUse = await db.cliente.findUnique({
            where: { cedula },
        });

        if (cedulaInUse && cedulaInUse.id !== existingClient.id) {
            return NextResponse.json({ message: 'La cédula ya está en uso por otro cliente.' }, { status: 400 });
        }

        // Actualizar el usuario y el cliente
        await db.$transaction([
            db.usuario.update({
                where: { id: existingClient.usuarioId },
                data: {
                    email,
                    nombre,
                    apellido,
                },
            }),
            db.cliente.update({
                where: { id: clientId },
                data: {
                    cedula,
                    coordenadas,
                },
            }),
        ]);

        return NextResponse.json({ message: 'Cliente actualizado exitosamente.' });
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
    }
}
