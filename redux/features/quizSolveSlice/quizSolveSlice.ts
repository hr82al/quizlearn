import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BLANK, EMPTY_QUIZ_RECORD, QuizRecord, saveText } from "../quiz/quizSlice";
import { AppState } from "@/redux/store";
import { isSet } from "util/types";
 

export const BLANK_RE = new RegExp("(\\.\\.\\.\\.)");

export const enum QuizKind {
  // A kind is not detected yet or the data is bad
  NONE,
  // We have body with blanks which need to fill
  FILL_BLANKS,
  // We have blanks and variants to choose
  SELECT_BLANKS,
  // We do not have blanks and variants and it is short
  FILL_SHORT,
  // We do not have blanks and variants and it is not short
  FILL,
  // We do not have blanks but have variants and isRadio is true
  RADIO,
  // We do not have blanks but have variants and isRadio is false
  CHECKBOX,
  // We have infillinators
  INFILLINATORS,
} 

function detectQuizKind(quiz: QuizRecord, blanksNum: number): QuizKind {
  if (quiz.infillinators.length > 0) {
    return QuizKind.INFILLINATORS
  }else if (blanksNum > 0 && quiz.variants.length === 0) {
    return QuizKind.FILL_BLANKS;
  } else if (blanksNum > 0 && quiz.variants.length > 0) {
    return QuizKind.SELECT_BLANKS;
  } else if (blanksNum === 0 && quiz.variants.length === 0) {
    if (quiz.isShort) {
      return QuizKind.FILL_SHORT;
    } else {
      return QuizKind.FILL;
    }
  } else if (blanksNum === 0 && quiz.variants.length > 0) {
    if (quiz.isRadio) {
      return QuizKind.RADIO;
    } else {
      return QuizKind.CHECKBOX;
    }
  }
  return QuizKind.NONE;
}

type StateType = {
  data:QuizRecord,
  kind: QuizKind,
  pieces: [string, boolean] [],
  userAnswer: string[],
  isCorrect: boolean | null,
}

const initialState: StateType = {
  data: EMPTY_QUIZ_RECORD,
  kind: QuizKind.NONE,
  pieces: [],
  userAnswer: [],
  isCorrect: null,
}


function radioQuizCheckAnswer(state: StateType): boolean {
  if (state.userAnswer.length > 0) {
    state.data.answers.forEach(answer => {
      if (state.userAnswer[0] === answer) {
        return true;
      }
    });
  }
  return false;
}

export const quizSolveSlice = createSlice({
  name: "quizSolve",
  initialState,
  reducers: {
    setQuizSolve: (state, action: PayloadAction<QuizRecord>) => {
      state.data = action.payload;
      let tmp = action.payload.body.split(BLANK_RE);
      let blanks_num = 0
      state.pieces = tmp.map(i => {
        if (i === BLANK) {
          blanks_num++;
          return ["", true];
        } else {
          return [i, false];
        }
      });
      state.kind = detectQuizKind(state.data, blanks_num);
    },

    setQuizPiece: (state, { payload }: PayloadAction<{index: number, text: string}>) => {
      state.pieces[payload.index] = [payload.text, state.pieces[payload.index][1]]; 
    },

    setRadioAnswer: (state, { payload }: PayloadAction<string>) => {
      if (state.userAnswer.length > 0) {
        state.userAnswer[0] === payload;
      } else {
        state.userAnswer.push(payload);
      }
    },

    setCheckboxAnswer: (state, { payload }: PayloadAction<{answer: string, isSet: boolean}>) => {
      if (state.userAnswer.includes(payload.answer)) {
        if (!payload.isSet) {
          state.userAnswer = state.userAnswer.filter(e => e !== payload.answer);
        }
      } else {
        if (payload.isSet) {
          state.userAnswer.push(payload.answer);
        }
      }
    },
    
    checkAnswer: (state) => {
      if (state.isCorrect === null) {
        switch (state.kind) {
          case QuizKind.RADIO:
            state.isCorrect = radioQuizCheckAnswer(state);
            break;
          case QuizKind.CHECKBOX:
          case QuizKind.FILL:
          case QuizKind.FILL_BLANKS:
          case QuizKind.FILL_SHORT:
          case QuizKind.INFILLINATORS:
          case QuizKind.NONE:
          case QuizKind.SELECT_BLANKS:
            break;
          default:
            const _exhaustiveCheck: never = state.kind;
        }
      }
    },
  },
});

export const { setQuizSolve, setQuizPiece, setRadioAnswer, checkAnswer, setCheckboxAnswer } = quizSolveSlice.actions;
export const selectQuizPieces = (state: AppState) => state.quizSolve.pieces;
export const selectQuizKind = (state: AppState) => state.quizSolve.kind;
export const selectQuizVariants = (state: AppState) => state.quizSolve.data.variants;
export const selectQuizIsCorrect = (state: AppState) => state.quizSolve.isCorrect;
export const selectQuizBody = (state: AppState) => state.quizSolve.data.body;

export default quizSolveSlice.reducer;