"use client"

import Navbar from "@/components/Navbar";
import Results from "@/components/results";

import { initCardAsync, selectCategoriesChecked, selectCards, selectIsCorrect, resetCards, setCategory, categories, selectCardsNum } from "@/redux/features/card/cardSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { CategoryEnum } from "@prisma/client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {  useEffect, useState } from "react";


function Category({ category, idx }: { category: CategoryEnum, idx: number }) {
  const categoriesChecked = useAppSelector(selectCategoriesChecked);
  const dispatch = useAppDispatch();
  const [checked, setChecked] = useState(categoriesChecked[categories.indexOf(category)]);
  const {data : session} = useSession();

  const isLogged = typeof session?.user.id === "number" && session.user.id >= 0;


  
  function handleCheck(b: boolean) {
    if (isLogged) {
      setChecked(b);
      resetCategories(b);
    } else {
      signIn();
    }
  }

  function resetCategories(checked: boolean) {
      dispatch(resetCards());
      dispatch(setCategory({ category: category, checked: checked}))
      dispatch(initCardAsync());
  }

  const hId = `category-check-${idx}`
  return (
    <div className="px-3 py-1 rounded-md bg-purple-950">
      <label htmlFor={hId}>
        <input id={hId} name={hId} type="checkbox"
          checked={checked}
          className="mr-2"
          onChange={e => handleCheck(e.target.checked)}
        />
        {category}
      </label>
    </div>
  )
}

export default function Home() {
  const dispatch = useAppDispatch();
  const cards = useAppSelector(selectCards);
  const isCorrect = useAppSelector(selectIsCorrect);
  const router = useRouter();
  const cardsNum = useAppSelector(selectCardsNum);

  useEffect(() => {
    if (cards.cards.length === isCorrect.length) {
      dispatch(resetCards());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[cards.cards.length, isCorrect.length]);
  
  return (
    <>
      <header>
        <Navbar>
        </Navbar>
      </header>
      <main className="container p-4 mx-auto rounded-sm bg-sky-800">
        <div>
          <h2 className="my-3 text-2xl text-center text-orange-300">
            Select the categories you want to learn.
          </h2>
          <div className="grid grid-cols-3 gap-4 p-4 mb-4 border border-gray-100 rounded-md md:grid-cols-6">
            {Object.values(CategoryEnum).map((c, i) => { 
              return (
                <Category key={i} category={c} idx={i} />
              )})}
          </div>
          <div className="flex justify-end">
            <button 
              className="btn" onClick={e => {
                e.preventDefault();
                router.push("/learn")
              }}
              disabled={cardsNum === 0}
            >
              Learn
            </button>
          </div>
        </div>
          <Results />
      </main>
    </>
  )
}
