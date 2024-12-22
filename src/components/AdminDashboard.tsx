import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { Header } from './Header'
import { useSession } from 'next-auth/react'
import { ClientsTable } from './ClientsTable'

export const AdminDashboard = () => {

    const name = useSession().data?.user?.name;


    return (
        <Box>
            <Header title={` Administrador ${name}`} />

            <Box sx={{
                mt: '5rem',
                px: '15rem',
                display: 'flex',
                justifyContent: 'space-around'
            }}>

                <Button variant='contained' color='warning'>Nuevo Horario</Button>
                <Button variant='contained' color='warning'>Nuevo Cliente</Button>

            </Box>


            <Box sx={{
                display: 'flex',
                mt: '1rem',
                justifyContent: 'space-evenly',
            }}>

                <Box sx={{}}> <Typography sx={{ my: '2rem' }} textAlign='center'> Lista de Horarios</Typography> <ClientsTable /> </Box>
                <Box sx={{}}> <Typography sx={{ my: '2rem' }} textAlign='center'> Lista de Clientes</Typography> <ClientsTable /> </Box>

            </Box>


        </Box>
    )
}
