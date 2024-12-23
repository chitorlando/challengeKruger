import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { ClientsTable } from './ClientsTable'

export const AdminDashboard = () => {

    return (
        <Box>

            <Box sx={{
                mt: '5rem',
                px: '15rem',
                display: 'flex',
                justifyContent: 'space-around'
            }}>

                <Button variant='contained' color='warning'>Nuevo Horario</Button>
                <Button variant='contained' color='warning' href='/admin/register-client'>Nuevo Cliente</Button>

            </Box>

            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '2rem',
                mt: '2rem',
                px: '1rem',
            }}>

                <Box
                    sx={{
                        flex: '1 1 55%',
                        minWidth: '300px',
                        maxWidth: '40vw',
                    }}
                >
                    <Typography sx={{ my: '2rem' }} textAlign="center">
                        Lista de Horarios
                    </Typography>
                    <ClientsTable />
                </Box>

                {/* Tabla de clientes */}
                <Box
                    sx={{
                        flex: '1 1 55%',
                        minWidth: '300px',
                        maxWidth: '40vw',
                    }}
                >
                    <Typography sx={{ my: '2rem' }} textAlign="center">
                        Lista de Clientes
                    </Typography>
                    <ClientsTable />
                </Box>

            </Box>


        </Box>
    )
}
