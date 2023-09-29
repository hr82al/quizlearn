import { AppState, AppThunk } from "@/redux/store";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";


export type Infillinator = [string, string[]];

function isInfillinator(obj: object): obj is Infillinator {
  return Array.isArray(obj) && typeof obj[0] === "string" && Array.isArray(obj[1]) && obj[1].every(i => typeof i === "string");
}


export interface QuizRecord {
  question: string;
  body: string;
  infillinators: Infillinator[];
  variants: string[];
  isRadio: boolean;
  answers: string[];
}

export enum TypeUI {
  question = "text",
  body = "blankedText",
  infillinators = "Infillinator",
  variants = "list",
  isRadio = "checkbox",
  answers = "list",
};


export function isQuizRecord(obj: object): obj is QuizRecord {
  const quizRecord = obj as QuizRecord;
  return quizRecord.question !== undefined &&
    quizRecord.body !== undefined &&
    quizRecord.infillinators !== undefined &&
    Array.isArray(quizRecord.variants) &&
    quizRecord.variants.every(i => typeof i === "string") &&
    typeof quizRecord.isRadio === "boolean" &&
    Array.isArray(quizRecord.infillinators) &&
    quizRecord.infillinators.every(i => isInfillinator(i));
}

const EMPTY_QUIZ_RECORD: QuizRecord = {
  question: "1",
  body: "2",
  infillinators: [],
  variants: [],
  isRadio: false,
  answers: [],
};

function setQuizRecord(target: QuizRecord, key: keyof QuizRecord, value: string) {
  if (typeof target[key] === "string") {
    return {
      ...target,
      [key as keyof QuizRecord]: value,
    }
  } else {
    return target
  }
}

export const properties = Object.keys(EMPTY_QUIZ_RECORD);
const LENGTH = properties.length;

type InitialState = {
  data: QuizRecord,
  property: keyof QuizRecord
  text: string;
}

const initialState: InitialState = {
  data: EMPTY_QUIZ_RECORD,
  property: "question",
  text: "",
}


export const nextProperty = (): AppThunk =>
  (dispatch, getState) => {
    dispatch(saveText());
    dispatch(toNextProperty());
    dispatch(setText(selectCurrentText(getState()).toString()));
  }

export const toProperty = (property: string): AppThunk => 
  (dispatch, getState) => {
    dispatch(saveText());
    dispatch(setProperty(property));
    dispatch(setText(selectCurrentText(getState()).toString()));
  }


export const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    toNextProperty: (state) => {
      const idx = (properties.indexOf(state.property) + 1) % LENGTH;
      state.property = properties[idx] as keyof QuizRecord;
    },

    setProperty: (state, action: PayloadAction<string>) => {
      state.property = action.payload as keyof QuizRecord;
    },

    setText: (state, action: PayloadAction<string>) => {
      state.text = action.payload;
    },

    saveText: (state) => {
      state.data = setQuizRecord(state.data, state.property, state.text)
    },

    setChecked: (state, action: PayloadAction<boolean>) => {
      state.data.isRadio = action.payload;
    },
  }
});


export const selectQuizProperty = (state: AppState) => state.quiz.property;
export const selectCurrentText = (state: AppState) => state.quiz.data[state.quiz.property];
export const selectQuizText = (state: AppState) => state.quiz.text;

export const { saveText, toNextProperty, setText, setProperty, setChecked } = quizSlice.actions;

export default quizSlice.reducer;