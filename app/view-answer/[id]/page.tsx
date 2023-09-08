"use client"

import Navbar from "@/components/Navbar";
import { fetchQuizID } from "@/components/results";
import { Quiz } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


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
        <div className="w-full text-left">
          {quiz?.category}
        </div>
      </Navbar>
    </header>
    <main className="container bg-sky-800 p-4 mx-auto rounded-lg">
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