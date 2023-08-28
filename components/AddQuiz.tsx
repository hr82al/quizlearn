'use client'

import { QuizT } from '@/app/api/quiz/route';
import { Quiz_Type, Quiz } from '@prisma/client';
import { useState } from 'react';


const quiz_types = Object.keys(Quiz_Type);

async function createQuiz(quiz: QuizT) {
  const response  = await (await fetch(
    `${location.origin}/api/quiz`,
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
  const [result, setResult] = useState("");


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
    console.log(res);
  }

  return (
    <div className="container p-4 mx-auto shadow-xl text-lime-200 bg-sky-800 rounded-2xl">
      <label htmlFor="insert-question" className="block ml-3">
        Question:
      </label>
      <textarea id="insert-question" className="block w-full p-3 mt-1 mb-4 border-2 border-transparent resize-none bg-violet-950 focus:outline-none focus:border-amber-800 rounded-xl" onChange={e => { setQuestion(e.target.value) }} />

      <label htmlFor="insert-quiz-type" className="block ml-3">
        Quiz type:
      </label>
      <select className="block w-24 p-3 mt-1 mb-4 border-2 border-transparent resize-none bg-violet-950 focus:outline-none focus:border-amber-800 rounded-xl" id="insert-quiz-type" onChange={e => { setQuiz_type(e.target.value as Quiz_Type) }}>
        {selections}
      </select>

      <label htmlFor="insert-quiz" className="block ml-3">
        Quiz:
      </label>
      <textarea id="insert-quiz" className="block w-full h-32 p-3 mt-1 mb-4 border-2 border-transparent resize-none bg-violet-950 focus:outline-none focus:border-amber-800 rounded-xl" onChange={e => { setQuiz(e.target.value) }} />

      <label htmlFor="insert-answer" className="block ml-3">
        Answer:
      </label>
      <textarea id="insert-answer" className="block w-full p-3 mt-1 mb-4 border-2 border-transparent resize-none bg-violet-950 focus:outline-none focus:border-amber-800 rounded-xl" onChange={e => { setAnswer(e.target.value) }} />
      
      <div className="flex flex-row-reverse">
        <button className="p-3 text-sm shadow-xl bg-sky-950 rounded-xl" onClick={handleClick}>
          Append
        </button>
      </div>
      <p>{result}</p>
    </div>
  )
}