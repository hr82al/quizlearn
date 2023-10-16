export function QuizResult(
  {
    isCorrect,
  }: {
    isCorrect: boolean;
  }
) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-70 overflow-y-auto h-full w-full">
      <div className="fixed  py-14 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 px-8 bg-main-darkest animate-result rounded-full border-4 border-main-light">
        { isCorrect ? "Correct" : "Incorrect" }
      </div>
    </div>
  );
}
