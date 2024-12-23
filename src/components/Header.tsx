'use client'
import { Box, Button, CardMedia, Link, Typography } from "@mui/material"
import { signOut, useSession } from "next-auth/react";

import { useEffect, useState } from "react"

export const Header = () => {

    const name = useSession().data?.user?.name;

    const title = `Bienvenido ${name}`;

    const [scroll, setScroll] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 30; // Cambia según el umbral deseado
            setScroll((prev) => prev !== isScrolled ? isScrolled : prev);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <Box
            sx={{
                position: 'sticky',
                top: 0,
                zIndex: 16,
                mt: '3rem',
                display: 'flex',
                justifyContent: { xs: 'center', md: 'center' },
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    ml: { xs: '.35rem', md: '0' },
                    bgcolor: 'rgba( 213, 216, 220,.4)',
                    width: { xs: scroll ? '70vw' : '80vw', md: scroll ? '40vw' : '55vw', lg: scroll ? '30vw' : '40vw' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    py: '.5rem',
                    borderRadius: 9,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        bgcolor: 'inherit',
                        backdropFilter: 'blur(7px)'
                    }}
                />
                <Box
                    sx={{
                        width: '100%',
                        display: ' flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        position: 'relative',
                        zIndex: 1,
                        px: '.5rem'
                    }}
                >
                    
                    <Link href={'/'}>
                        <CardMedia
                            component='img'
                            image='https://muchomejorecuador.org.ec/wp-content/uploads/2024/06/438238735_814963247326837_1522988942741759053_n.jpg'
                            sx={{
                                width: 'auto', height: '3rem',
                                borderRadius: '2rem'
                            }}
                        />
                    </Link>

                    <Typography>
                        {title}
                    </Typography>

                    <Button color="warning"
                        onClick={handleSignOut}
                    >
                        Cerrar Sesión
                    </Button>

                </Box>
            </Box>


        </Box>
    )
}