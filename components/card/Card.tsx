"use client"

import { changeCardStateAsync, selectCardState, selectCurrentCard, setCardState } from "@/redux/features/card/cardSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Quiz_Type } from "@prisma/client"
import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { JetBrains_Mono } from "next/font/google";
import { deleteLastPlate, initCurrentCardOrder, putToAnswer, selectAnswer, selectQuiz, selectUserAnswer } from "@/redux/features/plate/plateSlice";

//const log = console.log;
 
const jetBrainFont = JetBrains_Mono({ subsets: ["cyrillic-ext"] });

function splitToWords(text: string): string[] {
  return text.split(" ").filter(w => w.length > 0);
}


/*
An answer in a database can be in two variants
1 - plain string 
  "Some answer"
2 - array encoded as a json in a plain string. And checker should output correct if user's answer is equal on of the variants
  '["text1","text2"]' 
 */
function checkFill(usersAnswer: string, dbAnswer: string) {
  console.log(dbAnswer)
  try {
    let tmp: string | string[];
    tmp = JSON.parse(dbAnswer);
    if (Array.isArray(tmp) && tmp.length > 0 && typeof tmp[0] === "string") {
      for (const i of tmp) {
        if (checkVariant(i, usersAnswer)) {
          return true;
        }
      }
    } 
    return false;
  } catch (error) {
    return checkVariant(dbAnswer, usersAnswer);
  }
}

function checkVariant(text1: string, text2: string) {
  const tmp1 = splitToWords(text1);
  const tmp2 = splitToWords(text2);
  if (tmp1.length != tmp2.length) {
    return false;
  }
  for (let i = 0; i < tmp1.length; i++) {
    if (tmp1[i] !== tmp2[i]) {
      return false;
    } 
  }
  return true;
}

function DeleteSVG() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48"><mask id="ipSDeleteKey0"><g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"><path fill="#fff" stroke="#fff" d="M18.424 10.538A2 2 0 0 1 19.788 10H42a2 2 0 0 1 2 2v24a2 2 0 0 1-2 2H19.788a2 2 0 0 1-1.364-.538L4 24l14.424-13.462Z"></path><path stroke="#000" d="M36 19L26 29m0-10l10 10"></path></g></mask><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSDeleteKey0)"></path></svg>
  );
}

function QuizFill() {
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
        className={"quiz-input " + jetBrainFont.className}
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

/*
An ORDER type db row which contains an answer in correct order and a quiz which contains confusing elements separated with space.
Need to take a db answer split it to element add elements from a db quiz and shuffle it. User has to make it in a correct order and this function should check it according to the db answer. The shuffled list of elements render like flex plates with text. 
 */
function QuizOrder() {
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
  }, [currentCard.answer]);

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

export default function Card() {
  const currentCard = useAppSelector(selectCurrentCard);
  const cardState = useAppSelector(selectCardState);

  let quiz_body: React.ReactNode = <div></div>
  switch (currentCard?.quiz_type) {
    case Quiz_Type.FILL:
      quiz_body = <QuizFill />
      break;
    case Quiz_Type.ORDER:
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
