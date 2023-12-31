"use client"

import { useSession, signIn, signOut } from "next-auth/react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";


const poppins = Poppins({ weight: "400", subsets: ["latin-ext"] });


export default function Navbar({ children }: { children?: React.ReactNode}) {
  const session = useSession();


  return (
    <>
      <nav className={`flex items-center justify-between w-full h-16 mb-2 bg-sky-900 ${poppins.className}`}
      >
        <Link className="pr-8" href="/">
          <Image src="/logo.svg" width={48} height={48} priority={true} className="ml-4" alt="Site logo" />
        </Link>
        { children }
        <ul className="flex gap-4 mx-4 text-lg">
          {session.data ? (
            <>
            </>
          ) : (
            <>
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