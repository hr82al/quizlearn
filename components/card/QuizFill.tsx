import { changeCardStateAsync, selectCurrentCard, setCardState } from "@/redux/features/card/cardSlice";
import { checkFill } from "@/redux/features/card/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { JetBrains_Mono } from "next/font/google";
import { useState } from "react";


export default function QuizFill() {
  const [answer, setAnswer] = useState("");
  const quiz = useAppSelector(selectCurrentCard);
  const dispatch = useAppDispatch();

  function handleSubmit() {
    if (checkFill(answer, quiz.answer)) {    
      dispatch(setCardState("OK"));
    } else {
      dispatch(setCardState("NOK"));
    }
    dispatch(changeCardStateAsync());
  }

  return (
    <>
    <div className="mx-4 card-question" >
      <input 
        name="quiz-input"
        type="text" 
        className="quiz-input "
        placeholder="Input your answer"
        autoComplete="off"
        onChange={(e) => {
          setAnswer(e.target.value)
        }}
      />
    </div>
    <button 
      className="block m-auto mt-4 btn"
      onClick={handleSubmit}
    >
        Submit answer
    </button>
  </>
  )
}
