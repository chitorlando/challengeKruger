import { NextResponse } from 'next/server';
import db from '@/libs/db'; // Asegúrate de que esta ruta sea la correcta hacia tu cliente de Prisma

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Verifica si el cliente existe antes de eliminar
        const existingClient = await db.cliente.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingClient) {
            return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
        }

        await db.cliente.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ message: 'Cliente eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el cliente:', error);
        return NextResponse.json({ error: 'Error al eliminar el cliente' }, { status: 500 });
    }
}
