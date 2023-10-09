import { QuizRecord } from "./quizSlice";


const radioQuiz: QuizRecord = {
  question: `What is the output?
print('home'.partition('cd'))`,
  variants: [
    "('home','','')",
    "('home')",
    "('home','cd','')",
    "Error",
  ],
  isRadio: true,
  isShort: false,
  answers: ["('home','','')"],
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
};

const fillShortQuiz: QuizRecord = {
  question: "Solve equation: 3x + 2 = 11",
  isRadio: false,
  isShort: true,
  variants: [],
  answers: [
    "3",
  ]
};

const selectBlanksQuiz: QuizRecord = {
  question: "Put in right order\n....",
  isRadio: false,
  isShort: false,
  variants: ["greet","+ ","function ","\"","\" ","age",") ","}","}","name","name","{ ","{\n  ",": ",": ",": ","; ",";\n","return ","Hello ","string","person","person","number ",".","("],
  answers: [
    `function greet(person: { name: string; age: number }) {
  return "Hello " + person.name;
}`,
  ],
}

export const defaultQuiz: QuizRecord = selectBlanksQuiz;
/* {
  question: "",
  variants: [],
  isRadio: true,
  isShort: true,
  answers: [],
};
 */