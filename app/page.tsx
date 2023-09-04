"use client"

import Navbar from "@/components/Navbar";
import { initCardAsync } from "@/redux/features/card/cardSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect } from "react";


export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initCardAsync());
  },[]);
  
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>

      </main>
    </>
  )
}
