import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectQuizPieces, setQuizPiece } from "@/redux/features/quizSolveSlice/quizSolveSlice";
import { JetBrains_Mono } from "next/font/google";
import { useEffect, useRef, useState } from "react";

export const jetBrainFont = JetBrains_Mono({ subsets: ["cyrillic-ext"] });

export function QuizFillBlanks() {
  const pieces = useAppSelector(selectQuizPieces);
  const items = pieces.map((item, index) => <PreformattedOrBlank key={index} index={index} />);


  return (
    <div className={`w-full ${jetBrainFont.className}`}>
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
