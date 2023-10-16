export function QuizFill(
  {
    setAnswer,
  }: {
    setAnswer: (answer: string) => void;
  }
) {

  return (
    <textarea
      name="quiz-fill"
      id="quiz-fill"
      className="quiz-input flex-auto"
      spellCheck={false}
      autoFocus
      onChange={e => setAnswer(e.target.value)}
    ></textarea>
  );
}
