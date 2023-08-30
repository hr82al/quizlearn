import { Quiz } from "@prisma/client";

export async function getCards() {
  const start = 1;
  const end = 5
  const quiz: Quiz[] = await ( await fetch(`${location.origin}/api/quiz?start=${start}&end=${end}`)).json() as Quiz[];
  return quiz;
}

export async function getQuiz(id: number) {
  const quiz: Quiz = await ( await fetch(`${location.origin}/api/quiz?id=${id}`)).json() as Quiz;
  return quiz;
}