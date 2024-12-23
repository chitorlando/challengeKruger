import { NextResponse } from "next/server";
import db from "@/libs/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json(
                { message: "No autenticado." },
                { status: 401 }
            );
        }

        // Buscar el usuario en la base de datos
        const user = await db.usuario.findUnique({
            where: { email: session.user.email },
            include: { Cliente: true },
        });

        if (!user || !user.Cliente) {
            return NextResponse.json(
                { message: "Cliente no encontrado." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            coordenadas: user.Cliente.coordenadas,
        });
    } catch (error) {
        console.error("Error al obtener el perfil del cliente:", error);
        return NextResponse.json(
            { message: "Error interno del servidor." },
            { status: 500 }
        );
    }
}
