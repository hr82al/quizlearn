import { JetBrains_Mono } from "next/font/google";
import Navbar from "../Navbar";
import { useState } from "react";
import { capitalize, splitToItems } from "@/quiz/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { QuizRecordPropertyType, UIEnum, addItem, nextScreen, properties, selectIsRadio, selectIsReady, selectQuizListItem, selectQuizProperty, selectQuizText, setIsRadio, setListItem, setScreen, setText } from "@/redux/features/quiz/quizSlice";



const jetBrainFont = JetBrains_Mono({ subsets: ["cyrillic-ext"] });


const test_quiz = `function greet(person: { name: string; age: number }) {
  return "Hello " + person.name;
}`;



export default function AddQuiz() {
  const dispatch = useAppDispatch();
  const text = useAppSelector(selectQuizText);
  const property = useAppSelector(selectQuizProperty);
  const isList = UIEnum[property as keyof typeof UIEnum].valueOf() === "list";
  const hidden = isList ? "" : "hidden";
  const listItem = useAppSelector(selectQuizListItem);
  const isReady = useAppSelector(selectIsReady);


  function handleNext() {
    dispatch(nextScreen());
  }

  function parseInfillinators() {
    const parsed = splitToItems(listItem);
    dispatch(setText(JSON.stringify(parsed)));
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
        <List />

        <div className="flex flex-wrap justify-end gap-2">
          <button 
            className={`btn ${property === "infillinators" ? "" : "hidden"}`}
            onClick={parseInfillinators}
          >
            Parse infillinator
          </button>
          <button
            className={`btn ${hidden}`}
            onClick={() => dispatch(addItem())}
          >
            Add
          </button>
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

function InputRadio({ property }: 
  { property: QuizRecordPropertyType }
) {
  const currentProperty = useAppSelector(selectQuizProperty);
  const dispatch = useAppDispatch();

  function handleChange() {
    dispatch(setScreen(property));
  }

  return (
    <label className="flex gap-4 justify-between rounded-full border-2 border-main-light px-2 py-1 w-44">
      {capitalize(property)}
      <input 
        type="radio"
        name="screen"
        checked={currentProperty === property}
        onChange={handleChange}
      />
    </label>
  )
}

function InputCheck ({ property }: { property: QuizRecordPropertyType }) {
  const dispatch = useAppDispatch();
  const checked = useAppSelector(selectIsRadio);
  
  function handleChange(e: boolean) {
    dispatch(setIsRadio(e));
  }

  return (
    <label className="flex gap-4 justify-between rounded-full border-2 border-main-light px-2 py-1 w-44">
      {capitalize(property)}
      <input 
        type="checkbox"
        name="checkbox"
        checked={checked}
        onChange={(e) => handleChange(e.target.checked)}
      />
    </label>
  );
}

function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const hidden: string =isOpen ? "" : "hidden ";
  const property = useAppSelector(selectQuizProperty);


  const inputs = properties.map((i, k) => {
    if (UIEnum[i as keyof typeof UIEnum] === UIEnum.isRadio) {
      return (
        <InputCheck key={k} property={i as QuizRecordPropertyType} />
      );
    } else {
      return (
        <InputRadio key={k} property={i as QuizRecordPropertyType} />
      );
    }
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

function List() {
  const property = useAppSelector(selectQuizProperty);
  const listItem = useAppSelector(selectQuizListItem);
  const dispatch = useAppDispatch();
  const typeUI = UIEnum[property as keyof typeof UIEnum].valueOf();
  const isList = typeUI === "list" || typeUI === "infillinators";
  const hidden = isList ? "" : "hidden";

  return (
    <textarea
      className={`quiz-input h-1/5 ${hidden}`}
      value={listItem}
      onChange={(e) => dispatch(setListItem(e.target.value))}
    >
    </textarea>
  );
}