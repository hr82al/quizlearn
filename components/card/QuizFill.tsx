import { changeCardStateAsync, selectCurrentCard, setCardState } from "@/redux/features/card/cardSlice";
import { checkFill } from "@/redux/features/card/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { KeyboardEvent, useState } from "react";


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

  function handleEnter(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <>
    <div className="card-question" >
      <input 
        name="quiz-input"
        type="text" 
        className="quiz-input "
        placeholder="Input your answer"
        autoComplete="off"
        autoFocus={true}
        onChange={(e) => {
          setAnswer(e.target.value)
        }}
        onKeyDown={handleEnter}
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
