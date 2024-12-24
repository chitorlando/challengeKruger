import { NextResponse } from "next/server";
import db from "@/libs/db";

//obtener los horarios
export async function GET() {
    try {
        const schedules = await db.horario.findMany();
        return NextResponse.json(schedules);
    } catch (error) {
        console.error("Error al obtener los horarios:", error);
        return NextResponse.json(
            { message: "Error al obtener los horarios" },
            { status: 500 }
        );
    }
}
