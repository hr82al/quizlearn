import { configureStore } from "@reduxjs/toolkit";
import cardReducer, { cardSlice } from "./features/card/cardSlice";
import { createWrapper } from "next-redux-wrapper";


//const makeStore = () => configureStore({
export const store = configureStore({
  reducer: {
    [cardSlice.name]: cardReducer,
  },
});

// export type AppStore = ReturnType<typeof makeStore>;
// export type AppState = ReturnType<AppStore["getState"]>;
/// export type AppDispatch = AppStore["dispatch"];
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// export const wrapper = createWrapper<AppStore>(makeStore);