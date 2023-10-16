export function Actions(
  {
    handleSubmit,
  }: {
    handleSubmit: () => void;
  }
) {
  return (
    <div className="flex gap-4 justify-center">
      {/* <EditQuizButton /> */}
      <button
        className="btn"
        onClick={handleSubmit}
      >
        Submit Answer
      </button>
    </div>
  );
}
