import { Box, CardActionArea, CardMedia, Typography } from '@mui/material'
import React from 'react'

export const HomePage = () => {
    return (
        <Box sx={{
            width: '100vw',
            height: '100%',
            p: '3rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>

            <CardMedia
                component='img'
                image='https://muchomejorecuador.org.ec/wp-content/uploads/2024/06/438238735_814963247326837_1522988942741759053_n.jpg'
                sx={{
                    borderRadius: '0 1rem 1rem 0',
                    width: { xs: '5rem', md: '12rem' }, height: 'auto',
                    position: 'fixed',
                    bottom: 0,
                    left: 0
                }}
            />

            <Typography textAlign='center' sx={{ fontSize: '1.7rem' }}>Sistema nacional de información de cortes de energía</Typography>

            <Box sx={{
                my: '1rem', display: 'flex', alignItems: 'center', bgcolor: 'whitesmoke',
                boxShadow: 1, borderRadius: '2rem',
                flexDirection: { xs: 'column', md: 'row' },
                p: '1rem', width: { xs: '100%', md: '60%' }
            }}>

                <Box sx={{
                    display: 'flex', justifyContent: 'center', flexDirection: 'column',
                    alignItems: 'center', width: '100%'
                }}>

                    <CardMedia
                        component='img'
                        image='https://images.unsplash.com/photo-1709656602966-b71944dbad64?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                        sx={{ width: { xs: '60vw', md: '40vw' }, borderRadius: '2rem' }}
                    />

                    <Box sx={{
                        my: '1rem',

                    }}>
                        <Typography textAlign='center' sx={{ fontSize: { xs: '.9rem', md: '1.2rem' }, }}>
                            Aquí podrás verificar si habrán cortes en tu sector
                        </Typography>
                        <Typography textAlign='center' sx={{ fontSize: { xs: '.9rem', md: '1.2rem' }, }}>
                            Accede con las credenciales que se te enviaron a tu correo electrónico
                        </Typography>
                    </Box>

                </Box>

                {/* boton login */}
                <CardActionArea
                    href='/auth/login'
                    sx={{
                        m: '1rem', px: '1rem', py: '2rem',
                        bgcolor: '#fd5c04', borderRadius: '1rem',
                        display: 'flex', justifyContent: 'center',
                        alignItems: 'center',
                        boxShadow: 1
                    }}>
                    <Typography sx={{ color: 'whitesmoke' }} >
                        INGRESA
                    </Typography>
                </CardActionArea>
            </Box>



        </Box>
    )
}
