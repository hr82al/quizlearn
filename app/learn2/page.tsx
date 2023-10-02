"use client"

import Navbar from "@/components/Navbar"
import Card from "@/components/card/Card2"
import { selectCards, selectCorrectNum, selectCurrentCard, selectTotalNum } from "@/redux/features/card/card2Slice";
import { useAppSelector } from "@/redux/hooks";
import { IBM_Plex_Mono } from "next/font/google";
import { useRouter } from "next/navigation"
import { useEffect } from "react";


const plexMonoIBM = IBM_Plex_Mono( {subsets: ["cyrillic"], weight: "700"})

export default function Learn() {
  const router = useRouter();

  const cards = useAppSelector(selectCards);
  const currentCard = useAppSelector(selectCurrentCard);
  const correctNum = useAppSelector(selectCorrectNum);
  const totalNum = useAppSelector(selectTotalNum);

  useEffect(() => {
    if (cards.length === 0) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards.length]);
  
  if (cards.length !== 0 || currentCard !== null) {
    return (
      <div className="flex flex-col h-screen">
    <header>
      <Navbar>
        <div className="flex items-center w-full">
        <div className={`flex-none text-4xl text-center text-fuchsia-500 ${plexMonoIBM.className}`}>
          {currentCard?.category}
        </div>
        <div className={`flex-auto text-2xl text-zinc-400 text-center ${plexMonoIBM.className}`}> {correctNum} : {totalNum} </div>
      </div>
      </Navbar>
    </header>
    <div className="relative flex-auto">
      <Card />
    </div>
    </div>
    );
  } else {
    return <div></div>
  }
}