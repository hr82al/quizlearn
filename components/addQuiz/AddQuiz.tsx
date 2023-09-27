import { JetBrains_Mono } from "next/font/google";
import Navbar from "../Navbar";
import { use, useMemo, useState } from "react";
import { prettyQuiz, splitToItems } from "@/quiz/utils";
import { hlog } from "../prisma";
import { QuizEnum } from "@prisma/client";

const jetBrainFont = JetBrains_Mono({ subsets: ["cyrillic-ext"] });

enum QuizButtonTextEnum {
  Question = "Question",
  Quiz = "Quiz",
  CodeQuiz = "Code Quiz",
  Answer = "Answer",
  CodeAnswer = "Code Answer"
}



export default function AddQuiz() {
  const [text, setText] = useState("");
  const [question, setQuestion] = useState<string>("How to ...");
  const [quiz, setQuiz] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [buttonText, setButtonText] = useState<QuizButtonTextEnum>(QuizButtonTextEnum.Question);

  
  const isReady = question.length !== 0 && quiz.length !== 0 && answer.length !== 0;

  const quiz_code = useMemo(() => {
    return JSON.stringify(splitToItems(quiz));
  }, [quiz]);

  function handleAction() {
    const allText = Object.values(QuizButtonTextEnum)
    setButtonText(
      allText[(allText.indexOf(buttonText) + 1) % allText.length]
    )
    switch (buttonText) {
      case QuizButtonTextEnum.Question:
        setQuestion(text);
        setText(quiz);
        break;
      case QuizButtonTextEnum.Quiz:
        setQuiz(text);
        setText(quiz_code);
        break
      case QuizButtonTextEnum.CodeQuiz:
        setText(answer);
    }
    // if btnN is 1 then next is Raw quiz 
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div
        className={`main-container flex-auto flex flex-col gap-4 ${jetBrainFont.className}`}
      >
        <textarea 
          className="quiz-input flex-auto"
          autoFocus
          onChange={e => setText(e.target.value)}
          value={text}
        >
        </textarea>
        <div className="flex justify-end gap-2">
          <button 
            className="btn w-36"
            onClick={handleAction}
          >
            {buttonText.valueOf()}
          </button>
          <button className="btn w-28" disabled={!isReady}>
            Preview
          </button>
          <button className="btn w-28" disabled={!isReady}>
            Finish
          </button>
        </div>
      </div>
    </div>
  );
}