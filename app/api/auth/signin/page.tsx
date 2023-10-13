"use client"
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function login({ searchParams }: { searchParams: { callbackUrl: string } }) {
  const username = useRef("");
  const password = useRef("");
  const router = useRouter();

  async function handleSubmit() {
    const result = await signIn("credentials", {
      username: username.current,
      password: password.current,
      redirect: true,
      callbackUrl: searchParams.callbackUrl,
    });
  }

  async function handleGoogleSubmit() {
    const result = await signIn("google", {
      redirect: true,
      callbackUrl: searchParams.callbackUrl
    });
  }

  return (
    <div className="text-orange-200 h-screen">
      <div className="absolute flex flex-col px-6 py-4 transform -translate-x-1/2 -translate-y-1/2 w-72 bg-sky-800 top-1/2 left-1/2 rounded-2xl">
        <button 
          className="btn flex items-center gap-4"
          onClick={handleGoogleSubmit}
        >
          <img loading="lazy" height="24" width="24" id="provider-logo" src="https://authjs.dev/img/providers/google.svg" />
          Login with Google
        </button>

        <hr className="border-main-darkest my-6"/>

        <label className="block rounded-md" htmlFor="register-user">User:</label>
        <input maxLength={25} className="block mb-2 rounded-md quiz-input" id="register-user" type="text" name="register-user" onChange={e => { username.current = e.target.value }} autoFocus spellCheck={false} />

        <label className="block rounded-md" htmlFor="register-password">Password:</label>
        <input maxLength={40} className="block rounded-md quiz-input mb-3" id="register-password" type="password" name="register-password" onChange={e => { password.current = e.target.value }} />

        <button className="btn mb-3" onClick={handleSubmit}>
          Login
        </button>
        <button className="btn" onClick={() => router.push("/register")}>Registration</button>
      </div>
    </div>
  );
}