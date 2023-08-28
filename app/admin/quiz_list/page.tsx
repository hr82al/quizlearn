"use client"

import { Quiz } from "@prisma/client";
import { useEffect, useState } from "react";

async function getItems() {
  const result = await (await fetch(`${location.origin}/api/quiz`)).json() as Quiz[];
  return result;
}

export default function ListQuiz() {
  const [items, setItems] = useState<Quiz[]>([]);

  const listItems = items.map((e) => {
    return (
      <tr key={e.id}>
        <td className="p-2 border bg-sky-950 border-slate-400">
          {e.question}
        </td>
        <td className="p-2 border bg-sky-950 border-slate-400">
          {e.quiz_type}
        </td>
        <td className="p-2 border bg-sky-950 border-slate-400">
          {e.quiz}
        </td>
        <td className="p-2 border bg-sky-950 border-slate-400">
          {e.answer}
        </td>
      </tr>
    );
  });

  useEffect(() => {
    getItems().then(data => {
      setItems(data);
    });
  }, []);

  return (
    <div className="p-5 mx-auto w-max bg-blue-950 rounded-xl text-slate-400" >
      <table className="border border-collapse border-slate-400">
        <thead>
          <tr>
            <th className="p-2 text-left border text-slate-200 border-slate-400 bg-slate-600" >Type</th>
            <th className="p-2 text-left border text-slate-200 border-slate-400 bg-slate-600" >Quiz</th>
            <th className="p-2 text-left border text-slate-200 border-slate-400 bg-slate-600" >Question</th>
            <th className="p-2 text-left border text-slate-200 border-slate-400 bg-slate-600" >Answer</th>
          </tr>
        </thead>
        <tbody>
          {listItems}
        </tbody>
      </table>
    </div>
  );
}