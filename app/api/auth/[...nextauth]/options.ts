import type { Account, NextAuthOptions, Profile, User } from "next-auth";
import Credentials, { CredentialInput } from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts"
import { decode } from "base32"
import GoogleProvider from "next-auth/providers/google"
import { AdapterUser } from "next-auth/adapters";
import { prisma } from "@/components/prisma";




async function getUserHash(user:string) {
  const result = await (await fetch(
    `${process.env.NEXTAUTH_URL}/api/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({name: user}),
    }
  )).json();
  if (typeof result.bcryptHash === "string") {
    return result as { id: number, name: string, bcryptHash: string };
  } else {
    return null;
  }
}

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),

    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (typeof credentials?.password === "string" && typeof process.env.BCRYPT_HASH === "string") {
          if (credentials?.username === "admin" && compareSync(credentials.password, decode(process.env.BCRYPT_HASH))) {
            return {
              id: "0",
              name: "admin",
              email: "hr82al@gmail.com"
            };
          }

          const user = await getUserHash(credentials.username);
          if (user === null) {
            return null;
          }
          if (compareSync(credentials.password, user.bcryptHash)) {
            return {
              id: String(user.id),
              name: user.name
            }
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn(
      params: {
        user: User | AdapterUser
        account: Account | null
        profile?: Profile
        email?: {
          verificationRequest?: boolean
        }
        credentials?: Record<string, CredentialInput>
      }) {
        if (typeof params.user.email === "string" && typeof params.user.name === "string"){
          try {
            await prisma.user.create({
              data: {
                name: params.user.name,
                bcryptHash: "",
                email: params.user.email,
              }
            })
          } catch (error) {
            
          }
        }
      return true;
    }
  }
}
