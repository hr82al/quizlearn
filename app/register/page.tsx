"use client"

import { ChangeEvent, MouseEventHandler, useEffect, useState } from "react";
import { hashSync } from "bcrypt-ts";
import { signIn } from "next-auth/react";

const log = console.log;
export default function Register() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [invalid, setInvalid] = useState("");
  const [isDisabled, setDisabled] = useState(false);

  function changeUser(e: ChangeEvent<HTMLInputElement>) {
    setInvalid("");
    const text = e.target.value.replaceAll(/[^a-zA-Z0-9_]/g, "");
    e.target.value = text;
    setUser(text);
  }

  function changePassword(e: ChangeEvent<HTMLInputElement>) {
    setInvalid("");
    const text = e.target.value.replaceAll(/[^a-zA-Z0-9_]/g, "");
    if (text.length !== e.target.value.length) {
      setInvalid(`Wrong char "${e.target.value.slice(-1)}. "`)
      e.target.value = "";
      setPassword("");
    } else {
      setPassword(text);
    }
  }
  
  async function handleRegister() {
    // check if user nave is free
    const name = await(await fetch(
      `${location.origin}/api/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({name: user, email: null}),
      }
      )).json();
    if (name !== null) {
      setInvalid("Username is used. Select another one.");
      setDisabled(true);
      return;
    }
   
    //register new user.
    const bcrypt_hash = hashSync(password, 10);;
    const register = await(await fetch(
      `${location.origin}/api/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({name: user, bcrypt_hash: bcrypt_hash}),
      }
    ));
    if (register !== null) {
      signIn("credentials", {
        username: user,
        password: password,
        redirect: true,
        callbackUrl: "/",
      })
    }
  }

  useEffect(() => {
    if (user.length < 4) {
      setDisabled(true);
      setInvalid(i => i + "User is short.");
      return;
    }
    if (password.length < 7) {
      setDisabled(true);
      setInvalid(i => i + "Pass is short.");
      return;
    }
    setDisabled(false);
  }, [user, password]);
  return (
    <div className="text-orange-200 quiz-space">
      <div className="absolute flex flex-col px-6 py-4 transform -translate-x-1/2 -translate-y-1/2 w-72 bg-sky-800 top-1/2 left-1/2 rounded-2xl">
        <label className="block rounded-md" htmlFor="register-user">User:</label>
        <input maxLength={25} className="block mb-2 rounded-md quiz-input" id="register-user" type="text" name="register-user" onChange={changeUser} autoFocus />
        <label className="block rounded-md" htmlFor="register-password">Password:</label>
        <input maxLength={40} className="block rounded-md quiz-input" id="register-password" type="password" name="register-password" onChange={changePassword} />
        <div className="h-4 my-1 text-xs text-red-400">
          {invalid}
        </div>
        <button className="mx-auto rounded-md btn" disabled={isDisabled} onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
}