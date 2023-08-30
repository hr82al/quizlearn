import { Quiz } from "@prisma/client";

const NUMBER_PRELOADED_CARDS = 5;

export async function getCards(start_db: number) {
  const end = start_db + NUMBER_PRELOADED_CARDS;
  const quiz: Quiz[] = await ( await fetch(`${location.origin}/api/quiz?start=${start_db}&end=${end}`)).json() as Quiz[];
  return quiz;
}

export async function getQuiz(n: number) {
  const quiz: Quiz = await ( await fetch(`${location.origin}/api/quiz?n=${n}`)).json() as Quiz;
  return quiz;
}