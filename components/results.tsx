"use client"

import { useEffect, useState } from "react"
import { Result } from "@prisma/client";
import { RepeatIcon, ViewIcon } from "./Icons";



export default function Results() {
  const [result, setResult] = useState<Result[]>();

  useEffect(() => {
    fetch("/api/result").then(r => r.json()).then(e => {
      setResult(e);
    })
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 py-4 border border-gray-100 rounded-md sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 place-items-center">
      {
        result?.map((e) => {
          return (
            <div key={e.id} className="flex items-center justify-around px-4 py-2 rounded-md bg-zinc-700 w-52">

              {e.isCorrect ? (
                <div className="w-20 text-center uppercase bg-green-500 rounded-sm">
                  You win
                </div>
              ) : (
                <div className="w-20 text-center uppercase align-middle bg-red-500 rounded-sm">
                  You lost
                </div>
              )}
              <div >
                <RepeatIcon height={32} width={32} className="flex-shrink-0 text-green-400 rounded-md bg-zinc-800 " />
              </div>
              <div>
                <ViewIcon height={32} width={32} className="flex-shrink-0 text-gray-400 rounded-md bg-zinc-800" />
              </div>
            </div>
          );
        })
      }
    </div>
  )
}