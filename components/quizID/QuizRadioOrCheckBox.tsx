export function QuizRadioOrCheckBox(
  {
    type, toName, toId, handleClick, quizVariants,
  }: {
    type: React.HTMLInputTypeAttribute | undefined;
    toName: (idx?: number) => string;
    toId: (idx?: number) => string;
    handleClick: (answer: string, isSet?: boolean) => void;
    quizVariants: string[];
  }) {


  const items = quizVariants.map((i, k) => {
    return (
      <div key={k} className="bg-main-darkest px-4 py-2 rounded-full border-2 border-main-light">
        <input
          type={type}
          name={toName(k)}
          id={toId(k)}
          className="mr-2"
          onChange={e => handleClick(i, e.target.checked)} />
        <label htmlFor={toId(k)}>{i}</label>
      </div>
    );
  });

  return (
    <div className="inline-flex flex-col gap-2">
      {items}
    </div>
  );
}
