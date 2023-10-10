import { useRouter } from "next/navigation";
import { MaterialSymbolsAddCircleRounded } from "../Icons";
import { useAppDispatch } from "@/redux/hooks";
import { quizClear } from "@/redux/features/quiz/quizSlice";

export default function Feed() {
  const router = useRouter();
  const dispatch = useAppDispatch()

  function handleAdd() {
    dispatch(quizClear());
    router.push("/add-quiz");
  }

  return (
    <div className="relative">

      <MaterialSymbolsAddCircleRounded
        width={80}
        height={80}
        className="fixed text-sky-800 add-icon cursor-pointer"
        onClick={handleAdd}
      />
    </div>
  );
}