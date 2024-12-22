import { Box, CardMedia, Typography } from '@mui/material'
import React from 'react'

export const VerifyAccess = () => {
    return (
        <Box sx={{
            width: '100vw',
            height: '100vh',
            bgcolor: '#fd5c04',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>

            <CardMedia
                component='img'
                image='/assets/policia.png'
                sx={{
                    width: { xs: '80vw', md: '30vw' },
                    height: 'auto',
                    mb: '2rem'
                }}
            />

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white'
            }}>

                <Typography>
                    Aguarda
                </Typography>

                <Typography>
                    Te busco en la lista, verificando acceso....
                </Typography>

            </Box>

        </Box>
    )
}
