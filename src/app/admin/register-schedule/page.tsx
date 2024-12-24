import { RegisterOrUpdateSchedule } from '@/components/RegisterOrUpdateSchedule'
import { Box } from '@mui/material'
import React from 'react'

const RegisterSchedulePage = () => {
    return (
        <Box sx={{
            mt: '4rem',
            px: {
                xs: '1rem',
                md: '12rem'
            }
        }}>
            <RegisterOrUpdateSchedule />
        </Box>
    )
}

export default RegisterSchedulePage