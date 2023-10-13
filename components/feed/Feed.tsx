import { useRouter } from "next/navigation";
import { MaterialSymbolsAddCircleRounded } from "../Icons";
import { useAppDispatch } from "@/redux/hooks";
import { quizClear } from "@/redux/features/quiz/quizSlice";
import { Quiz } from "@prisma/client";
import { useEffect, useState } from "react";
import "@/quiz/utils";
import { Poppins } from "next/font/google";
import { initQuiz } from "@/redux/features/quizSolveSlice/quizSolveSlice";

const poppinsBold = Poppins({ weight: "700", subsets: ["latin-ext"] });
const poppinsBlack = Poppins({ weight: "900", subsets: ["latin-ext"] });


export async function getQuizzes(): Promise<Quiz[]> {
  try {
    const result = await(await fetch("/api/quiz/random", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })).json();

    return result as Quiz[];
  } catch (error) {
    return [] as Quiz[];
  }
}

export default function Feed() {
  const router = useRouter();
  const dispatch = useAppDispatch()
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  function handleAdd() {
    dispatch(quizClear());
    router.push("/add-quiz");
  }

  useEffect(() => {
    getQuizzes().then(quizzes => setQuizzes(quizzes));
  }, []);

  const quizzesJSX = quizzes
  .mapJoin(
    (q, k) => {
      return <ShortQuiz key={k} quiz={q}/>
    },
    (k) => {
      return <hr className="border-main-darkest my-2" key={k}/>
    }
    )

  return (
    <div className="relative flex flex-col min-h-full flex-auto">

      <div className="main-container flex-auto bg-main-base my-auto">
        {quizzesJSX}
      </div>
      <MaterialSymbolsAddCircleRounded
        width={80}
        height={80}
        className="fixed text-violet-300 add-icon cursor-pointer"
        onClick={handleAdd}
      />
    </div>
  );
}

function ShortQuiz({ quiz }: { quiz: Quiz }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  function handleSolveQuiz() {
    dispatch(initQuiz(quiz));
    router.push("/quiz");
  }

  return (
    <div className="cursor-pointer" onClick={handleSolveQuiz}>
      <div>
        <div
          className={`${poppinsBlack.className} inline-block text-xl bg-main-darkest rounded-full p-1 mr-3 border-2 border-main-light`}
        >
          {quiz.category}
        </div>
        <div className={`${poppinsBold.className} inline-block text-xl`}>
          {quiz.ownerName}
        </div>
      </div>
      <div className="ml-8 mt-2">
       {quiz.question}
      </div>
    </div>
  );
}

