'use client'
import { Alert, Box, Button, Grid2, InputLabel, TextField } from '@mui/material'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import MapComponent from './MapComponent';
import { sendEmail } from '@/libs/emailService';

export const RegisterClient = () => {

    const { register, handleSubmit, setValue } = useForm();

    const router = useRouter();
    const [coordinates, setCoordinates] = useState<string | null>(null);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Función para generar el username
    const generateUsername = (nombre: string, apellido: string, cedula: string) => {
        const namePart = nombre.split(' ')[0].toLowerCase(); // Primer nombre en minúsculas
        const lastNamePart = apellido.split(' ')[0].toLowerCase(); // Primer apellido en minúsculas
        const cedulaPart = cedula.slice(-3); // Tres últimos dígitos de la cédula
        return `${namePart}.${lastNamePart}.${cedulaPart}`;
    };

    const onSubmit = handleSubmit(async (data) => {
        // Generar automáticamente el nombre de usuario
        const username = generateUsername(data.nombre, data.apellido, data.cedula);

        // Agregar generación automática de contraseña
        const generatedPassword = Math.random().toString(36).slice(-8); // Genera una contraseña aleatoria

        const payload = {
            ...data,
            username,
            password: generatedPassword,
            coordenadas: coordinates,
        };

        const res = await fetch('/api/clients/register', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const resJSON = await res.json();

        if (res.ok) {
            const emailSent = await sendEmail(data.email, username, generatedPassword);
            if (emailSent) {
                setErrorMessage('Usuario creado y correo enviado con éxito');
            } else {
                setErrorMessage('Usuario creado, pero no se pudo enviar el correo.');
            }
            router.push('/admin/dashboard');
        } else {
            setErrorMessage(`Error al registrar el cliente: ${resJSON.message}`);
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
                            label="Nombre"
                            color="warning"
                            placeholder="John"
                            variant="outlined"
                            fullWidth
                            required
                            {...register('nombre', { required: true })}
                        />

                    </Grid2>

                    {/* Apellidos */}
                    <Grid2 size={6} >
                        <TextField
                            label="Apellido"
                            color="warning"
                            placeholder="Doe"
                            variant="outlined"
                            fullWidth
                            required
                            {...register('apellido', { required: true })}
                        />
                    </Grid2>

                    {/* Email */}
                    <Grid2 size={6} >
                        <TextField
                            label="Correo electrónico"
                            color="warning"
                            placeholder="johndoe@email.com"
                            variant="outlined"
                            fullWidth
                            required
                            {...register('email', { required: true })}
                        />
                    </Grid2>

                    {/* Cédula */}
                    <Grid2 size={6} >
                        <TextField
                            label="Cédula"
                            color="warning"
                            placeholder="1234567890"
                            variant="outlined"
                            fullWidth
                            required
                            {...register('cedula', { required: true })}
                        />
                    </Grid2>

                    {/* Coordenadas */}
                    <Grid2 size={6} >
                        <InputLabel htmlFor="component-simple">Coordenadas de domicilio</InputLabel>
                        <TextField
                            helperText="Haz clic en el mapa para seleccionar las coordenadas"
                            color="warning"
                            placeholder="-0.1841235,-78.4872125"
                            variant="outlined"
                            fullWidth
                            required
                            disabled
                            {...register('coordenadas', { required: true })}
                        />
                    </Grid2>

                    {/* Mapa */}
                    <Grid2 size={12} sx={{ boxShadow: 3, borderRadius: '2rem' }} >
                        <MapComponent setCoordinates={(coords) => {
                            setCoordinates(coords); // Actualizar estado local
                            setValue('coordenadas', coords); // Actualizar campo del formulario
                        }} />
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
                        Insertar
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
