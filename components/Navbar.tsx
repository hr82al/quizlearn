"use client"

import { useIsAdmin } from "@/redux/features/card/utils";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";


export default function Navbar({ children }: { children?: React.ReactNode}) {
  const session = useSession();
  const isAdmin = useIsAdmin();
  return (
    <>
      <nav className="flex items-center justify-between w-full h-16 mb-4 bg-sky-900"
      >
        <Link className="pr-8" href="/">
          <Image src="/logo.svg" width={48} height={48} priority={true} className="ml-4" alt="Site logo" />
        </Link>
        { children }
        <ul className="flex gap-4 mx-4">
          {session.data ? (
            <p></p>
          ) : (
            <>
              <Link href="/register">Register</Link>
              <Link href="#" onClick={() => signIn()}>Login</Link>
            </>
          )}
          { typeof session.data?.user?.name === "string" &&
          (<Link href="#" onClick={() => signOut()}>
            <li className="text-teal-200">{session.data?.user?.name}</li>
          </Link>)}
        </ul>
      </nav>
    </>
  )
}