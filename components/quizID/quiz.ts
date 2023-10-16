import { Quiz } from "@prisma/client";


const BLANK_RE = new RegExp("(\\.\\.\\.\\.)");
export const BLANK = "....";

export interface QuizFragment {
  value: string;
  isBlank: boolean;
}


export const enum QuizKind {
  // A kind is not detected yet or the data is bad
  NONE,
  // We have body with blanks which need to fill
  FILL_BLANKS,
  // We have blanks and variants to choose
  SELECT_BLANKS,
  // We do not have blanks and variants and it is short
  FILL_SHORT,
  // We do not have blanks and variants and it is not short
  FILL,
  // We do not have blanks but have variants and isRadio is true
  RADIO,
  // We do not have blanks but have variants and isRadio is false
  CHECKBOX,
} 


export function parseQuiz(quiz: Quiz) {
  let tmp = quiz.question.split(BLANK_RE).filter(t => t.length > 0);
  const blankIndexes: number[] = [];
  const quizFragments: QuizFragment[] = tmp.map((i, idx) => {
    if (i === BLANK) {
      blankIndexes.push(idx);
      return { value: "", isBlank: true };
    } else {
      return { value: i, isBlank: false };
    }
  });
  const quizUniqueVariants: string[] = [];
  const quizVariants: string[] = JSON.parse(quiz.variants);
  quizVariants.forEach(variant => {
    const trimmedVariant = variant.trim();
    if (!quizUniqueVariants.includes(trimmedVariant)) {
      quizUniqueVariants.push(trimmedVariant);
    }
  });
  const kind = detectQuizKind(quiz, quizVariants, blankIndexes.length);
  const quizAnswers: string[] = JSON.parse(quiz.answers);
  return { kind, quizVariants, quizAnswers, quizFragments, quizUniqueVariants };
}

function detectQuizKind(quiz: Quiz, quizVariants: string[], blanksNum: number): QuizKind {
  if (blanksNum > 0 && quizVariants.length === 0) {
    return QuizKind.FILL_BLANKS;
  } else if (blanksNum > 0 && quizVariants.length > 0) {
    return QuizKind.SELECT_BLANKS;
  } else if (blanksNum === 0 && quizVariants.length === 0) {
    if (quiz.isShort) {
      return QuizKind.FILL_SHORT;
    } else {
      return QuizKind.FILL;
    }
  } else if (blanksNum === 0 && quizVariants.length > 0) {
    if (quiz.isRadio) {
      return QuizKind.RADIO;
    } else {
      return QuizKind.CHECKBOX;
    }
  }
  return QuizKind.NONE;
}

