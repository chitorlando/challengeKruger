'use client'
import { VerifyAccess } from '@/components/VerifyAccess';
import { Box } from '@mui/material'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

export default function ClientLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return; // Esperar la sesión
        if (!session || session.user.role !== 'CLIENTE') {
            router.push('/auth/login'); // Redirigir si no es administrador
        }
    }, [session, status]);

    if (status === 'loading' || !session) return <VerifyAccess />;

    return (
        <Box>
            {children}
        </Box>
    )
}