'use client';

import { SessionProvider } from 'next-auth/react';

export default function CustomProviders({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
}
