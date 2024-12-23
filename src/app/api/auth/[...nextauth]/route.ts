/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { NextAuthOptions, Session } from "next-auth"
//nextaAuth con usuario y contraseña
import CredentialsProvider from "next-auth/providers/credentials"

import db from '@/libs/db'
import bcrypt from 'bcrypt'
import { JWT } from "next-auth/jwt";

const authOptions: NextAuthOptions = {
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
        async session({ session, token }: { session: Session, token: JWT }) {
            if (token && session.user) {
                session.user = {
                    ...session.user,
                    id: token.id || null,
                    role: token.role || null
                };
            }
            return session;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async jwt({ token, user }: { token: JWT, user?: any }) {
            if (user) {
                token.id = user.id; 
                token.role = user.role || null; // Incluye valores por defecto si es necesario
            }
            return token;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
