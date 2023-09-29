import { JetBrains_Mono } from "next/font/google";
import Navbar from "../Navbar";
import { useState } from "react";
import { capitalize } from "@/quiz/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { nextProperty, properties, selectQuizProperty, selectQuizText, setText,  toProperty } from "@/redux/features/quiz/quizSlice";
import { hlog } from "../prisma";


const jetBrainFont = JetBrains_Mono({ subsets: ["cyrillic-ext"] });


const test_quiz = `function greet(person: { name: string; age: number }) {
  return "Hello " + person.name;
}`;



export default function AddQuiz() {
  const dispatch = useAppDispatch();
  const text = useAppSelector(selectQuizText);
  const property = useAppSelector(selectQuizProperty)

  // TODO
  const isReady = false;

  
  function handleNext() {
    dispatch(nextProperty());
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar>
        {capitalize(property)}
      </Navbar>
      <div
        className={`main-container flex-auto flex flex-col gap-4 ${jetBrainFont.className}`}
      >
        <textarea 
          className="quiz-input flex-auto"
          autoFocus
          onChange={e => dispatch(setText(e.target.value))}
          value={text}
        >
        </textarea>

        <div className="flex flex-wrap justify-end gap-2">
          <Menu />
          <button 
            className="btn w-28"
            onClick={handleNext}
          >
            Next
          </button>
          <button className="btn w-28" disabled={!isReady}>
            Preview
          </button>
          <button className="btn w-28" disabled={!isReady}>
            Finish
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ property }: 
  { property: string }
) {
  const currentProperty = useAppSelector(selectQuizProperty);
  const dispatch = useAppDispatch();

  function handleChange() {
    hlog(property);
    dispatch(toProperty(property));
  }

  return (
    <label className="flex gap-4 justify-between rounded-full border-2 border-main-light px-2 py-1 w-44">
      {capitalize(property)}
      <input 
        type="radio" 
        name="screen"
        checked={currentProperty === property}
        onClick={handleChange}
      />
    </label>
  )
}

function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const hidden: string =isOpen ? "" : "hidden ";


  const inputs = properties.map((i, k) => {
    return (
      <Input 
        key={k} 
        property={i}
      />
    );
  });
  return (
    <div className="relative">
      <button className="btn" onClick={() => setIsOpen(!isOpen)}>Menu</button>
      <div id="menu-buttons" 
        className={`${hidden} bg-main-base absolute bottom-14 rounded-lg p-4 border-main-light border-2 flex flex-wrap gap-2`}
      >
        {inputs}
      </div>
    </div>
  );
}