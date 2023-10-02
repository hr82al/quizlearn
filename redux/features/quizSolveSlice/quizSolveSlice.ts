import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BLANK, EMPTY_QUIZ_RECORD, QuizRecord } from "../quiz/quizSlice";
import { AppState } from "@/redux/store";

export const BLANK_RE = new RegExp("(\\.\\.\\.\\.)");

const initialState: {
  data:QuizRecord,
  pieces: [string, boolean] [],
} = {
  data: EMPTY_QUIZ_RECORD,
  pieces: []
}

export const quizSolveSlice = createSlice({
  name: "quizSolve",
  initialState,
  reducers: {
    setQuizSolve: (state, action: PayloadAction<QuizRecord>) => {
      state.data = action.payload;
      let tmp = action.payload.body.split(BLANK_RE);
      state.pieces = tmp.map(i => {
        if (i === BLANK) {
          return ["", true];
        } else {
          return [i, false];
        }
      });
    },
    setQuizPiece: (state, { payload }: PayloadAction<{index: number, text: string}>) => {
      state.pieces[payload.index] = [payload.text, state.pieces[payload.index][1]]; 
    },
  },
});

export const { setQuizSolve, setQuizPiece } = quizSolveSlice.actions;
export const selectQuizPieces = (state: AppState) => state.quizSolve.pieces;

export default quizSolveSlice.reducer;