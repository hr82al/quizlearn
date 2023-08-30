"use client"

import Card from "@/components/card/Card"
import { initSetCardsAsync, selectCards } from "@/redux/features/card/cardSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { useEffect } from "react";

export default function Learn() {
  const card = useAppSelector(selectCards);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initSetCardsAsync());
  },[]);

  return (
    <div>
      <Card id={1} />
      {JSON.stringify(card)}
    </div>
  )
}