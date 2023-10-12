"use client"

import { QuizSolve } from "@/components/quizSolve/QuizSolve"
import { selectQuiz } from "@/redux/features/quiz/quizSlice";
import { useAppSelector } from "@/redux/hooks";

export default function QuizPage() {
    // TODO need to work with add quiz
    // const quiz = useAppSelector(selectQuiz);
    return (
        // TODO need to work with add quiz
        <QuizSolve /* quiz={quiz} *//>
    )
}