import { BLANK, QuizFragment } from "./quiz";

export function QuizSelectedBlank(
  {
    index, 
    fragments,
    removeSelection,
  }: {
    index: number,
    fragments: QuizFragment[],
    removeSelection: (index: number) => void;
  }) {


  const isEmpty = fragments[index]?.value.trim().length === 0;
  const empty = isEmpty ? "code-empty-btn" : "code-btn";
  const buttonText = isEmpty ? BLANK : fragments[index].value.trim();
  const spaces = fragments[index].value.slice(buttonText.length);

  return (
    <>
      <button
        className={`${empty}`}
        onClick={() => removeSelection(index)}
      >
        {buttonText}
      </button>
      {spaces}
    </>
  );
}
