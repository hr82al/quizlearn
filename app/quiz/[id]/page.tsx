"use client"
import AddQuiz from "@/components/addQuiz/AddQuiz";
import QuizID from "@/components/quizID/QuizID";
import { QuizScreen } from "@/components/quizID/quiz";
import { Quiz } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";



async function getQuizById(id: number): Promise<Quiz | null> {
  if (isFinite(id)) {
    try {
      const result = await(await fetch(`/api/quiz/${id}`)).json();
      return result;
    }catch (error) {
      console.log(error);
      return null;
    }
  } 
  return null;
}


function chooseScreen(id: string): QuizScreen {
  if (isFinite(+id) && +id !== 0) {
    return QuizScreen.DO;
  } else {
    return QuizScreen.ADD;
  }
}

async function getQuiz(id: string) {
  if (isFinite(+id) && +id !== 0) {
    return await getQuizById(+id);
  }
  return null
}

export default function QuizPage(
  { 
    params: { id },
  }:{ 
    params: { id: string },
}) {
  const [ screen, setScreen ] = useState(chooseScreen(id));
  const [ quiz, setQuiz ] = useState<Quiz | null>(null);
  const router = useRouter();

  useEffect(() => {
    getQuiz(id).then(q => {
      setQuiz(q);
    })
  }, [id]);

  switch (screen) {
    case QuizScreen.DO:
    case QuizScreen.DO_NEW:
      if (quiz) {
        return <QuizID quiz={ quiz } screen={ screen } setScreen={ setScreen }/>
      } else {
        return <h1>Initialization</h1>
      }
      break;
    case QuizScreen.ADD:
      return <AddQuiz quiz={ quiz } setQuiz={setQuiz} setScreen={setScreen}/>
      break;

    default:
      const _exhaustiveCheck: never = screen;
  }
}