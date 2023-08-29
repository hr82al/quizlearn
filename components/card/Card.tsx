"use client"

import { Quiz } from "@prisma/client"
import { useEffect, useState } from "react";

export interface CardInterface {
  id: number,
  question: string,
  answers: string[],
}

async function getQuiz(id: number) {
  const quiz: Quiz = await ( await fetch(`${location.origin}/api/quiz?id=${id}`)).json() as Quiz;
  return quiz;
}

export default function Card({id}: {id: number}) {
  const [quiz, setQuiz] = useState<Quiz>();
  
  useEffect(() => {
    getQuiz(id).then(q => {
      setQuiz(q);
    });
  },[]);

  return (
    <div className="container p-4 mx-auto card bg-cyan-700 rounded-3xl">
      <div className="card-question" >
        {
          quiz && (
            <p>{JSON.stringify(quiz)}</p>
          )
        }
       
      </div>
    </div>
  )
}
