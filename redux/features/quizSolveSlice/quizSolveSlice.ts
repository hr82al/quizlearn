import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BLANK, EMPTY_QUIZ_RECORD, QuizRecord } from "../quiz/quizSlice";
import { AppState, AppThunk } from "@/redux/store";
import { hlog } from "@/components/prisma";
 

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
} 

function detectQuizKind(quiz: QuizRecord, blanksNum: number): QuizKind {
  if (blanksNum > 0 && quiz.variants.length === 0) {
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

type Piece = {
  value: string,
  isBlank: boolean,
}

type StateType = {
  data:QuizRecord,
  kind: QuizKind,
  pieces: Piece[],
  userAnswers: string[],
  userAnswer: string,
  isCorrect: boolean | null,
}

const initialState: StateType = {
  data: EMPTY_QUIZ_RECORD,
  kind: QuizKind.NONE,
  pieces: [],
  userAnswers: [],
  userAnswer: "",
  isCorrect: null,
}


function radioQuizCheckAnswer(state: StateType): boolean {
  if (state.userAnswer.length > 0) {
    for (let i = 0; i < state.data.answers.length; i++){
      const answer = state.data.answers[i];
      if (state.userAnswer === answer) {
        return true;
      }
    }
  }
  return false;
}

function checkboxQuizCheckAnswer(state: StateType): boolean {
  const userAnswers = state.userAnswers;
  const answers = state.data.answers;
  // If user hasn't checked one of the answers return false
  for (let i = 0; i < answers.length; i++) {
    const answer = answers[i];
    if (!userAnswers.includes(answer)) {
      return false;
    }
  }
  // If user checked answer which is not in correct answers
  for (let i = 0; i < userAnswers.length; i++) {
    const userAnswer = userAnswers[i];
    if (!answers.includes(userAnswer)) {
      return false;
    }
  }
  return true;
}


function splitToCodeItems(code: string): string {
  return code.split(/[\n \t]/).filter(i => i.length > 0).join("");
}

// Equals a code regardless of spaces characters
function compareCodes(code1: string, code2: string): boolean {
  const tmp1 = splitToCodeItems(code1);
  const tmp2 = splitToCodeItems(code2);
  hlog(tmp1, tmp2)
  return tmp1 === tmp2;
}

function fillQuizCheckAnswer(state: StateType) {
  const answers = state.data.answers;
  const userAnswer = state.userAnswer;
  return answers.some((code) => compareCodes(code, userAnswer));
}

function fillBlanksQuizCheckAnswer(state: StateType) {
  // collect filled blanks to userAnswer;
  let userAnswers: string[] = [];
  state.pieces.forEach(item => {
    if (item.isBlank) {
      userAnswers.push(item.value);
    }
  });
  return userAnswers.join("") === state.data.answers.join("");
}

function fillShortQuizAnswer(state: StateType) {
  return state.data.answers.some((answer) => compareCodes(state.userAnswer, answer));
}

export const checkAnswerAsync = (): AppThunk =>
  (dispatch, getState) => {
    const state = getState().quizSolve;
    if (state.isCorrect === null) {
      switch (state.kind) {
        case QuizKind.RADIO:
          dispatch(setIsCorrect(radioQuizCheckAnswer(state)));
          break;
        case QuizKind.CHECKBOX:
          dispatch(setIsCorrect(checkboxQuizCheckAnswer(state)));
          break;
        case QuizKind.FILL:
          dispatch(setIsCorrect(fillQuizCheckAnswer(state)))
;         break;
        case QuizKind.FILL_BLANKS:
          dispatch(setIsCorrect(fillBlanksQuizCheckAnswer(state)));
          break;
        case QuizKind.FILL_SHORT:
          dispatch(setIsCorrect(fillShortQuizAnswer(state)));
          break;
        case QuizKind.NONE:
        case QuizKind.SELECT_BLANKS:
          break;
        default:
          const _exhaustiveCheck: never = state.kind;
      }
    }

    // TODO change after testing
    setTimeout(() => {
      dispatch(setIsCorrect(null));
    }, 3000);
  };

export const quizSolveSlice = createSlice({
  name: "quizSolve",
  initialState,
  reducers: {
    setQuizSolve: (state, action: PayloadAction<QuizRecord>) => {
      state.data = action.payload;
      let tmp = action.payload.question.split(BLANK_RE);
      let blanks_num = 0
      state.pieces = tmp.map(i => {
        if (i === BLANK) {
          blanks_num++;
          return { value:"", isBlank: true };
        } else {
          return { value: i, isBlank: false };
        }
      });
      state.kind = detectQuizKind(state.data, blanks_num);

    },

    setQuizPiece: (state, { payload }: PayloadAction<{index: number, text: string}>) => {
      state.pieces[payload.index].value = payload.text; 
    },

    setAnswer: (state, { payload }: PayloadAction<string>) => {
      state.userAnswer = payload;
    },

    setCheckboxAnswer: (state, { payload }: PayloadAction<{answer: string, isSet: boolean}>) => {
      if (state.userAnswers.includes(payload.answer)) {
        if (!payload.isSet) {
          state.userAnswers = state.userAnswers.filter(e => e !== payload.answer);
        }
      } else {
        if (payload.isSet) {
          state.userAnswers.push(payload.answer);
        }
      }
    },

    setIsCorrect: (state, { payload }: PayloadAction<boolean | null>) => {
      state.isCorrect = payload;
    },
  },
});

export const { 
  setQuizSolve, 
  setQuizPiece, 
  setAnswer, 
  setCheckboxAnswer, 
  setIsCorrect,
} = quizSolveSlice.actions;

export const selectQuizPieces = (state: AppState) => state.quizSolve.pieces;
export const selectQuizKind = (state: AppState) => state.quizSolve.kind;
export const selectQuizVariants = (state: AppState) => state.quizSolve.data.variants;
export const selectQuizIsCorrect = (state: AppState) => state.quizSolve.isCorrect;
export const selectQuizUserAnswers = (state:AppState) => state.quizSolve.userAnswers;
export const selectQuizUserAnswer = (state: AppState) => state.quizSolve.userAnswer;
export const selectQuizQuestion = (state: AppState) => state.quizSolve.data.question;

export default quizSolveSlice.reducer;