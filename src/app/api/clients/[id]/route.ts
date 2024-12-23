import { NextResponse } from 'next/server';
import db from '@/libs/db';

export async function DELETE(request: Request,  { params }: {params: Promise<{id:string}> }) {
    try {
        const { id } = await params;

        // Verifica si el cliente existe antes de eliminar
        const existingClient = await db.cliente.findUnique({
            where: { id: parseInt(id) },
            include: {
                usuario: true, // Incluye el usuario asociado para eliminarlo
            },
        });

        if (!existingClient) {
            return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
        }

        // Usamos una transacción para eliminar al cliente y al usuario asociado
        await db.$transaction([
            db.cliente.delete({
                where: { id: parseInt(id) },
            }),
            db.usuario.delete({
                where: { id: existingClient.usuarioId },
            }),
        ]);

        return NextResponse.json({ message: 'Cliente y usuario asociado eliminados correctamente' });
    } catch (error) {
        console.error('Error al eliminar el cliente y usuario asociado:', error);
        return NextResponse.json({ error: 'Error al eliminar el cliente y usuario asociado' }, { status: 500 });
    }
}

export async function GET(request: Request, { params }: {params: Promise<{id:string}> } ) {
    try {
        const clientId = parseInt((await params).id);

        // Buscar cliente y usuario relacionado
        const client = await db.cliente.findUnique({
            where: { id: clientId },
            include: { usuario: true }, // Incluye los datos del usuario relacionado
        });

        if (!client) {
            return NextResponse.json({ message: 'Cliente no encontrado.' }, { status: 404 });
        }

        // Formatear los datos para el frontend
        return NextResponse.json({
            id: client.id,
            cedula: client.cedula,
            coordenadas: client.coordenadas,
            nombre: client.usuario.nombre,
        });
    } catch (error) {
        console.error('Error al obtener el cliente:', error);
        return NextResponse.json({ error: 'Error al obtener el cliente' }, { status: 500 });
    }
}

// Editar un cliente por su ID
export async function PUT(req: Request, { params }: {params: Promise<{id:string}> }) {
    const body = await req.json();
    const { email, nombre, apellido, cedula, coordenadas } = body;

    try {
        const clientId = parseInt((await params).id);

        // Verificar si el cliente existe y obtener su usuario asociado
        const existingClient = await db.cliente.findUnique({
            where: { id: clientId },
            include: { usuario: true }, // Incluye los datos del usuario relacionado
        });

        if (!existingClient) {
            return NextResponse.json({ message: 'Cliente no encontrado.' }, { status: 404 });
        }

        // Validar si el correo o la cédula están en uso por otro cliente/usuario
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

        // Actualizar cliente y usuario en una transacción
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

        return NextResponse.json({ message: 'Cliente y usuario asociados actualizados exitosamente.' });
    } catch (error) {
        console.error('Error al actualizar cliente y usuario:', error);
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
    }
}
