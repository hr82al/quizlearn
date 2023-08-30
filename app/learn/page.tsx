"use client"

import Card from "@/components/card/Card"
import { initCardAsync } from "@/redux/features/card/cardSlice";
import { useAppDispatch } from "@/redux/hooks"
import { useEffect } from "react";

export default function Learn() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initCardAsync());
  },[]);

  return (
    <div className="relative quiz-space">
      <Card />
    </div>
  )
}