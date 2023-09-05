import { CategoryEnum, Quiz } from "@prisma/client";

const NUMBER_PRELOADED_QUIZZES = 5;

export async function getCards(categories: CategoryEnum[]) {
  if (categories.length === 0) {
    return [];
  }

  const quiz: Quiz[] = await ( await fetch(
    `${location.origin}/api/quiz`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        categories: categories,
        num: NUMBER_PRELOADED_QUIZZES,
      }),
    }
    )).json() as Quiz[];
  return quiz;
}

export async function getQuiz(n: number) {
  const quiz: Quiz = await ( await fetch(`${location.origin}/api/quiz?n=${n}`)).json() as Quiz;
  return quiz;
}