import { NextResponse } from "next/server";
import db from "@/libs/db";

//busca un punto en un poligono
function isPointInPolygon(point: [number, number], polygon: string): boolean {
    const coords = polygon
        .slice(1, -1) 
        .split("),(")
        .map((coord) => coord.split(",").map(Number) as [number, number]);

    let inside = false;
    for (let i = 0, j = coords.length - 1; i < coords.length; j = i++) {
        const [xi, yi] = coords[i];
        const [xj, yj] = coords[j];
        const intersect =
            yi > point[1] !== yj > point[1] &&
            point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
    }
    return inside;
}

//funcion para hacer match al marcador con el poligono
export async function POST(req: Request) {
    try {
        console.log(req);
        
        const { coordinates } = await req.json();

        if (!coordinates || coordinates.length !== 2) {
            return NextResponse.json(
                { message: "Coordenadas inválidas" },
                { status: 400 }
            );
        }

        const [lat, lng] = coordinates;

        const schedules = await db.horario.findMany();
        
        //busca el sector en el que se encuentra el marcador
        for (const schedule of schedules) {
            if (isPointInPolygon([lat, lng], schedule.poligono)) {
                return NextResponse.json(schedule);
            }
        }

        return NextResponse.json({ message: "No hay cortes programados" }, { status: 404 });
    } catch (error) {
        console.error("Error al buscar sector:", error);
        return NextResponse.json(
            { message: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
