import { NextResponse } from "next/server";
import db from "@/libs/db";

export async function DELETE(
    req: Request,
    { params }: {params: Promise<{id:string}> }
) {
    try {
        const { id } = await params;

        // Verificar que el horario existe
        const schedule = await db.horario.findUnique({
            where: { id: parseInt(id) },
        });

        if (!schedule) {
            return NextResponse.json(
                { message: "Horario no encontrado" },
                { status: 404 }
            );
        }

        // Eliminar el horario
        await db.horario.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ message: "Horario eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar el horario:", error);
        return NextResponse.json(
            { message: "Error interno del servidor" },
            { status: 500 }
        );
    }
}


export async function GET(
    req: Request,
    { params }: {params: Promise<{id:string}> }
) {
    try {
        const { id } = await params;

        // Buscar el horario por ID
        const schedule = await db.horario.findUnique({
            where: { id: parseInt(id) },
        });

        if (!schedule) {
            return NextResponse.json(
                { message: "Horario no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(schedule);
    } catch (error) {
        console.error("Error al obtener el horario:", error);
        return NextResponse.json(
            { message: "Error interno del servidor" },
            { status: 500 }
        );
    }
}


export async function PUT(
    req: Request,
    { params }: {params: Promise<{id:string}> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { nombreSector, horaInicio, horaFin, poligono } = body;

        // Validar los datos
        if (!nombreSector || !horaInicio || !horaFin || !poligono) {
            return NextResponse.json(
                { message: "Todos los campos son obligatorios." },
                { status: 400 }
            );
        }

        // Verificar que el horario existe
        const existingSchedule = await db.horario.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingSchedule) {
            return NextResponse.json(
                { message: "Horario no encontrado" },
                { status: 404 }
            );
        }

        // Actualizar el horario
        const updatedSchedule = await db.horario.update({
            where: { id: parseInt(id) },
            data: {
                nombreSector,
                horaInicio,
                horaFin,
                poligono,
            },
        });

        return NextResponse.json({
            message: "Horario actualizado exitosamente.",
            horario: updatedSchedule,
        });
    } catch (error) {
        console.error("Error al actualizar el horario:", error);
        return NextResponse.json(
            { message: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
