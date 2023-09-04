import { changeCardStateAsync, selectCurrentCard, setCardState } from "@/redux/features/card/cardSlice";
import { checkFill } from "@/redux/features/card/utils";
import { deleteLastPlate, initCurrentCardOrder, putToAnswer, selectAnswer, selectQuiz, selectUserAnswer } from "@/redux/features/plate/plateSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";
import DeleteSVG from "./DeleteSVG";


/*
An ORDER type db row which contains an answer in correct order and a quiz which contains confusing elements separated with space.
Need to take a db answer split it to element add elements from a db quiz and shuffle it. User has to make it in a correct order and this function should check it according to the db answer. The shuffled list of elements render like flex plates with text. 
 */
export default function QuizOrder() {
  const dispatch = useAppDispatch();
  const currentCard = useAppSelector(selectCurrentCard);
  const quizPlates = useAppSelector(selectQuiz);
  const usersAnswer = useAppSelector(selectUserAnswer);
  const answer = useAppSelector(selectAnswer);

  function handleSubmit() {
    if (checkFill(usersAnswer.join(""), currentCard.answer)) {    
      dispatch(setCardState("OK"));
    } else {
      dispatch(setCardState("NOK"));
    }
    dispatch(changeCardStateAsync());
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
  }, [currentCard.answer, currentCard.quiz]);

  return (
    <div>
      <pre className="h-24 min-h-0 bg-violet-950 rounded-sm whitespace-pre-wrap p-2 break-all mb-3">
        {usersAnswer.join("")}
      </pre>

      <ul className="plates-pad flex flex-wrap flex-row">
        {plates}
      </ul>

      <hr className="my-3 w-5/6 mx-auto border-violet-400 drop-shadow-sm" />
      <div className="flex justify-center content-center gap-5" >
        <button 
          className="btn"
          onClick={() => dispatch(deleteLastPlate())}
        >
        <DeleteSVG />
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