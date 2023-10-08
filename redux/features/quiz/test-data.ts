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

const fillQuiz: QuizRecord = {
  question: "Write a program in C to output \"Hello, World!\".",
  isRadio: false,
  isShort: false,
  variants: [],
  answers: [
    `#include <stdio.h>

int main() {
  printf("Hello, World!");
  return 0;
}`
  ],
};

const fillBlanksQuiz: QuizRecord = {
  question:
`Fill in the blanks ot output string in C
int main() {
  ....("Hello, World!");
  return 0;
}`,
  isRadio: false,
  isShort: false,
  variants: [],
  answers: [
    "printf",
  ]
}

export const defaultQuiz: QuizRecord = fillBlanksQuiz;
/* {
  question: "",
  variants: [],
  isRadio: true,
  isShort: true,
  answers: [],
};
 */