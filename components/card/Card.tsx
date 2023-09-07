"use client"

import { initCardAsync, selectCardState, selectCurrentCard, selectIsCorrect } from "@/redux/features/card/cardSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { QuizEnum } from "@prisma/client"
import Modal from "./Modal";
import { JetBrains_Mono } from "next/font/google";
import QuizOrder from "./QuizOrder";
import QuizFill from "./QuizFill";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

 
const jetBrainFont = JetBrains_Mono({ subsets: ["cyrillic-ext"] });


export default function Card() {
  const currentCard = useAppSelector(selectCurrentCard);
  const cardState = useAppSelector(selectCardState);
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  let quiz_body: React.ReactNode = <div></div>
  switch (currentCard?.quizType) {
    case QuizEnum.FILL:
      quiz_body = <QuizFill />
      break;
    case QuizEnum.ORDER:
      quiz_body = <QuizOrder />
      break;
  }

  useEffect(() => {
    if (cardState === "FINISHED") {
      dispatch(initCardAsync());
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardState]);

  let card_body: React.ReactNode = <div></div>
  switch (cardState) {
    case "CARD":
      card_body = (
        <div className="container p-4 mx-auto card bg-sky-800 rounded-xl">
          <div className={"mb-2 " + jetBrainFont.className}>
            {currentCard?.question}
          </div>
          {quiz_body}
        </div>
      );
      break;
    case "OK":
      card_body = (
        <Modal>
          <div>
            Correct!
          </div>
        </Modal>
      );
      break;
    case "NOK":
      card_body = (
        <Modal>
          <div>
            Wrong!
          </div>
        </Modal>);
      break;
  }

  return card_body;
  ;
}
