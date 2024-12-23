'use client';

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';


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

const MapComponent = ({ setCoordinates }: { setCoordinates: (coords: string) => void }) => {
    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);

    const MapClickHandler = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setMarkerPosition([lat, lng]);
                setCoordinates(`${lat},${lng}`); 
            },
        });
        return null;
    };

    return (
        <MapContainer
            center={[-0.1807, -78.4678]}
            zoom={13}
            style={{ height: '500px', width: '100%', borderRadius: '2rem' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapClickHandler />
            {markerPosition && <Marker position={markerPosition} />}
        </MapContainer>
    );
};

export default MapComponent;
