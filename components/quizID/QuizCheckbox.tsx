import { QuizRadioOrCheckBox } from "./QuizRadioOrCheckBox";

export function QuizCheckbox(
  {
    quizVariants, handler,
  }: {
    quizVariants: string[];
    handler: (answer: string, isSet?: boolean) => void;
  }) {


  return (
    <QuizRadioOrCheckBox
      type="checkbox"
      toName={(idx?: number) => `quiz-checkbox${idx}`}
      toId={(idx) => `quiz-checkbox${idx}`}
      handleClick={handler}
      quizVariants={quizVariants} />
  );
}
