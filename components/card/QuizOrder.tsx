import { selectCurrentCard, submitCardAsync } from "@/redux/features/card/card2Slice";
import { checkFill } from "@/redux/features/card/utils";
import { deleteLastPlate, initCurrentCardOrder, putToAnswer, selectAnswer, selectQuiz, selectUserAnswer } from "@/redux/features/plate/plateSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";
import { BackspaceIcon } from "../Icons";


/*
An ORDER type db row which contains an answer in correct order and a quiz which contains confusing elements separated with space.
Need to take a db answer split it to element add elements from a db quiz and shuffle it. User has to make it in a correct order and this function should check it according to the db answer. The shuffled list of elements render like flex plates with text. 
 */
export default function QuizOrder() {
  const dispatch = useAppDispatch();
  const currentCard = useAppSelector(selectCurrentCard);
  const quizPlates = useAppSelector(selectQuiz);
  const usersAnswer = useAppSelector(selectUserAnswer);

  function handleSubmit() {
    const isCorrect = checkFill(usersAnswer.join(""), currentCard.answer);
    dispatch(submitCardAsync(isCorrect))
    /* if (checkFill(usersAnswer.join(""), currentCard.answer)) {    
      dispatch(setCardState("OK"));
    } else {
      dispatch(setCardState("NOK"));
    }
    dispatch(changeCardStateAsync()); */
  }

  const plates = quizPlates.map((plate, i) => {
    return (
      <li 
        key={i}
        className={`inline-block px-4 py-1 drop-shadow-lg bg-sky-950 rounded-md m-1 select-none ${plate.isVisible ? "" : "text-sky-950"}`}
        onClick={() => {
          dispatch(putToAnswer(i));
        }}
      >
        {plate.text}
      </li>
    );
  });

  useEffect(() => {
    dispatch(initCurrentCardOrder({
      answer: currentCard.answer,
      quiz: currentCard.quiz,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCard.answer, currentCard.quiz]);

  return (
    <div>
      <pre className="h-24 min-h-0 p-2 mb-3 break-all whitespace-pre-wrap rounded-sm bg-violet-950">
        {usersAnswer.join("")}
      </pre>

      <ul className="flex flex-row flex-wrap plates-pad">
        {plates}
      </ul>

      <hr className="w-5/6 mx-auto my-3 border-violet-400 drop-shadow-sm" />
      <div className="flex content-center justify-center gap-5" >
        <button 
          className="btn"
          onClick={() => dispatch(deleteLastPlate())}
        >
        <BackspaceIcon />
        </button>

        <button
          className="btn"
          onClick={handleSubmit}
        >
          Submit answer
            </button>
      </div>
    </div>
  );
}