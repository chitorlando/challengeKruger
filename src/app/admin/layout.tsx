'use client'
import { Header } from '@/components/Header'
import { VerifyAccess } from '@/components/VerifyAccess';
import { Box } from '@mui/material'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return; // Esperar la sesión
        if (!session || session.user.role !== 'ADMINISTRADOR') {
            router.push('/auth/login'); // Redirigir si no es administrador
        }
    }, [session, status]);

    if (status === 'loading' || !session) return <VerifyAccess />;

    return (
        <Box>
            <Header />
            {children}
        </Box>
    )
}