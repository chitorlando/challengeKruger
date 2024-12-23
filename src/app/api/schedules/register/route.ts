import { NextResponse } from "next/server";
import db from '@/libs/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { nombreSector, horaInicio, horaFin, poligono } = body;

        // Validaciones básicas
        if (!nombreSector || !horaInicio || !horaFin || !poligono) {
            return NextResponse.json(
                { message: 'Todos los campos son obligatorios.' },
                { status: 400 }
            );
        }

        // Inserción en la base de datos
        const newSchedule = await db.horario.create({
            data: {
                nombreSector,
                horaInicio,
                horaFin,
                poligono,
            },
        });

        return NextResponse.json({
            message: 'Horario creado exitosamente.',
            horario: newSchedule,
        });
    } catch (error) {
        console.error('Error al crear el horario:', error);
        return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
    }
}
