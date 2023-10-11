import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import quizReducer, { quizSlice } from "./features/quiz/quizSlice";
import quizSolveReducer, { quizSolveSlice } from "./features/quizSolveSlice/quizSolveSlice";


export const store = configureStore({
  reducer: {
    [quizSlice.name]: quizReducer,
    [quizSolveSlice.name]: quizSolveReducer,
  },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction <
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;