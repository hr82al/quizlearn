"use client"

import { QuizSolve } from "@/components/quizSolve/QuizSolve"
import { selectQuiz } from "@/redux/features/quiz/quizSlice";
import { useAppSelector } from "@/redux/hooks";

export default function QuizPage() {
    const quiz = useAppSelector(selectQuiz);
    return (
        <QuizSolve quiz={quiz}/>
    )
}