import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents } from 'react-leaflet';
import { LatLngExpression, LatLngTuple, } from 'leaflet';
import L from 'leaflet';

interface MapPoligonComponentProps {
    setCoordinates: (coords: string | null) => void;
    clearMarkers: boolean; // Bandera para limpiar marcadores
    onClearMarkersHandled: () => void; // Notifica cuando los marcadores son limpiados
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

const MapPoligonComponent: React.FC<MapPoligonComponentProps> = ({ setCoordinates, clearMarkers, onClearMarkersHandled }) => {
    const [markers, setMarkers] = useState<LatLngTuple[]>([]);

    // Manejar clics en el mapa
    const MapClickHandler = () => {
        useMapEvents({
            click: (e) => {
                const newMarker: LatLngExpression = [e.latlng.lat, e.latlng.lng];
                setMarkers((prev) => [...prev, newMarker]);
            },
        });
        return null;
    };

    // Generar string de coordenadas para el formulario
    const generateCoordinatesString = (coords: LatLngTuple[]) => {
        return coords.map((coord) => `(${coord[0]},${coord[1]})`).join(',');
    };

    // Actualizar las coordenadas en el formulario
    useEffect(() => {
        if (markers.length >= 3) {
            const coordsString = generateCoordinatesString(markers);
            setCoordinates(coordsString); // Actualiza el estado en el formulario
        } else {
            setCoordinates(null);
        }
    }, [markers, setCoordinates]);


    // Limpiar los marcadores si se activa `clearMarkers`
    useEffect(() => {
        if (clearMarkers) {
            setMarkers([]);
            onClearMarkersHandled();
        }
    }, [clearMarkers, onClearMarkersHandled]);


    return (
        <MapContainer
            center={[-0.180653, -78.467834]}
            zoom={13}
            style={{ height: '400px', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Manejar clics en el mapa */}
            <MapClickHandler />
            {/* Dibujar el polígono */}
            {markers.length >= 3 && <Polygon positions={markers} />}
            {/* Mostrar marcadores */}
            {markers.map((marker, index) => (
                <Marker key={index} position={marker} />
            ))}
        </MapContainer>
    );
};

export default MapPoligonComponent;
