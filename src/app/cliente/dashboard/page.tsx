'use client'

import { ClientDashboard } from '@/components/ClientDashboard'
import { Alert, CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'

const ClientDashboardPage = () => {

    const [userCoordinates, setUserCoordinates] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserCoordinates = async () => {
            try {
                const response = await fetch('/api/clients/profile');
                if (!response.ok) {
                    throw new Error('No se pudo obtener el perfil del cliente.');
                }

                const data = await response.json();
                setUserCoordinates(data.coordenadas);
            } catch (error) {
                console.error('Error al obtener las coordenadas del usuario:', error);
                setErrorMessage('Error al obtener el perfil del cliente.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserCoordinates();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    if (errorMessage) {
        return <Alert severity="error">{errorMessage}</Alert>;
    }

    if (!userCoordinates) {
        return (
            <Typography>
                No se encontraron coordenadas para el cliente. Por favor, contacte con el administrador.
            </Typography>
        );
    }

    return (
        <ClientDashboard userCoordinates={userCoordinates} />
    )
}

export default ClientDashboardPage