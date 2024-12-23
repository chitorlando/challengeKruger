import React from 'react';
import { MapContainer, TileLayer, Polygon, Marker } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import L from 'leaflet';

interface ReadOnlyMapPoligonComponentProps {
    polygons: string[]; // Lista de polígonos representados como strings
    userCoordinates: LatLngTuple; // Coordenadas del usuario
}

// Fijar el ícono de Leaflet para evitar errores en el renderizado
if (L.Icon.Default.prototype.options) {
    delete L.Icon.Default.prototype.options.iconUrl;
    delete L.Icon.Default.prototype.options.iconRetinaUrl;
    delete L.Icon.Default.prototype.options.shadowUrl;
}
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ReadOnlyMapPoligonComponent: React.FC<ReadOnlyMapPoligonComponentProps> = ({ polygons, userCoordinates }) => {
    // Convertir las coordenadas del string a LatLngTuple[]
    const parsePolygon = (polygonString: string): LatLngTuple[] => {
        return polygonString
            .slice(1, -1) // Remover paréntesis externos
            .split('),(') // Dividir en pares de coordenadas
            .map((coord) => coord.split(',').map(Number) as LatLngTuple); // Convertir a números
    };

    return (
        <MapContainer
            center={userCoordinates}
            zoom={13}
            style={{ height: '50vh', width: '50vw' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Dibujar los polígonos */}
            {polygons.map((polygon, index) => (
                <Polygon key={index} positions={parsePolygon(polygon)} />
            ))}
            {/* Mostrar marcador en las coordenadas del usuario */}
            <Marker position={userCoordinates} />
        </MapContainer>
    );
};

export default ReadOnlyMapPoligonComponent;
