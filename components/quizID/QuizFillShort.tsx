import { useRef, useState } from "react";
import { MIN_WIDTH } from "./Blank";

export function QuizFillShort(
  {
    userAnswer, setUserAnswer,
  }: {
    userAnswer: string;
    setUserAnswer: (answer: string) => void;
  }) {
  const [width, setWidth] = useState(MIN_WIDTH);
  const ref = useRef<HTMLSpanElement>(null);


  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (typeof ref.current?.offsetWidth === "number") {
      const tmp = ref.current.offsetWidth < MIN_WIDTH ? MIN_WIDTH : ref.current.offsetWidth;
      setWidth(tmp);
    }
    setUserAnswer(e.target.value);
  }


  return (
    <div>
      <span className="fixed -top-1/2 " ref={ref}>{userAnswer}</span>
      <input
        style={{ width }}
        id="userAnswer"
        onChange={(e) => handleChange(e)}
        spellCheck={false}
        className="text-center border-b-2 bg-inherit border-main-lightest outline-none"
        value={userAnswer} />
    </div>
  );
}
