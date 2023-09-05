"use client"

import Navbar from "@/components/Navbar";
import { log } from "@/components/prisma";

import { initCardAsync, selectCategories, setCategoryAsync, selectCategoriesChecked } from "@/redux/features/card/cardSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { CategoryEnum } from "@prisma/client";
import { useRouter } from "next/navigation";
import {  useEffect, useState } from "react";


function Category({ category, idx }: { category: CategoryEnum, idx: number }) {
  const categories = useAppSelector(selectCategories);
  const categoriesChecked = useAppSelector(selectCategoriesChecked);
  const dispatch = useAppDispatch();
  const [checked, setChecked] = useState(categoriesChecked[categories.indexOf(category)]);

  
  function handleCheck(b: boolean) {
    setChecked(b);
  }

  useEffect(() => {
   // dispatch(addCategory({category: category, checked: checked}));
    dispatch(setCategoryAsync(category, checked));
    dispatch(initCardAsync());
  }, [checked]);

  const hId = `category-check-${idx}`
  return (
    <div className="bg-purple-950 px-3 py-1 rounded-md">
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
  const categories = useAppSelector(selectCategories);
  const router = useRouter();

/*   useEffect(() => {
    log("init")
    dispatch(initCardAsync());
  },[]); */
  
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="container bg-sky-800 rounded-sm p-4 mx-auto">
        <div>
          <h2 className="text-2xl text-center text-orange-300 my-3">
            Select the categories you want to learn.
          </h2>
          <div className="border-gray-100 border rounded-md p-4 grid grid-cols-3 gap-4 md:grid-cols-6 mb-4">
            {Object.values(CategoryEnum).map((c, i) => { 
              return (
                <Category key={i} category={c} idx={i} />
              )})}
          </div>
          <div className="flex justify-end">
            <button className="btn" onClick={e => {
              e.preventDefault();
              router.push("/learn")
            }}>
              Learn
            </button>
          </div>
        </div>

        <hr className="border border-gray-300 border- my-4 w-5/6 mx-auto" />

        <div>
        <h2 className="text-2xl text-center text-orange-300 my-3">
            Work with errors.
          </h2>

        </div>

      </main>
    </>
  )
}
