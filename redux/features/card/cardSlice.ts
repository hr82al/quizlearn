import { Quiz } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getCards } from "./getCards";
import { AppState, AppThunk } from "@/redux/store";

const HOVER_TIMEOUT = 1500;

export type CardState = "OK" | "NOK" | "CARD" | "FINISHED"

export interface CardI {
  cards: Quiz[];
  pos: number;
  startDb: number;
  state: CardState;
}

const initialState: CardI = {
  cards: [],
  pos: 2,
  startDb: 0,
  state: "CARD",
};

export const initCardAsync = (): AppThunk =>
  async (dispatch, getState) => {
    const startDb = selectStartDb(getState())
    dispatch(setCards(await getCards(startDb)));
  };

export const changeCardStateAsync = (): AppThunk =>
  async (dispatch, getState) => {
    const cardState = selectCardState(getState());
    if (cardState == "OK" || cardState == "NOK") {
      setTimeout(() => {
        dispatch(setCardState("CARD"));
      }, HOVER_TIMEOUT);
    }
  };


export const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {

    setCards: (state, action) => {
      state.cards = action.payload;
    },

    setPos: (state, action: PayloadAction<number>) => {
      state.pos = action.payload;
    },

    setStartDb: (state, action: PayloadAction<number>) => {
      state.startDb = action.payload;
    },

    setCardState: (state, action: PayloadAction<CardState>) => {
      state.state = action.payload;
    },

  },

});

export const { setCards, setPos, setStartDb, setCardState } = cardSlice.actions;
export const selectCards = (state: AppState) => state.card;
export const selectPos = (state: AppState) => state.card.pos;
export const selectStartDb = (state: AppState) => state.card.startDb;
export const selectCurrentCard = (state: AppState) => state.card.cards[state.card.pos];
export const selectCardState = (state: AppState) => state.card.state;

export default cardSlice.reducer;