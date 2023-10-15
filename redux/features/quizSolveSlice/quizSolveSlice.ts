import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BLANK, EMPTY_QUIZ_RECORD, QuizRecord } from "../quiz/quizSlice";
import { AppState, AppThunk } from "@/redux/store";
import { Quiz } from "@prisma/client";
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
  id?: number,
  ownerName: string,
  ownerEmail: string,
  data:QuizRecord,
  kind: QuizKind,
  uniqueVariants: string[],
  pieces: Piece[],
  blankIndexes: number[],
  userAnswers: string[],
  userAnswer: string,
  isCorrect: boolean | null,
}

const initialState: StateType = {
  id: undefined,
  ownerName: "",
  ownerEmail: "",
  data: EMPTY_QUIZ_RECORD,
  kind: QuizKind.NONE,
  uniqueVariants: [],
  pieces: [],
  blankIndexes: [],
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

function selectBlanksCheckAnswer(state: StateType) {
  const userAnswer = state.pieces.filter(p => p.isBlank).map(p => p.value).join("");
  return state.data.answers.some(answer => compareCodes(answer, userAnswer));
}

export const checkAnswerAsync = (finish: () => void): AppThunk =>
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
          break;
        case QuizKind.SELECT_BLANKS:
          dispatch(setIsCorrect(selectBlanksCheckAnswer(state)));
          break;
        default:
          const _exhaustiveCheck: never = state.kind;
      }
    }

    // TODO change after testing
    setTimeout(() => {
      dispatch(setIsCorrect(null));
      finish();
    }, 3500);
  };

function makeQuizSolve(state: StateType, quiz: QuizRecord) {
  let tmp = quiz.question.split(BLANK_RE).filter(t => t.length > 0);

      state.pieces = tmp.map((i, idx) => {
        if (i === BLANK) {
          state.blankIndexes.push(idx);
          return { value:"", isBlank: true };
        } else {
          return { value: i, isBlank: false };
        }
      });
      state.uniqueVariants = [];
      state.data.variants.forEach(variant => {
        const trimmedVariant = variant.trim();
        if (!state.uniqueVariants.includes(trimmedVariant)) {
          state.uniqueVariants.push(trimmedVariant);
        }
      });
      state.kind = detectQuizKind(state.data, state.blankIndexes.length);
    return state;
}

export const quizSolveSlice = createSlice({
  name: "quizSolve",
  initialState,
  reducers: {
    setQuizSolve: (state, action: PayloadAction<QuizRecord>) => {
      state.data = action.payload;
      state = makeQuizSolve(state, action.payload);
    },

    initQuiz: (state, { payload }: PayloadAction<Quiz>) => {
      const quiz = payload;
      state.data.question = quiz.question;
      state.data.category = quiz.category;
      state.data.isRadio = quiz.isRadio;
      state.data.isShort = quiz.isShort;
      state.data.variants =  JSON.parse(quiz.variants);
      state.data.answers = JSON.parse(quiz.answers);
      state.id = quiz.id;
      state.ownerName = quiz.ownerName;
      state.ownerEmail = quiz.ownerEmail;
      state = makeQuizSolve(state, state.data);
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

    removeSelection: (state, { payload }: PayloadAction<number>) => {
      const value = state.pieces[payload].value;
      state.pieces[payload].value = "";
    },

    addSelection: (state, { payload }: PayloadAction<string>) => {
      const valueWithSpaces = getWithSpaces(
        state.data.variants, 
        state.pieces.filter(p => p.isBlank).map(p => p.value),
        payload
        )
      state.pieces = addPiece(state.pieces, {value: valueWithSpaces, isBlank: true});
    },


  },
})

function getWithSpaces(variants: string[], selected: string[], trimmed: string): string {
  const index = selected.filter(i => i.trim() === trimmed).length;
  return variants.filter(v => v.trim() === trimmed)[index];
}

function addPiece(pieces: Piece[], piece: Piece): Piece[] {
  const index = pieces.findIndex(item => item.value === "");
  if (index === -1) {
    return [...pieces, piece];
  } else {
    return [...pieces.slice(0, index), piece, ...pieces.slice(index + 1)];
  } 
}

export const { 
  setQuizSolve, 
  setQuizPiece, 
  setAnswer, 
  setCheckboxAnswer, 
  setIsCorrect,
  addSelection,
  removeSelection,
  initQuiz,
} = quizSolveSlice.actions;

export const selectQuizPieces = (state: AppState) => state.quizSolve.pieces;
export const selectQuizKind = (state: AppState) => state.quizSolve.kind;
export const selectQuizVariants = (state: AppState) => state.quizSolve.data.variants;
export const selectQuizIsCorrect = (state: AppState) => state.quizSolve.isCorrect;
export const selectQuizUserAnswers = (state:AppState) => state.quizSolve.userAnswers;
export const selectQuizUserAnswer = (state: AppState) => state.quizSolve.userAnswer;
export const selectQuizQuestion = (state: AppState) => state.quizSolve.data.question;
export const selectUniqueVariants = (state: AppState) => state.quizSolve.uniqueVariants;
export const selectQuizBlankIndexes = (state: AppState) => state.quizSolve.blankIndexes;
export const selectQuizSolveQuiz = (state: AppState) => state.quizSolve.data;
export const selectQuizSolveState = (state: AppState) => state.quizSolve;
export const selectQuizSolveOwnerName = (state: AppState) => state.quizSolve.ownerName;
export const selectQuizSolveOwnerEmail = (state: AppState) => state.quizSolve.ownerEmail;
export const selectQuizSolveId = (state: AppState) => state.quizSolve.id;

export default quizSolveSlice.reducer;