"use client"

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const session = useSession();
  return (
    <>
      <nav className="flex items-center justify-between w-full h-16 mb-4 bg-sky-900"
      >
        <img src="/logo.svg" className="h-12 ml-4" alt="" />
        <ul className="flex gap-4 mx-4">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/learn">Learn</Link></li>

          {session.data ? (
            <>
              <li><Link href="/admin/quiz_list">Quizzes list</Link></li>
              <li><Link href="/admin/quiz">Quiz</Link></li>
              <Link href="#" onClick={() => signOut()}>Sign Out</Link>
            </>
          ) : (
            <Link href="#" onClick={() => signIn()}>Sign In</Link>
          )}
          <li>{session.data?.user?.name}</li>
        </ul>
      </nav>
    </>
  )
}