import { useEffect, useRef, useState } from "react";
import { QuizFragment } from "./quiz";
import { FillHandler } from "./QuizID";


export const MIN_WIDTH = 24;

export function Blank(
  {
    index, fragments, handleFill,
  }: {
    index: number;
    fragments: QuizFragment[];
    handleFill: FillHandler;
  }) {
  const [width, setWidth] = useState(MIN_WIDTH);
  const ref = useRef<HTMLSpanElement>(null);
  const value = fragments[index].value;


  useEffect(() => {
    if (typeof ref.current?.offsetWidth === "number") {
      const tmp = ref.current.offsetWidth < MIN_WIDTH ? MIN_WIDTH : ref.current.offsetWidth;
      setWidth(tmp);
    }
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleFill(index, e.target.value);
  }


  return (
    <>
      <span className="absolute -top-1/2" ref={ref}>{value}</span>
      <input
        style={{ width }}
        id={`blank${index}`}
        onChange={(e) => handleChange(e)}
        spellCheck={false}
        className="text-center inline-block border-b-2 bg-inherit border-main-lightest outline-none"
        value={value} />
    </>
  );
}
