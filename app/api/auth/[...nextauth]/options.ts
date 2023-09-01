import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts"
import { decode } from "base32"

const log = console.log;

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
  if (typeof result.bcrypt_hash === "string") {
    return result as { id: number, name: string, bcrypt_hash: string };
  } else {
    return null;
  }
}

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
          if (typeof credentials?.password === "string") {
            const user = await getUserHash(credentials.username);
            if (user === null) {
              return null;
            }
            if (compareSync(credentials.password, user.bcrypt_hash)) {
              return user;
            }
          }
        }       
          return null;
      },
    }),
  ],
}
