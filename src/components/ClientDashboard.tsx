'use client'

import { Alert, Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ReadOnlyMapPoligonComponent from './ReadOnlyMapPoligonComponent'
import { LatLngTuple } from 'leaflet'

export const ClientDashboard = ({ userCoordinates }: { userCoordinates: string }) => {

    const [sector, setSector] = useState<null | { nombreSector: string; horaInicio: string; horaFin: string; poligono: string }>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchSector = async () => {
            try {
                const response = await fetch('/api/schedules/sector', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        coordinates: userCoordinates.split(',').map(Number), // Parsear las coordenadas del usuario
                    }),
                });

                if (!response.ok) {
                    setErrorMessage('No hay cortes programados para su sector.');
                    return;
                }

                const data = await response.json();
                setSector(data);
            } catch (error) {
                console.error('Error al buscar el sector:', error);
                setErrorMessage('Error al buscar el sector. Intente nuevamente más tarde.');
            }
        };

        fetchSector();
    }, [userCoordinates]);

    if (errorMessage) {
        return <Alert sx={{ m: '5rem' }} severity="warning">{errorMessage}</Alert>;
    }

    if (!sector) {
        return <Typography>Cargando...</Typography>;
    }

    return (
        <Box sx={{
            mt: '5rem',
            px: '5rem',
            display: 'flex',
            justifyContent: 'space-around',
        }}>

            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '2rem',
                mt: '2rem',
                px: '1rem',
            }}>

                <Typography variant="h6">Corte Programado para su Sector</Typography>

                {sector && (
                    <Box>
                        <Typography>Sector: {sector?.nombreSector}</Typography>
                        <Typography>Hora de Inicio: {sector?.horaInicio}</Typography>
                        <Typography>Hora de Fin: {sector?.horaFin}</Typography>
                    </Box>
                )}

                <Box sx={{
                    width: 'auto', heigh: 'auto', borderRadius: '2rem',
                    boxShadow: 2, overflow: 'hidden'
                }}>
                    <ReadOnlyMapPoligonComponent
                        polygons={[sector.poligono]} // El polígono del sector
                        userCoordinates={userCoordinates.split(',').map(Number) as LatLngTuple} // Coordenadas del usuario
                    />
                </Box>

            </Box>

        </Box>

    )
}
