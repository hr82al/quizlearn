import { Quiz } from "@prisma/client";
import { useEffect, useState } from "react";
import { QuizFragment, QuizKind, parseQuiz } from "./quiz";
import QuizRadio from "./QuizRadio";
import { QuizCheckbox } from "./QuizCheckbox";
import { QuizFill } from "./QuizFill";
import { checkboxQuizCheckAnswer, fillBlanksQuizCheckAnswer, fillQuizCheckAnswer, fillShortQuizCheckAnswer, radioQuizCheckAnswer, selectBlanksCheckAnswer } from "./checkAnswer";
import { QuizResult } from "./QuizResult";
import { Actions } from "./Actions";
import { JetBrains_Mono } from "next/font/google";
import { QuizFillBlanks } from "./QuizFillBlanks";
import { QuizFillShort } from "./QuizFillShort";
import { QuizSelectBlanks } from "./QuizSelectBlanks";


export const jetBrainFont = JetBrains_Mono({ subsets: ["cyrillic-ext"] });
export type FillHandler = ( index: number, text: string ) => void


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

function getWithSpaces(variants: string[], selected: string[], trimmed: string): string {
  const index = selected.filter(i => i.trim() === trimmed).length;
  return variants.filter(v => v.trim() === trimmed)[index];
}

function addFragment(fragments: QuizFragment[], fragment: QuizFragment): QuizFragment[] {
  const index = fragments.findIndex(item => item.value === "");
  if (index === -1) {
    return [...fragments, fragment];
  } else {
    return [...fragments.slice(0, index), fragment, ...fragments.slice(index + 1)];
  } 
}

export default function QuizID(
  { id }: 
  { id: number}
) {
  const [ quiz, setQuiz ] = useState<Quiz | null>(null);
  const [ quizKind, setQuizKind ] = useState<QuizKind | null>(null);
  const [ quizVariants, setQuizVariants ] = useState<string[]>([]);
  const [ userAnswer, setUserAnswer ] = useState("");
  const [ userAnswers, setUserAnswers ] = useState<string[]>([]);
  const [ quizAnswers , setQuizAnswers ] = useState<string[]>([]);
  const [ isCorrect, setIsCorrect ] = useState<boolean | null>(null);
  const [ quizFragments, setQuizFragments ] = useState<QuizFragment[]>([]);
  const [ quizUniqueVariants, setQuizUniqueVariants ] = useState<string[]>([]);



  function setCheckboxAnswer(answer: string, isSet?: boolean) {
    if (typeof isSet === "boolean") {
      if (!isSet) {
        const answers = userAnswers.filter(a => a !== answer);
        setUserAnswers(answers);
      } else {
        if (isSet) {
          setUserAnswers([...userAnswers, answer]);
        }
      }
    }
  }

  function removeSelection(index: number) {
    const fragments = quizFragments.slice();
    fragments[index].value = ""
    setQuizFragments(fragments);
  }

  function addSelection(text: string) {
    const valueWithSpaces = getWithSpaces(
      quizVariants, 
      quizFragments.filter(p => p.isBlank).map(p => p.value),
      text
      )
    setQuizFragments(addFragment(quizFragments, {value: valueWithSpaces, isBlank: true}))
  }


  function checkAnswer() {

    if (isCorrect === null) {
      switch (quizKind) {
        case QuizKind.RADIO:
          setIsCorrect(radioQuizCheckAnswer(userAnswer, quizAnswers));
          break;
        case QuizKind.CHECKBOX:
          setIsCorrect(checkboxQuizCheckAnswer(userAnswers, quizAnswers));
          break;  
        case QuizKind.FILL:
          setIsCorrect(fillQuizCheckAnswer(userAnswer, quizAnswers));
           break;
        case QuizKind.FILL_BLANKS:
          setIsCorrect(fillBlanksQuizCheckAnswer(quizFragments, quizAnswers));
          break; 
        case QuizKind.FILL_SHORT:
          setIsCorrect(fillShortQuizCheckAnswer(userAnswer, quizAnswers));
          break;
        case QuizKind.NONE:
        case null:
          break;
        case QuizKind.SELECT_BLANKS:
          setIsCorrect(selectBlanksCheckAnswer(quizFragments, quizAnswers));
          break;
        default:
          const _exhaustiveCheck: never = quizKind;
      } 
    }

    // TODO change after testing
    setTimeout(() => {
      setIsCorrect(null)
      // finish();
    }, 3500);
  }


  let quizUI = (<></>);
  switch (quizKind) {
    case QuizKind.RADIO:
      quizUI = 
        <QuizRadio 
          quizVariants={quizVariants} 
          handler={setUserAnswer} />
      break; 
    case QuizKind.CHECKBOX:
      quizUI =
        <QuizCheckbox
          quizVariants={quizVariants} 
          handler={setCheckboxAnswer} />
      break; 
    case QuizKind.FILL:
      quizUI = 
        <QuizFill 
          setAnswer={setUserAnswer}
        />
      break; 
    case QuizKind.FILL_BLANKS:
      quizUI = 
        <QuizFillBlanks 
          fragments={quizFragments}
          handleFill={(index, text) => {
            const fragments = quizFragments.slice();
            fragments[index].value = text;
            setQuizFragments(fragments);
          }}
        />
      break;
    case QuizKind.FILL_SHORT:
      quizUI = 
        <QuizFillShort 
          userAnswer={userAnswer}
          setUserAnswer={setUserAnswer}
        />
      break; 
    case QuizKind.NONE:
    case null:
      quizUI = <div>Initialization...</div>
      break;
    case QuizKind.SELECT_BLANKS:
      quizUI = 
        <QuizSelectBlanks
          fragments={ quizFragments } 
          removeSelection={ removeSelection }
          addSelection={ addSelection }
          quizUniqueVariants={ quizUniqueVariants }
          quizVariants={ quizVariants }
        />
      break;
    default:
      const _exhaustiveCheck: never = quizKind;
  } 


  useEffect(() => {
    async function fetchData() {
      try {
        const quiz = await getQuizById(id);
        if (quiz !== null && "id" in quiz) {
          setQuiz(quiz);
          const parsedQuiz = parseQuiz(quiz);
          setQuizKind(parsedQuiz.kind);
          setQuizVariants(parsedQuiz.quizVariants);
          setQuizAnswers(parsedQuiz.quizAnswers);
          setQuizFragments(parsedQuiz.quizFragments);
          setQuizUniqueVariants(parsedQuiz.quizUniqueVariants);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [id]);



  return (
    <div>
      <h1>{JSON.stringify(quiz)}</h1>
      {quizKind}
      {quizUI}
      <Actions handleSubmit={checkAnswer}/>
      {typeof isCorrect === "boolean" && <QuizResult isCorrect={isCorrect}/>}
    </div>
  );
}


