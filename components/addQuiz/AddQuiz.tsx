import { JetBrains_Mono } from "next/font/google";
import Navbar from "../Navbar";
import React, { useRef, useState } from "react";
import { splitToItems } from "@/quiz/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { BLANK, QuizRecordProperty, ScreensKind, addItem, addItems, nextScreen, properties, propertyIsScreenKind, propertyTyCaption, selectIsReady, selectQuiz, selectQuizListItem, selectQuizProperty, selectQuizText, setCheckbox, setListItem, setScreen, setText } from "@/redux/features/quiz/quizSlice";
import { useRouter } from "next/navigation";


const jetBrainFont = JetBrains_Mono({ subsets: ["cyrillic-ext"] });


export default function AddQuiz() {
  const dispatch = useAppDispatch();
  const text = useAppSelector(selectQuizText);
  const property = useAppSelector(selectQuizProperty);
  const isList = propertyIsScreenKind(property, ScreensKind.LIST);
  const hidden = isList ? "" : "hidden";
  const listItem = useAppSelector(selectQuizListItem);
  const isReady = useAppSelector(selectIsReady);
  const router = useRouter();
  const ref = useRef<HTMLTextAreaElement>(null);


  function handleNext() {
    dispatch(nextScreen());
  }

  function parseInfillinators() {
    const parsed = splitToItems(listItem);
    let variants: string[] = [];
    parsed.forEach(item => {
      variants = variants.concat(item[1]);
    })
    dispatch(addItems(variants));
  }

  function handleBlank() {
    const { current } = ref;
    const start = current?.selectionStart;
    const end = current?.selectionEnd;

    if (typeof start === "number" && typeof end === "number" && current !== null) {
      const newText = [
        text.substring(0, start),
        BLANK,
        text.substring(end),
      ].join("");
      dispatch(setText(newText));
      // this sets the cursor pos after the inserted text
      setTimeout(() => {
        current.selectionStart = current.selectionEnd = start + BLANK.length;
      }, 0);
    }
  }

  function handleChange(value: string) {
    dispatch(setText(value));
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar>
        {propertyTyCaption(property)}
      </Navbar>
      <div
        className={`main-container flex-auto flex flex-col gap-4 ${jetBrainFont.className}`}
      >
        <textarea
          ref={ref}
          id="add-quiz-text"
          className="quiz-input flex-auto"
          autoFocus
          onChange={e => handleChange(e.target.value)}
          value={text}
        >
        </textarea>
        <List />

        <div className="flex flex-wrap justify-end gap-2">
          <button 
            onClick={handleBlank} 
            className={`btn ${property === "question" ? "" : "hidden"}`}
            >{BLANK}</button>
          <button 
            className={`btn ${property === "variants" ? "" : "hidden"}`}
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
          <button className="btn w-28" disabled={!isReady} onClick={() => router.push("/learn")}>
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

function InputRadio({ property, setIsOpen }: 
  { 
    property: QuizRecordProperty,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>> 
  }
) {
  const currentProperty = useAppSelector(selectQuizProperty);
  const dispatch = useAppDispatch();

  function handleChange() {
    dispatch(setScreen(property));
    setIsOpen(false);
  }

  return (
    <label className="flex gap-4 justify-between rounded-full border-2 border-main-light px-2 py-1 w-44">
      {propertyTyCaption(property)}
      <input 
        type="radio"
        name="screen"
        checked={currentProperty === property}
        onChange={handleChange}
      />
    </label>
  )
}

function InputCheck ({ property, setIsOpen }: 
  { 
    property: QuizRecordProperty,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  }) { 
  const dispatch = useAppDispatch();
  const quiz = useAppSelector(selectQuiz);
  const checked = quiz[property] as boolean;
  
  function handleChange(e: boolean) {
    // dispatch(setIsRadio(e));
    dispatch(setCheckbox({property, value: e}));
    setIsOpen(false);
  }

  return (
    <label className="flex gap-4 justify-between rounded-full border-2 border-main-light px-2 py-1 w-44">
      {propertyTyCaption(property)}
      <input 
        type="checkbox"
        name={property}
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
    if (propertyIsScreenKind(i, ScreensKind.CHECKBOX)) {
      return (
        <InputCheck key={k} setIsOpen={setIsOpen}  property={i as QuizRecordProperty} />
      );
    } else {
      return (
        <InputRadio key={k} setIsOpen={setIsOpen} property={i as QuizRecordProperty} />
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
  const isList = propertyIsScreenKind(property, ScreensKind.LIST)
  const hidden = isList ? "" : "hidden";

  return (
    <textarea
      id="add-quiz-list"
      className={`quiz-input h-1/5 ${hidden}`}
      value={listItem}
      onChange={(e) => dispatch(setListItem(e.target.value))}
    >
    </textarea>
  );
}