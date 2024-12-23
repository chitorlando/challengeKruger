'use client'
import { Alert, Box, Button, Grid2, InputLabel, TextField } from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import MapComponent from './MapComponent';
import { sendEmail } from '@/libs/emailService';

export const RegisterOrUpdateClient = () => {

    const { register, handleSubmit, setValue,
        formState: { errors },
    } = useForm();
    const router = useRouter();
    const searchParams = useSearchParams();
    const clientId = searchParams.get('id');
    const [coordinates, setCoordinates] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Estado para indicar si estamos cargando datos del cliente
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Cargar datos del cliente en modo edición
    useEffect(() => {
        if (clientId && !isNaN(Number(clientId))) {
            setIsLoading(true);

            fetch(`/api/clients/${clientId}`)
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`Error: ${res.status} - ${res.statusText}`);
                    }
                    return res.json();
                })
                .then((data) => {
                    // Establecer los valores en el formulario
                    setValue('nombre', data.nombre);
                    setValue('apellido', data.apellido);
                    setValue('email', data.email);
                    setValue('cedula', data.cedula);
                    setValue('coordenadas', data.coordenadas);
                    setCoordinates(data.coordenadas);
                })
                .catch((error) => {
                    console.error('Error al cargar los datos del cliente:', error);
                    setErrorMessage('Error al cargar los datos del cliente.');
                })
                .finally(() => setIsLoading(false));
        }
    }, [clientId, setValue]);




    // Función para generar el username
    const generateUsername = (nombre: string, apellido: string, cedula: string) => {
        const namePart = nombre.split(' ')[0].toLowerCase(); // Primer nombre en minúsculas
        const lastNamePart = apellido.split(' ')[0].toLowerCase(); // Primer apellido en minúsculas
        const cedulaPart = cedula.slice(-3); // Tres últimos dígitos de la cédula
        return `${namePart}.${lastNamePart}.${cedulaPart}`;
    };

    const onSubmit = handleSubmit(async (data) => {
        if (!coordinates) {
            setErrorMessage(
                'Por favor, selecciona un marcador en el mapa para establecer las coordenadas de tu lugar de residencia.'
            );
            return;
        }

        let payload;
        let url;
        let method;

        if (clientId) {
            // Modo edición
            payload = {
                ...data,
                coordenadas: coordinates, // Incluye las coordenadas actualizadas
            };
            url = `/api/clients/${clientId}`;
            method = 'PUT';
        } else {
            // Modo creación
            // Generar automáticamente el nombre de usuario
            const username = generateUsername(data.nombre, data.apellido, data.cedula);

            // Generar automáticamente la contraseña
            const generatedPassword = Math.random().toString(36).slice(-8);

            payload = {
                ...data,
                username,
                password: generatedPassword,
                coordenadas: coordinates,
            };

            url = '/api/clients/register';
            method = 'POST';
        }

        try {
            const res = await fetch(url, {
                method,
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const resJSON = await res.json();

            if (res.ok) {
                if (!clientId) {
                    // Solo en creación enviamos el correo
                    if ('username' in payload && 'password' in payload) {
                        const emailSent = await sendEmail(data.email, payload.username, payload.password);
                        if (emailSent) {
                            setErrorMessage('Usuario creado y correo enviado con éxito');
                        } else {
                            setErrorMessage('Usuario creado, pero no se pudo enviar el correo.');
                        }
                    }
                } else {
                    setErrorMessage('Cliente actualizado con éxito');
                }
                router.push('/admin/dashboard');
            } else {
                setErrorMessage(`Error al ${clientId ? 'actualizar' : 'registrar'} el cliente: ${resJSON.message}`);
            }
        } catch (error) {
            console.error(`Error al ${clientId ? 'actualizar' : 'registrar'} el cliente:`, error);
            setErrorMessage(`Error al ${clientId ? 'actualizar' : 'registrar'} el cliente.`);
        }
    });

    if (isLoading) {
        return <div>Cargando datos...</div>;
    }

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
                            type='email'
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
                            {...register('cedula', {
                                required: 'La cédula es obligatoria',
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: 'La cédula debe contener exactamente 10 números',
                                },
                            })}
                            error={!!errors.cedula}
                            helperText={errors.cedula?.message?.toString()}
                            slotProps={{
                                input: {
                                    inputMode: 'numeric',
                                },
                            }}
                        />
                    </Grid2>

                    {/* Coordenadas */}
                    <Grid2 size={6} >
                        <InputLabel htmlFor="component-simple">Coordenadas de domicilio</InputLabel>
                        <TextField
                            helperText="Haz clic en el mapa para seleccionar las coordenadas de tu casa"
                            color="warning"
                            placeholder="-0.1841235,-78.4872125"
                            variant="outlined"
                            fullWidth
                            required
                            disabled
                            value={coordinates || ''}
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
                        {clientId ? 'Actualizar' : 'Insertar'}
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
