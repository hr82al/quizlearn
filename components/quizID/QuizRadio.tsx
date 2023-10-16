import { QuizRadioOrCheckBox } from "./QuizRadioOrCheckBox";

export default function QuizRadio( 
  { 
    quizVariants,
    handler,
  }: { 
    quizVariants: string[],
    handler: (answer: string, isSet?: boolean) => void
  }) {
  return (
  <QuizRadioOrCheckBox 
    type="radio"
    toName={ () => "quiz-radio" }
    toId={ (idx) => `quiz-radio${idx}` }
    handleClick={ handler }
    quizVariants={ quizVariants }
  />
  );
}


