import { QuizFragment } from "./quiz";
import { Preformatted } from "./Preformatted";
import { QuizSelectedBlank } from "./QuizSelectedBlank";




export function QuizSelectBlanks(
  {
    fragments, removeSelection, addSelection, quizUniqueVariants, quizVariants,
  }: {
    fragments: QuizFragment[];
    removeSelection: (index: number) => void;
    addSelection: (text: string) => void;
    quizUniqueVariants: string[];
    quizVariants: string[];
  }
) {


  const quizPad = fragments.map((item, idx) => {
    if (!item.isBlank) {
      return (
        <Preformatted
          key={idx}
          text={item.value} />
      );
    } else {
      return <QuizSelectedBlank key={idx} index={idx} fragments={fragments} removeSelection={ removeSelection }/>;
    }
  });

  


  function handleAdd(text: string) {
    addSelection(text);
  }

  const buttons = quizUniqueVariants.map((item, idx) => {
    const isDisabled = quizVariants.filter(variant => variant.trim() === item).length === fragments.filter(i => i.value.trim() === item).length;
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


