import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compareSync, hashSync } from "bcrypt-ts"
import { decode } from "base32"

export const options: NextAuthOptions = {
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (typeof credentials?.password === "string" && typeof process.env.BCRYPT_HASH === "string") {
          const user = { id: "1", name: "admin"};
          const hash = decode(process.env.BCRYPT_HASH);
          const isPasswordValid = compareSync(credentials.password, hash);
          if (credentials?.username === user.name && isPasswordValid) {
            return user
          }
        }       
          return null;
      },
    }),
  ],
}
