"use client"
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import Image from "next/image"

export default function Login() {
  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const error = searchParams.get("error") ?? "";
  const router = useRouter();
  const session = useSession();

  const errorUI = (error.length > 0 ? (
    <div className="text-emerald-100 text-center">Error: {error}</div>
  ) : (
    <div className="text-main-base text-opacity-0">hidden </div>
  ));

  if (session.data) {
    router.push(callbackUrl);
  }

  async function handleSubmit() {
    const result = await signIn("credentials", {
      username: username.current?.value,
      password: password.current?.value,
      redirect: true,
      callbackUrl: callbackUrl,
    });
  }

  async function handleGoogleSubmit() {
    const result = await signIn("google", {
      redirect: true,
      callbackUrl: callbackUrl,
    });
  }

  return (
    <div className="text-orange-200 h-screen">
      <div className="absolute flex flex-col px-6 py-4 transform -translate-x-1/2 -translate-y-1/2 w-72 bg-sky-800 top-1/2 left-1/2 rounded-2xl">
        <button 
          className="btn flex items-center gap-4"
          onClick={handleGoogleSubmit}
        >
          <Image height={24} width={24} alt="Google log" src="https://authjs.dev/img/providers/google.svg" />
          Login with Google
        </button>

        <hr className="border-main-darkest mt-6 mb-2"/>

        {errorUI}

        <label className="block rounded-md" htmlFor="register-user">User:</label>
        <input ref={username} maxLength={25} className="block mb-2 rounded-md quiz-input" id="register-user" type="text" name="register-user"  autoFocus spellCheck={false} />

        <label className="block rounded-md" htmlFor="register-password">Password:</label>
        <input ref={password} maxLength={40} className="block rounded-md quiz-input mb-3" id="register-password" type="password" name="register-password" />

        <button className="btn mb-3" onClick={handleSubmit}>
          Login
        </button>
        <button className="btn" onClick={() => router.push("/register")}>Registration</button>
      </div>
    </div>
  );
}