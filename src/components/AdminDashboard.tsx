import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { ClientsTable } from './ClientsTable'
import { ScheduleTable } from './ScheduleTable'

export const AdminDashboard = () => {

    return (
        <Box>

            <Box sx={{
                mt: '5rem',
                px: { md: '12rem' },
                display: 'flex',
                justifyContent: 'space-around'
            }}>

                <Button variant='contained' color='warning' href='/admin/register-schedule'>Nuevo Horario</Button>
                <Button variant='contained' color='warning' href='/admin/register-client'>Nuevo Cliente</Button>

            </Box>

            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '1rem',
                px: '1rem',
            }}>

                <Box
                    sx={{
                        flex: '1 1 55%',
                        minWidth: '300px',
                        maxWidth: { xs: '90vw', md: '40vw' },
                    }}
                >
                    <Typography sx={{ my: '2rem' }} textAlign="center">
                        Lista de Horarios
                    </Typography>
                    <ScheduleTable />
                </Box>

                {/* Tabla de clientes */}
                <Box
                    sx={{
                        flex: '1 1 55%',
                        minWidth: '300px',
                        maxWidth: { xs: '90vw', md: '40vw' },
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
