"use client"

import Navbar from "@/components/Navbar"
import Card from "@/components/card/Card"
import { selectCards } from "@/redux/features/card/cardSlice";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation"
import { useEffect } from "react";

export default function Learn() {
  const router = useRouter();
  const cards = useAppSelector(selectCards);

  useEffect(() => {
    if (cards.cards.length === 0) {
      router.push("/");
    }
  }, []);
  
  if (cards.cards.length !== 0) {
    return (
      <>
    <header>
      <Navbar />
    </header>
    <div className="relative quiz-space">
      <Card />
    </div>
    </>
    );
  } else {
    return <div></div>
  }
}