import { QuizRecord } from "./quizSlice";


const radioQuiz: QuizRecord = {
  question: `What is the output?
print('abef'.partition('cd'))`,
  variants: [
    "('abef','','')",
    "('abef')",
    "('abef','cd','')",
    "Error",
  ],
  isRadio: true,
  isShort: false,
  answers: ["('abef','','')"],
};

const checkboxQuiz: QuizRecord = {
  question: "Select only access modifiers in Java",
  variants: [
    "public",
    "static",
    "protected",
    "friend",
    "void",
  ],
  isRadio: false,
  isShort: false,
  answers: [
    "public",
    "protected",
  ],
};

export const defaultQuiz: QuizRecord = checkboxQuiz;
/* {
  question: "",
  variants: [],
  isRadio: true,
  isShort: true,
  answers: [],
};
 */