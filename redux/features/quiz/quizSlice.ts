import { AppState, AppThunk } from "@/redux/store";
import { PayloadAction, ThunkAction, createSlice } from "@reduxjs/toolkit";


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
  infillinators = "infillinators",
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
  question: "What is the output of this code?",
  body: "print('My name is Khans'.split(sep = ' ', maxsplit = 1))",
  infillinators: [],
  variants: [
    "['My' 'name' 'is' 'Khan']",
    "['My name' 'is Khan']",
    "['My' 'name' 'is' 'Khan']",
    "['My', 'name is Khans']"
  ],
  isRadio: false,
  answers: ["['My', 'name is Khans']"],
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
  listItem: string,
}

const initialState: InitialState = {
  data: EMPTY_QUIZ_RECORD,
  property: "question",
  text: EMPTY_QUIZ_RECORD.question,
  listItem: "",
}

// convert object to text
function toText(obj: string | boolean | string[] | Infillinator[]) {
  let text: string;
  if (typeof obj !== "string") {
    text = JSON.stringify(obj);
  } else {
    text = obj;
  }
  return text;
}

const switchScreen = (to: () => void): AppThunk => 
  (dispatch, getState) => {
    dispatch(saveText());
    to();
    const obj = selectCurrentText(getState());
    dispatch(setText(toText(obj)));
    dispatch(setListItem(""));
  }

export const nextProperty = (): AppThunk =>
  (dispatch) => {
    dispatch(switchScreen(() => {
      dispatch(toNextProperty());
    }));
  }

export const toProperty = (property: string): AppThunk => 
  (dispatch) => {
    dispatch(switchScreen(() => {
      dispatch(setProperty(property));
    }));
    dispatch(saveText());
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

    setListItem: (state, action: PayloadAction<string>) => {
      state.listItem = action.payload;
    },

    addItem: (state) => {
      state.text = JSON.stringify(JSON.parse(state.text).concat(state.listItem));
      state.listItem = "";
    },
  }
});


export const selectQuizProperty = (state: AppState) => state.quiz.property;
export const selectCurrentText = (state: AppState) => state.quiz.data[state.quiz.property];
export const selectQuizText = (state: AppState) => state.quiz.text;
export const selectQuizListItem = (state: AppState) => state.quiz.listItem;

export const { saveText, toNextProperty, setText, setProperty, setChecked, addItem, setListItem } = quizSlice.actions;

export default quizSlice.reducer;