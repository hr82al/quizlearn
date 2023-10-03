import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BLANK, EMPTY_QUIZ_RECORD, QuizRecord } from "../quiz/quizSlice";
import { AppState } from "@/redux/store";

export const BLANK_RE = new RegExp("(\\.\\.\\.\\.)");

export const enum QuizKind {
  // A kind is not detected yet or the data is bad
  NONE,
  // We have body with blanks which need to fill
  FILL_BLANKS,
  // We have blanks and variants to choose
  SELECT_BLANKS,
  // We do not have blanks and variants, and we have to insert only one entity without spaces
  FILL_SHORT,
  // We do not have blanks and variants, and we have to type several items separated spaces
  FILL,
  // We do not have blanks but have variants and isRadio is true
  RADIO,
  // We do not have blanks but have variants and isRadio is false
  CHECKBOX,
  // We have infillinators
  INFILLINATORS,
}

function detectQuizKind(quiz: QuizRecord, blanksNum: number): QuizKind {
  if (blanksNum > 0 && quiz.variants.length === 0) {
    return QuizKind.FILL_BLANKS;
  } else if (blanksNum > 0 && quiz.variants.length > 0) {
    return QuizKind.SELECT_BLANKS;
  } else if (blanksNum === 0 && quiz.variants.length === 0) {
    return QuizKind.SELECT_BLANKS;
  } 


  return QuizKind.NONE;
}

const initialState: {
  data:QuizRecord,
  kind: QuizKind,
  pieces: [string, boolean] [],
} = {
  data: EMPTY_QUIZ_RECORD,
  kind: QuizKind.NONE,
  pieces: []
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
    
  },
});

export const { setQuizSolve, setQuizPiece } = quizSolveSlice.actions;
export const selectQuizPieces = (state: AppState) => state.quizSolve.pieces;

export default quizSolveSlice.reducer;