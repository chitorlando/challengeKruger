'use client'

import { Box, Button, CardMedia, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useRouter } from 'next/navigation';

const LoginPage = () => {

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const { register, handleSubmit } = useForm();

    const router = useRouter();

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    //! aqui copiar el handle para nuevos usuarios
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

    const onSubmit = handleSubmit(async (data) => {
        const res = await signIn('credentials', {
            redirect: false,
            username: data.username,
            password: data.passwd,
        })
        if (res?.error) {
            alert(res.error);
        } else {
            const session = await fetch('/api/auth/session').then(res => res.json());
            console.log(session);

            const role = session?.user?.role;

            if (role === 'ADMINISTRADOR') {
                router.push('/admin/dashboard'); // Ruta del administrador
            } else if (role === 'CLIENTE') {
                router.push('/cliente/dashboard'); // Ruta del cliente
            } else {
                alert('Rol desconocido.');
            }
        }
    })

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
                position: 'relative'
            }}>
                <CardMedia
                    component='img'
                    image='https://muchomejorecuador.org.ec/wp-content/uploads/2024/06/438238735_814963247326837_1522988942741759053_n.jpg'
                    sx={{
                        borderRadius: '0 1rem 1rem 0',
                        width: '12rem', height: 'auto',
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
                alignItems: 'center'
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

                        <TextField id="user" required label="Usuario" color='warning' placeholder='john_doe' variant="outlined" sx={{ my: '1rem' }}
                            {...register('username', {
                                required: 'true'
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

            </Box>
        </Box>
    )
}

export default LoginPage