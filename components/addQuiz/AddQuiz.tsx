import { JetBrains_Mono } from "next/font/google";
import Navbar from "../Navbar";
import { useEffect, useState } from "react";


const jetBrainFont = JetBrains_Mono({ subsets: ["cyrillic-ext"] });

enum QuizButtonTextEnum {
  Question = "Question",
  Quiz = "Quiz",
  Answer = "Answer",
}



export default function AddQuiz() {
  const [text, setText] = useState("");
  const [question, setQuestion] = useState("How to ...");
  const [quiz, setQuiz] = useState(`function greet(person: { name: string; age: number }) {
    return "Hello " + person.name;
}`);
  const [answer, setAnswer] = useState(quiz);
  const [buttonText, setButtonText] = useState<QuizButtonTextEnum>(QuizButtonTextEnum.Question);

  
  const isReady = question.length !== 0 && quiz.length !== 0 && answer.length !== 0;

  useEffect(() => {
    switch (buttonText) {
      case QuizButtonTextEnum.Question:
        setText(question);
        break;
      case QuizButtonTextEnum.Quiz:
        setText(quiz);
        break;
      case QuizButtonTextEnum.Answer:
        setText(answer);
    }
  }, [buttonText]);

  function handleAction() {
    const allText = Object.values(QuizButtonTextEnum)
    setButtonText(
      allText[(allText.indexOf(buttonText) + 1) % allText.length]
    )

    switch (buttonText) {
      case QuizButtonTextEnum.Question:
        setQuestion(text);
        break;
      case QuizButtonTextEnum.Quiz:
        setQuiz(text);
        break;;
      case QuizButtonTextEnum.Answer:
        setAnswer(text);
    }
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
            className="btn w-28"
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