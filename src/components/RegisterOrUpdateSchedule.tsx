'use client'

import { Box, Grid2, TextField, InputLabel, Button, Alert } from '@mui/material';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import MapPoligonComponent from './MapPoligonComponent';
import { useRouter } from 'next/navigation';

export const RegisterOrUpdateSchedule = () => {

    const router = useRouter();
    const { register, handleSubmit, setValue,
        formState: { errors }
    } = useForm();
    const [poligono, setPoligono] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [clearMarkers, setClearMarkers] = useState<boolean>(false);

    const onSubmit = handleSubmit(async (data) => {

        if (!poligono) {
            setErrorMessage('Debe delimitar el sector con al menos 3 marcadores en el mapa.');
            return;
        }

        try {
            const response = await fetch('/api/schedules/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                setErrorMessage(result.message || 'Error al registrar el horario.');
                return;
            }

            setErrorMessage('Horario registrado exitosamente.');
            // Redirigir o limpiar el formulario según lo necesario
            router.push('/admin/dashboard');
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            setErrorMessage('Error interno del servidor. Inténtelo nuevamente más tarde.');
        }
    });

    return (
        <Box sx={{
            bgcolor: 'whitesmoke',
            borderRadius: '1rem',
            p: '1rem',
            mb: '2rem'
        }}>
            <Box
                component='form'
                onSubmit={onSubmit}
            >

                <Grid2 container spacing={2}>

                    {/* Nombres */}
                    <Grid2 size={6} >

                        <TextField
                            label="Hora inicio"
                            color="warning"
                            type="time"
                            variant="outlined"
                            fullWidth
                            required
                            {...register('horaInicio', {
                                required: 'La hora de inicio es obligatoria.',
                            })}
                            error={!!errors.horainicio}
                            helperText={errors.horainicio?.message as string | undefined}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />

                    </Grid2>

                    {/* Apellidos */}
                    <Grid2 size={6} >

                        <TextField
                            label="Hora fin"
                            color="warning"
                            type="time"
                            variant="outlined"
                            fullWidth
                            required
                            {...register('horaFin', {
                                required: 'La hora de fin es obligatoria.',
                            })}
                            error={!!errors.horafin}
                            helperText={errors.horafin?.message as string | undefined}
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />
                    </Grid2>

                    {/* Email */}
                    <Grid2 size={6} >
                        <TextField
                            label="Nombre Sector"
                            color="warning"
                            placeholder="Guápulo"
                            variant="outlined"
                            type='text'
                            fullWidth
                            required
                            {...register('nombreSector', { required: true })}
                        />
                    </Grid2>



                    {/* Coordenadas */}
                    <Grid2 size={12} >
                        <InputLabel htmlFor="component-simple">Coordenadas de Polígono sectorial</InputLabel>
                        <TextField
                            helperText={
                                poligono
                                    ? "Haz clic en el mapa para delimitar el sector"
                                    : "Debe delimitar el sector con al menos 3 marcadores"
                            }
                            error={!poligono}
                            color="warning"
                            placeholder="(-2.287352,-79.852948),(-2.288724,-80.045895),(-1.842009,-80.09602)"
                            variant="outlined"
                            fullWidth
                            required
                            disabled
                            value={poligono || ''}
                            {...register('poligono', { required: 'Debe delimitar el sector con al menos 3 marcadores.' })}
                        />

                    </Grid2>

                    {/* Mapa */}
                    <Grid2 size={12} sx={{ boxShadow: 3, borderRadius: '2rem', overflow: 'hidden' }} >
                        <MapPoligonComponent
                            setCoordinates={(coords) => {
                                setPoligono(coords); // Actualiza el estado local
                                setValue('poligono', coords); // Sincroniza con react-hook-form
                            }}
                            clearMarkers={clearMarkers}
                            onClearMarkersHandled={() => setClearMarkers(false)}
                        />
                    </Grid2>

                </Grid2>

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-around'
                }}>

                    <Button
                        variant='contained'
                        type='submit'
                        sx={{
                            bgcolor: '#fd5c04',
                            my: '2rem'
                        }}>
                        {/* {clientId ? 'Actualizar' : 'Insertar'} */}
                        Insertar
                    </Button>

                    <Button
                        variant="contained"
                        sx={{ bgcolor: '#fd5c04', my: '2rem' }}
                        onClick={() => setClearMarkers(true)}
                    >
                        Limpiar Marcadores
                    </Button>

                    <Button
                        variant='contained'
                        href='/admin/dashboard'
                        sx={{
                            bgcolor: '#fd5c04',
                            my: '2rem'
                        }}>
                        Cancelar
                    </Button>

                </Box>

                {
                    errorMessage && (
                        <Alert
                            sx={{
                                position: 'fixed',
                                top: '1rem',
                                right: '1rem',
                                zIndex: 50
                            }}
                            severity="warning"
                            variant="filled"
                            onClose={() => setErrorMessage(null)}
                        >
                            {errorMessage}
                        </Alert>
                    )
                }

            </Box >
        </Box >
    )

}
