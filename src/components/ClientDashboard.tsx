'use client'

import { Alert, Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ReadOnlyMapPoligonComponent from './ReadOnlyMapPoligonComponent'
import { LatLngTuple } from 'leaflet'
import { ScheduleTable } from './ScheduleTable'
import { useSession } from 'next-auth/react'

export const ClientDashboard = ({ userCoordinates }: { userCoordinates: string }) => {

    const [sector, setSector] = useState<null | { nombreSector: string; horaInicio: string; horaFin: string; poligono: string }>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const name = useSession().data?.user?.name;

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

                {sector ? (
                    <Box>
                        <Typography variant="h6">{`${name} el corte programado para su Sector:`}</Typography>
                        <Typography>Sector: {sector?.nombreSector}</Typography>
                        <Typography>Hora de Inicio: {sector?.horaInicio}</Typography>
                        <Typography>Hora de Fin: {sector?.horaFin}</Typography>
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
                ) : (
                    <>
                        <Alert severity="warning">{errorMessage}</Alert>
                        <Typography variant="h6">{`${name} te mostramos los horarios disponibles hasta ahora:`}</Typography>
                        <ScheduleTable />
                    </>
                )}

            </Box>

        </Box>

    )
}
