'use client'
import { Header } from '@/components/Header';
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
        if (status === 'loading') return;
        if (!session || session.user.role !== 'CLIENTE') {
            router.push('/auth/login');
        }
    }, [session, status, router]);

    if (status === 'loading' || !session) return <VerifyAccess />;

    return (
        <Box>
            <Header />
            {children}
        </Box>
    )
}