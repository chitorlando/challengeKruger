import { RegisterClient } from '@/components/RegisterClient'
import { Box } from '@mui/material'
import React from 'react'

const RegisterClientPage = () => {
    return (
        <Box sx={{
            mt: '4rem',
            px: '15rem'
        }}>
            <RegisterClient />
        </Box>
    )
}

export default RegisterClientPage