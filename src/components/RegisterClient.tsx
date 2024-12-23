'use client'
import { Alert, Box, Button, Grid2, TextField } from '@mui/material'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

export const RegisterClient = () => {

    const { register, handleSubmit } = useForm();

    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // const onSubmit = handleSubmit(async (data) => {
    //     const res = await fetch('/api/clients/register', {
    //         method: 'POST',
    //         body: JSON.stringify(data),
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //     const resJSON = await res.json()
    //     console.log(resJSON);
    // })

    // Función para generar el username
    const generateUsername = (nombres: string, apellidos: string, cedula: string) => {
        const namePart = nombres.split(' ')[0].toLowerCase(); // Primer nombre en minúsculas
        const lastNamePart = apellidos.split(' ')[0].toLowerCase(); // Primer apellido en minúsculas
        const cedulaPart = cedula.slice(0, 3); // Primeros 3 dígitos de la cédula
        return `${namePart}.${lastNamePart}.${cedulaPart}`;
    };

    const onSubmit = handleSubmit(async (data) => {

        // Generar automáticamente el nombre de usuario
        const username = generateUsername(data.nombres, data.apellidos, data.cedula);

        // Agregar generación automática de contraseña
        const generatedPassword = Math.random().toString(36).slice(-8); // Genera una contraseña aleatoria

        const payload = {
            ...data,
            username,
            password: generatedPassword, // Añadir la contraseña generada
        };

        const res = await fetch('/api/clients/register', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const resJSON = await res.json();
        console.log(resJSON);

        if (res.ok) {
            setErrorMessage(`Cliente registrado con éxito. Contraseña generada: ${generatedPassword}`);
            router.push('/admin/clients');
        } else {
            setErrorMessage(`Error al registrar el cliente: ${resJSON.message}`);
        }
    });

    return (
        <Box sx={{
            bgcolor: 'whitesmoke',
            borderRadius: '1rem',
            p: '1rem'
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
                        <TextField
                            label="Coordenadas"
                            color="warning"
                            placeholder="-0.1841235,-78.4872125"
                            variant="outlined"
                            fullWidth
                            required
                            disabled
                            {...register('coordenadas', { required: true })}
                        />
                    </Grid2>

                </Grid2>

                <Button
                    variant='contained'
                    type='submit'
                    sx={{
                        bgcolor: '#fd5c04',
                        my: '2rem'
                    }}>
                    Ingresar
                </Button>

                {errorMessage && (
                    <Alert
                        sx={{
                            position: 'fixed',
                            top: '1rem',
                            right: '1rem',
                        }}
                        severity="warning"
                        variant="filled"
                        onClose={() => setErrorMessage(null)}
                    >
                        {errorMessage}
                    </Alert>
                )}

            </Box>
        </Box>
    )
}
