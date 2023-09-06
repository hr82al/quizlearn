"use client"

import { useEffect, useState } from "react"
import { Result } from "@prisma/client";

export default function Results() {
  const [result, setResult] = useState<Result[]>();

  useEffect(() => {
    fetch("/api/result").then(r => r.json()).then(e => {
      setResult(e);
    })
  },[]);

  return (
    <div>
      Results
      {
        result?.map((e, k) => {
          return (
            <div>
              {e.isCorrect ? ("✅") : ("❌")}
            </div>
          );
        })
      }
    </div>
  )
}