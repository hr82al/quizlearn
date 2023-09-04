"use client"

import { useIsAdmin } from "@/redux/features/card/utils";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";


export default function Navbar() {
  const session = useSession();
  const isAdmin = useIsAdmin();
  return (
    <>
      <nav className="flex items-center justify-between w-full h-16 mb-4 bg-sky-900"
      >
        <Image src="/logo.svg" className="h-12 ml-4" alt="" />
        <ul className="flex gap-4 mx-4">
          <li><Link href="/learn">learn</Link></li>
          {isAdmin ? (
            <>
              <li><Link href="/admin/quiz_list">Quizzes list</Link></li>
              <li><Link href="/admin/quiz">Quiz</Link></li>

            </>
          ) : (
            ""
          )}
          {session.data ? (
            <Link href="#" onClick={() => signOut()}>Logout</Link>
          ) : (
            <>
              <Link href="/register">Register</Link>
              <Link href="#" onClick={() => signIn()}>Login</Link>
            </>
          )}
          <li className="text-teal-200">{session.data?.user?.name}</li>
        </ul>
      </nav>
    </>
  )
}