'use client'

import { AdminDashboard } from '@/components/AdminDashboard';
import { VerifyAccess } from '@/components/VerifyAccess';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const AdminDashboardPage = () => {

    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return; // Esperar la carga de la sesión

        console.log(session);

        if (!session) router.push('/auth/login'); // Redirigir a login si no hay sesión

        if (session?.user?.role === 'CLIENTE') router.push('/cliente/dashboard'); // Redirigir a login si no es administrador

    }, [session, status, router]);

    if (status === 'loading' || !session) return <VerifyAccess />;


    return <AdminDashboard />

}

export default AdminDashboardPage