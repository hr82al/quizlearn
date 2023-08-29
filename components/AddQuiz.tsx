'use client'

import { QuizT } from '@/app/api/admin/quiz/route';
import { Quiz_Type, Quiz } from '@prisma/client';
import { useState } from 'react';


const quiz_types = Object.keys(Quiz_Type);

async function createQuiz(quiz: QuizT) {
  const response  = await (await fetch(
    `${location.origin}/api/admin/quiz`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quiz),
    }
  )).json() as Quiz;
  return response;
}
 
export default function AddQuiz() {
 
  const [question, setQuestion] = useState("");
  const [quiz_type, setQuiz_type] = useState<Quiz_Type>("FILL");
  const [quiz, setQuiz] = useState("");
  const [answer, setAnswer] = useState("");


  const selections = quiz_types.map( (e, i) => {
    return (
      <option value={e} key={i}>{e}</option>
    )
  })

  async function handleClick() {
    const tmp: QuizT = {
      question,
      quiz_type,
      quiz,
      answer,
    }
    const res = await createQuiz(tmp)
  }

  return (
    <div className="container p-4 mx-auto shadow-xl text-lime-200 bg-sky-800 rounded-2xl">
      <label htmlFor="insert-question" className="block ml-3">
        Question:
      </label>
      <textarea id="insert-question" className="card-input" onChange={e => { setQuestion(e.target.value) }} />

      <label htmlFor="insert-quiz-type" className="block ml-3">
        Quiz type:
      </label>
      <select className="w-24 card-input" id="insert-quiz-type" onChange={e => { setQuiz_type(e.target.value as Quiz_Type) }}>
        {selections}
      </select>

      <label htmlFor="insert-quiz" className="block ml-3">
        Quiz:
      </label>
      <textarea id="insert-quiz" className="h-32 card-input" onChange={e => { setQuiz(e.target.value) }} />

      <label htmlFor="insert-answer" className="block ml-3">
        Answer:
      </label>
      <textarea id="insert-answer" className="card-input" onChange={e => { setAnswer(e.target.value) }} />
      
      <div className="flex flex-row-reverse">
        <button className="px-6 py-2 text-sm shadow-xl bg-sky-950 rounded-xl" onClick={handleClick}>
          Append
        </button>
      </div>
    </div>
  )
}