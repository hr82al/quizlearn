import { useAppSelector } from "@/redux/hooks";
import { selectQuizPieces } from "@/redux/features/quizSolveSlice/quizSolveSlice";

export function Preformatted({ index }: { index: number; }) {
  const pieces = useAppSelector(selectQuizPieces);
  return (
    <pre className="inline break-all whitespace-pre-wrap">
      {pieces[index].value}
    </pre>
  );
}
