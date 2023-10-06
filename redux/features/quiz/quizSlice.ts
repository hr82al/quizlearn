import { hlog } from "@/components/prisma";
import { AppState, AppThunk } from "@/redux/store";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const BLANK = "....";

export type Infillinator = [string, string[]];

function isInfillinator(obj: object): obj is Infillinator {
  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return true;
    } else if (obj.every(i => i.length == 2 && typeof i[0] === "string" && isStringList(i[1]))) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function isStringList(obj: object): obj is string[] {
  return Array.isArray(obj) && obj.every(i => typeof i === "string");
}


export interface QuizRecord {
  question: string;
  body: string;
  infillinators: Infillinator[];
  variants: string[];
  isRadio: boolean;
  isShort: boolean;
  answers: string[];
}

const CAPTIONS = {
  question: "Question",
  body: "Body",
  infillinators: "Infillinators",
  variants: "Variants",
  isRadio: "Is Radio",
  isShort: "Is Short",
  answers: "Answers",
} as const;

export function propertyTyCaption(property: string) {
  if (property in CAPTIONS) {
    return CAPTIONS[property as keyof typeof CAPTIONS];
  } else {
    throw new Error(`Caption for property name ${property} not found`);
  }
}

export type QuizRecordProperty = keyof QuizRecord

export const enum ScreensKind {
  TEXT = "TEXT",
  BLANKED_TEXT = "BLANKED_TEXT",
  INFILLINATORS = "INFILLINATORS",
  LIST = "LIST",
  CHECKBOX = "CHECKBOX",
  IS_RADIO = "IS_RADIO",
}

export enum UIEnum {
  question = ScreensKind.TEXT,
  body = ScreensKind.BLANKED_TEXT,
  infillinators = ScreensKind.INFILLINATORS,
  variants = ScreensKind.LIST,
  isRadio = ScreensKind.CHECKBOX,
  isShort = ScreensKind.CHECKBOX,
  answers = ScreensKind.LIST,
};



export function propertyIsScreenKind(propertyName: string, kind: ScreensKind) {
  return UIEnum[propertyName as keyof typeof UIEnum].valueOf() === kind;
}


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

export const EMPTY_QUIZ_RECORD: QuizRecord = {
  question: "What is the output of this code?",
  body: 
`function greet(person: { name: string; age: number }) {
  return "Hello " .... person.name;
}`,
  infillinators: [],
  variants: [
    // "['My' 'name' 'is' 'Khan']",
    // "['My name' 'is Khan']",
    // "['My' 'name' 'is' 'Khan']",
    // "['My', 'name is Khans']"
  ],
  isRadio: true,
  isShort: false,
  answers: ["['My', 'name is Khans']"],
};

function setQuizRecord(target: QuizRecord, key: keyof QuizRecord, value: string) {
  let parsed_value: Infillinator | string | string[] | boolean | undefined = undefined;
  if (typeof target[key] === "string") {
    parsed_value = value;
  } else if (key === "variants" || key === "answers") {
    let tmp = JSON.parse(value);
    if (isStringList(tmp)) {
      parsed_value = tmp;
    } else {
      parsed_value = [];
    }
  } else if (typeof target[key] === "boolean") {
    let tmp = JSON.parse(value);
    if (typeof tmp === "boolean") {
      parsed_value = tmp;
    }
  } else if (key === "infillinators") {
    if (typeof value === "string") {
      let tmp = JSON.parse(value)
      if (isInfillinator(tmp)) {
        parsed_value = tmp;
      } else {
        parsed_value = [];
      }
    } else {
      parsed_value = [];
    }
  } else {
    return target
  }
  if (parsed_value === undefined) {
    return target;
  }
  return {
    ...target,
    [key as keyof QuizRecord]: parsed_value,
  }
}

export const properties = Object.keys(EMPTY_QUIZ_RECORD);
const LENGTH = properties.length;

type InitialState = {
  data: QuizRecord,
  property: QuizRecordProperty,
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

export const setScreen = (property: QuizRecordProperty): AppThunk =>
  (dispatch, getState) => {
    dispatch(saveText());
    dispatch(setProperty(property));
    const obj = selectCurrentText(getState());
    dispatch(setText(toText(obj)));
    dispatch(setListItem(""));
  }

export const nextScreen = (): AppThunk => 
  (dispatch, getState) => {
    const idx = (properties.indexOf(getState().quiz.property) + 1) % LENGTH;
    const property = properties[idx] as QuizRecordProperty;
    dispatch(setScreen(property));
  }


export const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    toNextProperty: (state) => {
      const idx = (properties.indexOf(state.property) + 1) % LENGTH;
      state.property = properties[idx] as keyof QuizRecord;
    },

    setProperty: (state, action: PayloadAction<QuizRecordProperty>) => {
      state.property = action.payload;
    },

    setText: (state, action: PayloadAction<string>) => {
      if (typeof action.payload === undefined) {
        throw new Error("Error param")
      }
      state.text = action.payload;
    },

    saveText: (state) => {
      state.data = setQuizRecord(state.data, state.property, state.text)
    },

    setIsRadio: (state, action: PayloadAction<boolean>) => {
      state.data.isRadio = action.payload;
    },

    setCheckbox: (state, { payload }: PayloadAction<{property: string, value: boolean}>) => {
      if (properties.includes(payload.property)) {
        state.data = {
          ...state.data,
          [payload.property]: payload.value,
        }
      } else {
        throw new Error(`Wrong property name ${payload.property}`);
      }
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
export const selectCurrentText = (state: AppState) => {
  return state.quiz.data[state.quiz.property];
}
export const selectQuizText = (state: AppState) => state.quiz.text;
export const selectQuizListItem = (state: AppState) => state.quiz.listItem;
export const selectIsRadio = (state: AppState) => state.quiz.data.isRadio;
export const selectIsReady = (state: AppState) => {
  return state.quiz.data.question.length > 0 && state.quiz.data.answers.length > 0;
}
export const selectQuizQuestion = (state: AppState) => state.quiz.data.question;
export const selectQuizBody = (state: AppState) => state.quiz.data.body;
export const selectQuiz = (state: AppState) => state.quiz.data;
 
export const { saveText, toNextProperty, setText, setProperty, setIsRadio, addItem, setListItem, setCheckbox} = quizSlice.actions;

export default quizSlice.reducer;