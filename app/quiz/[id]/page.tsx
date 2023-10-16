"use client"
import QuizID from "@/components/quizID/QuizID";


export default function QuizPage(
  { params: { id } }:
  { params: { id: number }}
) {
  return <QuizID id={id} />
}