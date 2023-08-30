"use client"

import { Quiz, Quiz_Type } from "@prisma/client"
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

function QuizFill({ quiz }: {quiz: Quiz}) {
  return (
    <>
    <div className="mx-4 card-question" >
      {quiz.question}
    </div>
  </>
  )
}

export default function Card({ id }: { id: number }) {
  const [quiz, setQuiz] = useState<Quiz>();

  useEffect(() => {
    getQuiz(id).then(q => {
      setQuiz(q);
    });
  }, []);

  let quiz_body: React.ReactElement | null = null;
  switch (quiz?.quiz_type) {
    case Quiz_Type.FILL:
      quiz_body = <QuizFill quiz={quiz}/>
      break;
  }

  return (
    <div className="container p-4 mx-auto card bg-sky-800 rounded-3xl">
      {quiz_body}
    </div>
  )
}
