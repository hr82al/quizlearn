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

export const defaultQuiz: QuizRecord = radioQuiz
/* {
  question: "",
  variants: [],
  isRadio: true,
  isShort: true,
  answers: [],
};
 */