import Credentials, { CredentialInput } from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts"
import { decode } from "base32"
import GoogleProvider from "next-auth/providers/google"
import { AdapterUser } from "next-auth/adapters";
import { hlog, prisma } from "@/components/prisma";
import { Account, NextAuthOptions, Profile, User } from "next-auth";
import { getUser } from "@/redux/features/card/utils";


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
          const user = await getUser(credentials.username, `${credentials.username}@quizlearn`);
          if (user === null) {
            return null;
          }
          if (compareSync(credentials.password, user.bcryptHash)) {
            return {
              id: String(user.id),
              name: user.name,
              email: user.email,
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
    },

    async session({ session, user, token}) {
      const tmp = (await getUser(session.user.name, session.user.email));
      if (typeof tmp?.id === "number") {
        session.user.id = tmp.id;
      }
      return session;
    },

  }
}
