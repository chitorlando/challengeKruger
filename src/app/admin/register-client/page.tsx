import { RegisterOrUpdateClient } from '@/components/RegisterOrUpdateClient'
import { Box } from '@mui/material'
import React from 'react'

const RegisterClientPage = () => {
    return (
        <Box sx={{
            mt: '4rem',
            px: '15rem'
        }}>
            <RegisterOrUpdateClient />
        </Box>
    )
}

export default RegisterClientPage