/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth"
//nextaAuth con usuario y contraseña
import CredentialsProvider from "next-auth/providers/credentials"

import db from '@/libs/db'
import bcrypt from 'bcrypt'

const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Usuario", type: "text" },
                password: { label: "Contraseña", type: "password" }
            },
            async authorize(credentials: Record<"username" | "password", string > | undefined,  req) {

                const userFound = await db.usuario.findFirst({
                    where:{
                        usuario: credentials?.username
                    }
                })

                if (!credentials) throw new Error('No hay credenciales');
                
                if(!userFound) throw new Error('Usuario no encontrado');

                const matchPass = await bcrypt.compare(credentials.password, userFound?.password)
                if(!matchPass) throw new Error('Contraseña incorrecta');

                console.log(userFound);

                return {
                    id: userFound.id.toString(),
                    name: userFound.nombre,
                    email: userFound.email,
                    role: userFound.rol,
                }
                
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user.role = token.role || null; // Asegúrate de asignar un valor por defecto
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role || null; // Incluye valores por defecto si es necesario
            }
            return token;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};