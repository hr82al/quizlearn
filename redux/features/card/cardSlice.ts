import { Quiz } from "@prisma/client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCards } from "./getCards";
import { HYDRATE } from "next-redux-wrapper";
import { AppState } from "@/redux/store";

export interface CardI {
  cards: Quiz[];
}

const initialState: CardI = {cards: []};

/* export const fetchInitialState = createAsyncThunk("card/fetchInitialState", async () => {
  const cards = await getCards();
  return cards;
}); */

export const  initSetCardsAsync = createAsyncThunk(
  "card/init",
  async () => {
    return await getCards();
  },
);

export const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    setCards: (state, action) => {
      state.cards = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(initSetCardsAsync.fulfilled, (state, action) => {
      state.cards = action.payload;
    });
  },
/*   extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload,
      }
    },
  }, */
/*   extraReducers: builder => {
    builder
    .addCase(fetchInitialState.fulfilled, (state, action) => {
      state.cards = action.payload;
    })
  } */
});

export const { setCards } = cardSlice.actions;
export const selectCards = (state: AppState) => state.card;

export default cardSlice.reducer;