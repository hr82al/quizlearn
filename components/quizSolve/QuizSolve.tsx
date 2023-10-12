import { JetBrains_Mono } from "next/font/google";
import Navbar from "../Navbar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { QuizRecord} from "@/redux/features/quiz/quizSlice";
import { QuizKind, checkAnswerAsync, selectQuizIsCorrect, selectQuizKind,  selectQuizQuestion,  selectQuizUserAnswer,  selectQuizVariants, setAnswer, setCheckboxAnswer, setQuizSolve } from "@/redux/features/quizSolveSlice/quizSolveSlice";
import { useEffect, useRef, useState } from "react";
import { QuizFillBlanks } from "./QuizFillBlanks";
import { QuizSelectBlanks } from "./QuizSelectBlanks";


export const jetBrainFont = JetBrains_Mono({ subsets: ["cyrillic-ext"] });


export function QuizSolve({ quiz }: { quiz: QuizRecord }) {
  const dispatch = useAppDispatch();
  const quizKind = useAppSelector(selectQuizKind);
  const isCorrect = useAppSelector(selectQuizIsCorrect);
  const question = useAppSelector(selectQuizQuestion);
  
  useEffect(() => {
    if (quiz) {
      dispatch(setQuizSolve(quiz));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);


  let quizUI = (<></>);
  switch (quizKind) {
    case QuizKind.RADIO:
      quizUI = <QuizRadio />
      break;
    case QuizKind.CHECKBOX:
      quizUI = <QuizCheckbox />
      break;
    case QuizKind.FILL:
      quizUI = <QuizFill />
      break;
    case QuizKind.FILL_BLANKS:
      quizUI = <QuizFillBlanks />
      break;
    case QuizKind.FILL_SHORT:
      quizUI = <QuizFillShort />
      break;
    case QuizKind.NONE:
      quizUI = <div>Initialization...</div>
      break;
    case QuizKind.SELECT_BLANKS:
      quizUI = <QuizSelectBlanks />
      break;
    default:
      const _exhaustiveCheck: never = quizKind;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-col gap-2 flex-auto main-container text-orange-200 text-lg  select-none">
        <div className="flex-auto flex flex-col gap-8">

          {quizKind !== QuizKind.NONE && quizKind !== QuizKind.FILL_BLANKS  && quizKind !== QuizKind.SELECT_BLANKS && question.trim().length > 0 && (
            <div className={`border-2 border-main-light p-4 rounded-2xl`} >
              <pre className={`break-all whitespace-pre-wrap ${jetBrainFont.className}`}>
                {question}
              </pre>
            </div>
          )}


          <div className="flex flex-col items-start min-h-1/2 border-2 border-main-light rounded-2xl p-4">
            {quizUI}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            className="btn"
            onClick={() => dispatch(checkAnswerAsync())}
          >
            Submit Answer
          </button>
        </div>
        {typeof isCorrect === "boolean" && <QuizResult />}
      </div>
    </div>
  )
}


const MIN_WIDTH = 24;

function QuizFillShort() {
  const [width, setWidth] = useState(MIN_WIDTH);
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLSpanElement>(null);
  const userAnswer = useAppSelector(selectQuizUserAnswer);



  useEffect(() => {
    if (typeof ref.current?.offsetWidth === "number") {
      const tmp = ref.current.offsetWidth < MIN_WIDTH ? MIN_WIDTH : ref.current.offsetWidth;
      setWidth(tmp);
    }
  }, [userAnswer]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(setAnswer(e.target.value));
  }


  return (
    <div>
      <span className="fixed -top-1/2 " ref={ref}>{userAnswer}</span>
      <input
        style={{ width }}
        id="userAnswer"
        onChange={(e) => handleChange(e)}
        spellCheck={false}
        className="text-center border-b-2 bg-main-base border-main-lightest outline-none"
        value={userAnswer}
      />
    </div>
  );
}

function QuizFill() {
  const dispatch = useAppDispatch();

  return (
    <textarea 
      name="quiz-fill" 
      id="quiz-fill" 
      className="quiz-input flex-auto" 
      spellCheck={false} 
      autoFocus 
      onChange={e => dispatch(setAnswer(e.target.value))}
    ></textarea>
  );
}

function QuizCheckbox() {
  const dispatch = useAppDispatch();

  return (
    <QuizRadioOrCheckBox 
      type="checkbox"
      toName={(idx?: number) => `quiz-checkbox${idx}` }
      toId={(idx) => `quiz-checkbox${idx}` }
      handleClick={(answer, isSet) => {
        if (typeof isSet === "boolean") {
          dispatch(setCheckboxAnswer({answer, isSet}));
        }
      }}
    />
  );
}

function QuizRadio() {
  const dispatch = useAppDispatch();
  return (
  <QuizRadioOrCheckBox 
    type="radio"
    toName={() => "quiz-radio"}
    toId={(idx) => `quiz-radio${idx}`}
    handleClick={(answer, isSet) => {
        dispatch(setAnswer(answer));
    }}
  />
  );
}

function QuizRadioOrCheckBox(
  {
    type,
    toName,
    toId,
    handleClick,
  } : {
    type: React.HTMLInputTypeAttribute | undefined,
    toName: (idx?: number) => string,
    toId: (idx?: number) => string,
    handleClick: (answer: string, isSet?: boolean) => void,
  }) {
  const variants = useAppSelector(selectQuizVariants);

  const items = variants.map((i, k) => {
    return (
      <div key={k} className="bg-main-darkest px-4 py-2 rounded-full border-2 border-main-light" >
        <input 
          type={type} 
          name={toName(k)}
          id={toId(k)} 
          className="mr-2" 
          onChange={e => handleClick(i, e.target.checked)}
        />
        <label htmlFor={toId(k)} >{i}</label>
      </div>
    );
  });
  return (
    <div className="inline-flex flex-col gap-2">
      {items}
    </div>
  );
}




function QuizResult() {
  const isCorrect = useAppSelector(selectQuizIsCorrect);
  return (
<div className="fixed inset-0 bg-gray-600 bg-opacity-70 overflow-y-auto h-full w-full">
  <div className="fixed  py-14 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 px-8 bg-main-darkest animate-result rounded-full border-4 border-main-light">
    {isCorrect ? "Correct" : "Incorrect"}
  </div>
</div>
  );
}
