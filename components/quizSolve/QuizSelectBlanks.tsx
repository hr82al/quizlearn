import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addSelection, removeSelection, selectQuizPieces, selectQuizVariants, selectUniqueVariants } from "@/redux/features/quizSolveSlice/quizSolveSlice";
import { Preformatted } from "./Preformatted";
import { BLANK } from "@/redux/features/quiz/quizSlice";


export function QuizSelectBlanks() {
  const variants = useAppSelector(selectQuizVariants);
  const uniqueVariants = useAppSelector(selectUniqueVariants);
  const pieces = useAppSelector(selectQuizPieces);
  const dispatch = useAppDispatch();


  const quizPad = pieces.map((item, idx) => {
    if (!item.isBlank) {
      return <Preformatted key={idx} index={idx} />
    } else {
      return <SelectedBlank key={idx} index={idx} />
    }
  });



  function handleAdd(text: string) {
    dispatch(addSelection(text));
  }

  const buttons = uniqueVariants.map((item, idx) => {
    const isDisabled = variants.filter(variant => variant.trim() === item).length === pieces.filter(i =>  i.value.trim() === item).length
    return (
      <button 
        className="btn" 
        key={idx}
        disabled={isDisabled}
        onClick={() => handleAdd(item)}
      >{item}</button>
    );
  });

  return (
    <div className="flex flex-col">
      <pre className="break-all whitespace-pre-wrap">
       {quizPad}
      </pre>
      
      <hr className="rounded-full border-2 border-main-lightest my-4 " />
      <div className="flex items-start flex-row flex-wrap gap-4">
        {buttons}
      </div>
    </div>

  );
}

function SelectedBlank({ index }: { index: number }) {
  const pieces = useAppSelector(selectQuizPieces);
  const dispatch = useAppDispatch();

  const isEmpty = pieces[index]?.value.trim().length === 0;
  const empty = isEmpty ? "code-empty-btn" : "code-btn";
  const buttonText = isEmpty ? BLANK : pieces[index].value.trim();
  const spaces = pieces[index].value.slice(buttonText.length);

  return (
    <>
      <button
        className={`${empty}`}
        onClick={() => dispatch(removeSelection(index))}
      >
        {buttonText}
      </button>
      {spaces}
    </>
  );
}

