/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: int | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null; // Agregamos role
    };
  }

  interface User {
    id?: int; // id agregado al tipo User
    role?: string; // Role agregado al tipo User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: int;
    role?: string; // Role agregado al token
  }
}

