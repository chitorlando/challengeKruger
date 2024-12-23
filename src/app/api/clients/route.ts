import { NextResponse } from 'next/server';
import db from '@/libs/db'

export async function GET() {
    try {
        // Obtén los clientes con sus usuarios relacionados
        const clients = await db.cliente.findMany({
            include: {
                usuario: true, // Incluye los datos del usuario
            },
        });

        const response = clients.map((client) => ({
            id: client.id,
            cedula: client.cedula,
            coordenadas: client.coordenadas,
            usuarioId: client.usuarioId,
            nombre: client.usuario.nombre,
            apellido: client.usuario.apellido,
            email: client.usuario.email,
        }));

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error al obtener los clientes:', error);
        return NextResponse.json({ error: 'Error al obtener los clientes' }, { status: 500 });
    }
}
