import { Quiz } from "@prisma/client";

export default function QuizFill({ quiz }: {quiz: Quiz}) {
  return (
    <div className="mx-4 card-question" >
      {quiz.question}
    </div>
  )
}