"use client"

import { useEffect } from "react"
import { RepeatIcon, ViewIcon } from "./Icons";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchResultAsync, selectResult } from "@/redux/features/resultSlice";


export default function Results() {
  const session = useSession();
  const result = useAppSelector(selectResult);
  const dispatch = useAppDispatch();

  function handleRepeat(quizId: number) {

  }

  function handleView(quizId: number) {

  }

  useEffect(() => {
    if (typeof session.data?.user.id === "number" && session.data.user.id >= 0 && result.length === 0) {
      dispatch(fetchResultAsync());
    }
  }, [session.data?.user.id]);

  let body = <div></div>
  if (result.length > 0) {
    body = (
<div>
      <hr className="w-5/6 mx-auto my-4 border border-gray-300 border-" />

      <div>
        <h2 className="my-3 text-2xl text-center text-orange-300">
          Work with errors.
        </h2>

        <div className="grid grid-cols-1 gap-4 p-4 border border-gray-100 rounded-md sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 place-items-center">
          {
            Array.isArray(result) && result.map((e) => {
              return (
                <div key={e.id} className="flex items-center justify-around w-56 px-4 py-2 rounded-md bg-zinc-700">

                  {e.isCorrect ? (
                    <div className="w-24 text-center uppercase bg-green-500 rounded-sm">
                      You win
                    </div>
                  ) : (
                    <div className="w-24 text-center uppercase align-middle bg-red-500 rounded-sm">
                      You lost
                    </div>
                  )}
                  <div onClick={() => { handleRepeat(e.quizId) }}>
                    <RepeatIcon height={34} width={34} className="flex-shrink-0 p-1 text-green-400 rounded-md bg-zinc-800 " />
                  </div>
                  <div onClick={() => { handleView(e.quizId) }}>
                    <ViewIcon height={34} width={34} className="flex-shrink-0 p-1 text-gray-400 rounded-md bg-zinc-800" />
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    </div>
    );
  }

  return body;
}