import { QuizFragment } from "./quiz";

export function radioQuizCheckAnswer(userAnswer: string, quizAnswers: string[]): boolean {
  if (userAnswer.length > 0) {
    for (let i = 0; i < quizAnswers.length; i++){
      const answer = quizAnswers[i];
      if (userAnswer === answer) {
        return true;
      }
    }
  }
  return false;
}


export function checkboxQuizCheckAnswer(userAnswers: string[], quizAnswers: string[]): boolean {
  // If user hasn't checked one of the answers return false
  for (let i = 0; i < quizAnswers.length; i++) {
    const answer = quizAnswers[i];
    if (!userAnswers.includes(answer)) {
      return false;
    }
  }
  // If user checked answer which is not in correct answers
  for (let i = 0; i < userAnswers.length; i++) {
    const userAnswer = userAnswers[i];
    if (!quizAnswers.includes(userAnswer)) {
      return false;
    }
  }
  return true;
}


function splitToCodeItems(code: string): string {
  return code.split(/[\n \t]/).filter(i => i.length > 0).join("");
}


// Equals a code regardless of spaces characters
function compareCodes(code1: string, code2: string): boolean {
  const tmp1 = splitToCodeItems(code1);
  const tmp2 = splitToCodeItems(code2);
  return tmp1 === tmp2;
}


export function fillQuizCheckAnswer(userAnswer: string, quizAnswers: string[]) {
  return quizAnswers.some((code) => compareCodes(code, userAnswer));
}

export function fillBlanksQuizCheckAnswer(quizFragments: QuizFragment[], quizAnswers: string[]) {
  // collect filled blanks to userAnswer;
  let userAnswers: string[] = [];
  quizFragments.forEach(item => {
    if (item.isBlank) {
      userAnswers.push(item.value);
    }
  });
  const jointAnswer = userAnswers.join(" ");
  for (let i = 0; i < quizAnswers.length; i++) {
    if (jointAnswer === quizAnswers[i]) {
      return true;
    }
  }
  return false;
}


export function fillShortQuizCheckAnswer(userAnswer: string, quizAnswers: string[]) {
  return quizAnswers.some((answer) => compareCodes(userAnswer, answer));
}


export function selectBlanksCheckAnswer(fragments: QuizFragment[], quizAnswers: string[]) {
  const userAnswer = fragments.filter(p => p.isBlank).map(p => p.value).join("");
  return quizAnswers.some(answer => compareCodes(answer, userAnswer));
}