"use client"

import { selectCardState, selectCurrentCard } from "@/redux/features/card/cardSlice";
import { useAppSelector } from "@/redux/hooks";
import { QuizType } from "@prisma/client"
import Modal from "./Modal";
import { JetBrains_Mono } from "next/font/google";
import QuizOrder from "./QuizOrder";
import QuizFill from "./QuizFill";

//const log = console.log;
 
const jetBrainFont = JetBrains_Mono({ subsets: ["cyrillic-ext"] });


export default function Card() {
  const currentCard = useAppSelector(selectCurrentCard);
  const cardState = useAppSelector(selectCardState);

  let quiz_body: React.ReactNode = <div></div>
  switch (currentCard?.quizType) {
    case QuizType.FILL:
      quiz_body = <QuizFill />
      break;
    case QuizType.ORDER:
      quiz_body = <QuizOrder />
      break;
  }

  let card_body: React.ReactNode = <div></div>
  switch (cardState) {
    case "CARD":
      card_body = (
        <div className="container p-4 mx-auto card bg-sky-800 rounded-3xl">
          <div className={"mb-2 " + jetBrainFont.className}>
            {currentCard?.question}
          </div>
          {quiz_body}
        </div>
      );
      break;
    case "OK":
      card_body = <Modal>OK</Modal>
      break;
    case "NOK":
      card_body = <Modal>NOK</Modal>
      break;
  }

  return card_body;
}
