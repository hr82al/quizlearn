"use client"

import Navbar from "@/components/Navbar"
import Card from "@/components/card/Card"
import { selectCards, selectCurrentCard, selectIsCorrect } from "@/redux/features/card/cardSlice";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation"
import { useEffect } from "react";

export default function Learn() {
  const router = useRouter();
  const cards = useAppSelector(selectCards);
  const isCorrect = useAppSelector(selectIsCorrect);
  const currentCard = useAppSelector(selectCurrentCard);

  useEffect(() => {
    if (cards.cards.length === 0) {
      router.push("/");
    }
  }, []);
  
  if (cards.cards.length !== 0) {
    return (
      <>
    <header>
      <Navbar>
        <div className="flex w-full">
          <div className="flex-none">{0}</div>
          <div className="flex-auto text-center">{isCorrect.filter(c => c === true).length} : {isCorrect.length}</div>
      </div>
      </Navbar>
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