"use client"

import Navbar from "@/components/Navbar";
import { fetchQuizID } from "@/components/results";
import { Quiz } from "@prisma/client";
import { JetBrains_Mono, IBM_Plex_Mono } from "next/font/google";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const jetBrainFont = JetBrains_Mono({ subsets: ["cyrillic-ext"] });
const plexMonoIBM = IBM_Plex_Mono( {subsets: ["cyrillic"], weight: "700"})

export default function ViewAnswer({ params }: { params: { id: string }}) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchQuizID(Number(params.id)).then(result => {
      if (result === null) {
        router.push("/");
      }
      setQuiz(result);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  return (
    <>
    <header>
      <Navbar>
        <div className={`w-full text-left text-4xl  text-fuchsia-500 ${plexMonoIBM.className}`}>
          {quiz?.category}
        </div>
      </Navbar>
    </header>
    <main className={"container bg-sky-800 p-4 mx-auto rounded-lg " + jetBrainFont.className}>
      <div className="bg-violet-950 rounded-md mb-4 p-4">
        {quiz?.question}
      </div>
      <div className="bg-violet-950 rounded-md p-4">
        {quiz?.answer}
      </div>
    </main>
    </>
  )
}