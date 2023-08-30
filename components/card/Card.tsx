"use client"

import { changeCardStateAsync, selectCardState, selectCurrentCard, setCardState } from "@/redux/features/card/cardSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Quiz_Type } from "@prisma/client"
import React, { useState } from "react";
import Modal from "./Modal";
import { json } from "stream/consumers";

export interface CardInterface {
  id: number,
  question: string,
  answers: string[],
}

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
        className="quiz-input" 
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

export default function Card() {
  const currentCard = useAppSelector(selectCurrentCard);
  const cardState = useAppSelector(selectCardState);

  let quiz_body: React.ReactNode = <div></div>
  switch (currentCard?.quiz_type) {
    case Quiz_Type.FILL:
      quiz_body = <QuizFill />
      break;
  }

  let card_body: React.ReactNode = <div></div>
  switch (cardState) {
    case "CARD":
      card_body = (
        <div className="container p-4 mx-auto card bg-sky-800 rounded-3xl">
          <div className="pl-4 mb-2">
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
