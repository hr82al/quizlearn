'use client'

import { QuizT } from '@/app/api/admin/quiz/route';
import { QuizEnum, Quiz } from '@prisma/client';
import { useState } from 'react';
import { JetBrains_Mono } from "next/font/google";
import { QuizAttr } from '@/quiz/quiz';



const jetBrainFont = JetBrains_Mono({ subsets: ["cyrillic-ext"] });
const quiz_types = Object.keys(QuizEnum);



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
  const [quiz_type, setQuiz_type] = useState<QuizEnum>("FILL");
  const [quiz, setQuiz] = useState("");
  const [quizRaw, setQuizRaw] = useState("");
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

  interface QuizItem {
    type: string,
    content: string,
  }

  function handleQuiz(text: string) {
    let result: string[];
    result = QuizAttr.from(text);
    setQuizRaw(JSON.stringify(result));
  }

  return (
    <div className={`container p-4 mx-auto shadow-xl text-lime-200 bg-sky-800 rounded-2xl ${jetBrainFont.className}`}>
      <label htmlFor="insert-question" className="block">
        Question:
      </label>
      <textarea id="insert-question" className="card-input" onChange={e => { setQuestion(e.target.value) }} />


      <div className="flex">
        <div>
          <label htmlFor="insert-quiz-type" className="block">
            Quiz type:
          </label>
          <select className="w-36 card-input" id="insert-quiz-type" onChange={e => { setQuiz_type(e.target.value as QuizEnum) }}>
            {selections}
          </select>
        </div>
        <div>
          <label htmlFor="insert-quiz-type" className="block">
            Quiz type:
          </label>
          <select className="w-36 card-input" id="insert-quiz-type" onChange={e => { setQuiz_type(e.target.value as QuizEnum) }}>
            {selections}
          </select>
        </div>
      </div>


      <label htmlFor="insert-quiz" className="block">
        Quiz:
      </label>
      <textarea id="insert-quiz" className="h-32 card-input" onChange={e => { handleQuiz(e.target.value) }} />
      <textarea id="insert-quiz-raw" className="h-32 card-input" onChange={e => { setQuizRaw(e.target.value)}} value={quizRaw}/>

      <label htmlFor="insert-answer" className="block">
        Answer:
      </label>
      <textarea id="insert-answer" className="card-input h-32" onChange={e => { setAnswer(e.target.value) }} />
      <textarea id="insert-answer-raw" className="card-input h-32" />
      
      <div className="flex flex-row-reverse">
        <button className="btn" onClick={handleClick}>
          Append
        </button>
      </div>
    </div>
  )
}