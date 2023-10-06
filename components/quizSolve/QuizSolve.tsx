import { JetBrains_Mono, Poppins } from "next/font/google";
import Navbar from "../Navbar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { QuizRecord} from "@/redux/features/quiz/quizSlice";
import { QuizKind, checkAnswer, selectQuizIsCorrect, selectQuizKind, selectQuizPieces, selectQuizVariants, setCheckboxAnswer, setQuizPiece, setQuizSolve, setRadioAnswer } from "@/redux/features/quizSolveSlice/quizSolveSlice";
import { useEffect, useRef, useState } from "react";

const jetBrainFont = JetBrains_Mono({ subsets: ["cyrillic-ext"] });
const poppins = Poppins({ weight: "400", subsets: ["latin-ext"] });

export function QuizSolve({ quiz }: { quiz: QuizRecord }) {
  const dispatch = useAppDispatch();
  const quizKind = useAppSelector(selectQuizKind);
  const isCorrect = useAppSelector(selectQuizIsCorrect);
  
  useEffect(() => {
    dispatch(setQuizSolve(quiz));
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
    case QuizKind.FILL_BLANKS:
    case QuizKind.FILL_SHORT:
    case QuizKind.INFILLINATORS:
    case QuizKind.NONE:
    case QuizKind.SELECT_BLANKS:
      break;
    default:
      const _exhaustiveCheck: never = quizKind;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-col gap-2 flex-auto main-container text-orange-200 text-lg  select-none">
        <div className="flex-auto flex flex-col gap-8">
          <div className={`border-2 border-main-light p-4 rounded-2xl`} >
            <div className={`${poppins.className}`}>
              {quiz.question}
            </div>
            <hr className="border-main-light border-2 rounded-full w-11/12 mx-auto my-2" />
            <QuizBody />
          </div>

          <div className="flex justify-center flex-auto border-2 border-main-light rounded-2xl p-4">
            {quizUI}
          </div>
        </div>

        <div className="flex justify-center">
          <button 
            className="btn"
            onClick={() => dispatch(checkAnswer())}
          >
            Submit Answer
          </button>
        </div>
        {typeof isCorrect === "boolean" && <QuizResult />}
      </div>
    </div>
  )
}

function QuizCheckbox() {
  const dispatch = useAppDispatch();

  return (
    <QuizRadioOrCheckBox 
      type="checkbox"
      toName={(idx?: number) => `quiz-checkbox${idx}` }
      handleClick={(i) => dispatch(setRadioAnswer(i))}
    />
  );
}

function QuizRadio() {
  const dispatch = useAppDispatch();
  return (
  <QuizRadioOrCheckBox 
    type="radio"
    toName={() => "quiz-radio"}
    handleClick={(answer, isSet) => {
      if (typeof isSet === "boolean") {
        dispatch(setCheckboxAnswer({answer, isSet}));
      }
    }}
  />
  );
}

function QuizRadioOrCheckBox(
  {
    type,
    toName,
    handleClick,
  } : {
    type: React.HTMLInputTypeAttribute | undefined,
    toName: (idx?: number) => string,
    handleClick: (answer: string, isSet?: boolean) => void,
  }) {
  const variants = useAppSelector(selectQuizVariants);

  const items = variants.map((i, k) => {
    return (
      <div key={k} className="bg-main-darkest px-4 py-2 rounded-full border-2 border-main-light" >
        <input 
          type={type} 
          name={toName(k)}
          id={toName(k)} 
          className="mr-2" 
          onChange={e => handleClick(i, e.target.checked)}
        />
        <label htmlFor={toName(k)} >{i}</label>
      </div>
    );
  });
  return (
    <div className="inline-flex flex-col gap-2">
      {items}
    </div>
  );
}

const MIN_WIDTH = 24;

function Blank({ index }: { index: number }) {
  const pieces = useAppSelector(selectQuizPieces);
  const [width, setWidth] = useState(10);
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLSpanElement>(null);


  useEffect(() => {
    if (typeof ref.current?.offsetWidth === "number") {
      const tmp = ref.current.offsetWidth < MIN_WIDTH ? MIN_WIDTH : ref.current.offsetWidth;
      setWidth(tmp);
    }
  }, [pieces[index][0]]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(setQuizPiece({index , text: e.target.value}));
  }


  return (
    <>
      <span className="absolute -top-1/2" ref={ref}>{pieces[index][0]}</span>
      <input
        style={{ width }}
        id={`blank${index}`}
        onChange={(e) => handleChange(e)}
        className="text-center inline-block border-b-2 bg-main-base border-main-lightest outline-none"
        value={pieces[index][0]}
      />
    </>
  );
}

function Preformatted({ index }: { index: number }) {
  const pieces = useAppSelector(selectQuizPieces);
  return (
    <pre className="inline break-all whitespace-pre-wrap">
      {pieces[index]}
    </pre>
  );
}

function PreformattedOrBlank({ index }: { index: number }) {
  const pieces = useAppSelector(selectQuizPieces);
  if (pieces[index][1]) {
    return (<Blank index={index} />);
  } else {
    return (<Preformatted index={index} />);
  }
}

function QuizBody() {
  const pieces = useAppSelector(selectQuizPieces);
  const items = pieces.map((item, index) => <PreformattedOrBlank key={index} index={index} />);


  return (
    <div className={`${jetBrainFont.className}`}>
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
