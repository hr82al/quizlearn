import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { splitToElements } from "../card/utils";
import { AppState } from "@/redux/store";


export interface  QuizPlate{
  text: string;
  isVisible: boolean;
}

export interface PlateI {
  answer: string[];
  quiz: QuizPlate[];
  userAnswer: string[];
}

const initialState: PlateI = {
  answer: [],
  quiz: [],
  userAnswer: [],
} 

export const plateSlice = createSlice({
  name: "plate",
  initialState,
  reducers: {

    initCurrentCardOrder: (state, action: PayloadAction<{answer: string, quiz: string}>,) => {
      //init answer
      let answer = "";
      try {
        let tmp = JSON.parse(action.payload.answer)[0];
        if (typeof tmp === "string" && tmp.length > 0) {
          answer = tmp;
        }
      } catch (error) {
        answer = action.payload.answer;
      }
      state.answer = splitToElements(answer);

      //init quiz confusion
      let quizConfusion: string[] = [];
      try {
        let tmp = JSON.parse(action.payload.quiz);
        if (Array.isArray(tmp)) {
          quizConfusion = tmp as string[];
        }
      } catch (error) {
        quizConfusion = [];
      }

      // Trim, make unique, shuffle
      const quiz = Array.from(new Set(state.answer.map(i => i.trim()))).concat(quizConfusion).shuffle();
      //init quiz
      state.quiz = [];
      for (const i of quiz) {
        state.quiz.push({
          text: i,
          isVisible: true,
        });
      }
    },

    putToAnswer: (state, action: PayloadAction<number>) => {

      const idx = action.payload;
      const text = state.quiz[idx].text;

      const inUserAnswerNum = state.userAnswer.filter(i => i.trim() === text).length;
      const inAnswerNum = state.answer.filter(i => i.trim() === text).length;

      if (state.quiz[idx].isVisible) {
        //if (inUserAnswerNum < inAnswerNum) {
        // find nth text with format
        const texts = state.answer.filter(e => e.trim() === text);
        // if selected plate is the confusion plate
        let formattedText = "";
        if (texts.length === 0) {
          formattedText = text;
          state.quiz[idx].isVisible = false;
        } else {
          formattedText = texts[inUserAnswerNum];
        }
        state.userAnswer.push(formattedText);
        // if putted plate is the last one make it invisible
        if (inUserAnswerNum === (inAnswerNum - 1)) {
          state.quiz[idx].isVisible = false;
        }
      }
    },

    deleteLastPlate: (state) => {
      let text = state.userAnswer.pop();
      if (typeof text === "string") {
        for (let i of state.quiz) {
          if (text === i.text || text.trim() === i.text) {
            i.isVisible = true;
            break;
          }
        }
      }
    },

  }
});

export const { initCurrentCardOrder, putToAnswer, deleteLastPlate } = plateSlice.actions;

export const selectAnswer = (state: AppState) => state.plate.answer;
export const selectQuiz = (state: AppState) => state.plate.quiz;
export const selectUserAnswer = (state: AppState) => state.plate.userAnswer;

export default plateSlice.reducer
