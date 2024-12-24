'use client'

import { Alert, Box, Button, CardMedia, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { signIn, useSession } from 'next-auth/react'
import { Session } from 'next-auth'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useRouter } from 'next/navigation';
import { VerifyAccess } from '@/components/VerifyAccess'

const LoginPage = () => {

    const { data: session, status } = useSession() as { data: Session & { user: { role: string } } | null, status: string };

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const { register, handleSubmit } = useForm();

    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Redirigir por sesion
    useEffect(() => {
        if (status === 'loading') return; // Esperar a que la sesión se cargue

        if (session) {

            if (session.user!.role === 'ADMINISTRADOR') {
                router.push('/admin/dashboard'); // Redirigir al panel de administrador
            } else if (session.user!.role === 'CLIENTE') {
                router.push('/cliente/dashboard'); // Redirigir al panel de cliente
            }
        }
    }, [session, status, router]);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const onSubmit = handleSubmit(async (data) => {
        const res = await signIn('credentials', {
            redirect: false,
            username: data.username,
            password: data.passwd,
        })
        if (res?.error) {
            setErrorMessage(res.error);
        } else {
            setErrorMessage(null);
            const session = await fetch('/api/auth/session').then(res => res.json());

            const role = session?.user?.role;

            if (role === 'ADMINISTRADOR') {
                router.push('/admin/dashboard'); // Ruta del administrador
            } else if (role === 'CLIENTE') {
                router.push('/cliente/dashboard'); // Ruta del cliente
            } else {
                setErrorMessage('Rol desconocido');
            }
        }
    })

    if (status === 'loading') return <VerifyAccess />;

    return (
        <Box sx={{
            height: '100vh',
            width: '100vw',
            bgcolor: 'white',
            display: 'flex',
            justifyContent: 'space-between'
        }}>
            <Box sx={{
                width: '100%', height: '100%',
                backgroundImage: `url(https://images.unsplash.com/photo-1504744373149-59d6d64c86f3?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '0 7rem 1rem 0',
                boxShadow: 5,
                position: 'relative',
                display: { xs: 'none', sm: 'block' }
            }}>
                <CardMedia
                    component='img'
                    image='https://muchomejorecuador.org.ec/wp-content/uploads/2024/06/438238735_814963247326837_1522988942741759053_n.jpg'
                    sx={{
                        borderRadius: '0 1rem 1rem 0',
                        width: '10rem', height: 'auto',
                        position: 'absolute',
                        bottom: 0,
                        right: 0
                    }}
                />
            </Box>

            <Box sx={{
                width: '100%', height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>

                <Box sx={{
                    bgcolor: 'whitesmoke',
                    borderRadius: '2rem',
                    boxShadow: 2,
                    p: '2rem'
                }}>
                    <Typography textAlign='center' sx={{ fontSize: '2rem', }}>
                        Login
                    </Typography>

                    <Box component='form'
                        onSubmit={onSubmit}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >

                        <TextField
                            id="user"
                            required
                            label="Usuario"
                            color="warning"
                            placeholder="john_doe"
                            variant="outlined"
                            sx={{ my: '1rem' }}
                            {...register('username', {
                                required: 'Este campo es obligatorio',
                                validate: (value) => {
                                    if (value.trim() !== value) {
                                        return 'El usuario no debe contener espacios al inicio o al final';
                                    }
                                    if (/\s/.test(value)) {
                                        return 'El usuario no debe contener espacios';
                                    }
                                    return true;
                                },
                                setValueAs: (value) => value?.toLowerCase().trim(),
                            })}

                        />


                        <TextField id="passwd" required
                            type={showPassword ? 'text' : 'password'}
                            placeholder='******'
                            label="Contraseña" color='warning' variant="outlined" sx={{ my: '1rem' }}
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">
                                        <IconButton
                                            aria-label={
                                                showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                                            }
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            onMouseUp={handleMouseUpPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff color='warning' /> : <Visibility color='warning' />}
                                        </IconButton>
                                    </InputAdornment>,
                                },
                            }}

                            {...register('passwd', {
                                required: 'true'
                            })}
                        />

                        <Button
                            variant='contained'
                            type='submit'
                            sx={{
                                bgcolor: '#fd5c04',
                                my: '2rem'
                            }}>
                            Ingresar
                        </Button>

                    </Box>
                </Box>

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

export default LoginPage