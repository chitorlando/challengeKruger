import { NextResponse } from "next/server";
import db from "@/libs/db";

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

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
