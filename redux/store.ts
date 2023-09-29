import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import cardReducer, { cardSlice } from "./features/card/cardSlice";
import plateReducer, { plateSlice } from "./features/plate/plateSlice";
import resultReducer, { resultSlice } from "./features/resultSlice";
import quizReducer, { quizSlice } from "./features/quiz/quizSlice";


export const store = configureStore({
  reducer: {
    [cardSlice.name]: cardReducer,
    [plateSlice.name]: plateReducer,
    [resultSlice.name]: resultReducer,
    [quizSlice.name]: quizReducer,
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