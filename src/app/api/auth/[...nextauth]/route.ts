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
                if(!matchPass) throw new Error('contra incorrecta');

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
            session.user.role = token.role; // Añadir el rol a la sesión
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role; // Incluir el rol en el token
            }
            return token;
        }
    },

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};