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
                mt: '1rem',
                justifyContent: 'space-evenly',
            }}>

                <Box> <Typography sx={{ my: '2rem' }} textAlign='center'> Lista de Horarios</Typography> <ClientsTable /> </Box>
                <Box> <Typography sx={{ my: '2rem' }} textAlign='center'> Lista de Clientes</Typography> <ClientsTable /> </Box>

            </Box>


        </Box>
    )
}
