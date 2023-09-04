import { CategoryEnum, Quiz } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getCards } from "./getCards";
import { AppState, AppThunk } from "@/redux/store";

const HOVER_TIMEOUT = 1500;

export type CardState = "OK" | "NOK" | "CARD" | "FINISHED"

export interface CardI {
  cards: Quiz[];
  isCorrect: boolean[];
  pos: number;
  state: CardState;
  categories: string[]
}

export const initialState: CardI = {
  cards: [],
  isCorrect: [],
  pos: 0,
  state: "CARD",
  categories: [],
};

export const initCardAsync = (): AppThunk =>
  async (dispatch, getState) => {
    const cards = selectCards(getState());
    if (cards.cards.length === 0 || cards.cards.length === cards.isCorrect.length ) {
      dispatch(resetCards());
      dispatch(setCards(await getCards([CategoryEnum.TS])));
    }
  };

export const changeCardStateAsync = (): AppThunk =>
  async (dispatch, getState) => {
    const cardState = selectCardState(getState());
    const cards = selectCards(getState());
    let pos = selectPos(getState());

    switch (cardState) {
      case "OK":
      case "NOK": {
        if (cardState == "OK") {
          dispatch(setIsCorrect(true));
        } else {
          dispatch(setIsCorrect(false));
        }
        setTimeout(() => {
          pos += 1;
          dispatch(setPos(pos));
          if (pos == cards.cards.length) {
            dispatch(setCardState("FINISHED"));
          } else {
            dispatch(setCardState("CARD"));
          }
        }, HOVER_TIMEOUT);
      }
        break;
    }
  };


export const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {

    setCards: (state, action: PayloadAction<Quiz[]>) => {
      state.cards = action.payload;
    },

    setPos: (state, action: PayloadAction<number>) => {
      state.pos = action.payload;
    },

    setCardState: (state, action: PayloadAction<CardState>) => {
      state.state = action.payload;
    },

    addCategory: (state, action: PayloadAction<string>) => {
      state.categories.push(action.payload);
    },

    delCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(c => c !== action.payload);
    },

    setIsCorrect: (state, action: PayloadAction<boolean>) => {
      state.isCorrect[state.pos] = action.payload;
    },
    resetCards: (state) => {
      return {
        cards: [],
        isCorrect: [],
        pos: 0,
        state: "CARD",
        categories: [],
      };
    },
  },

});

export const { setCards, setPos, setCardState, setIsCorrect, resetCards } = cardSlice.actions;
export const selectCards = (state: AppState) => state.card;
export const selectPos = (state: AppState) => state.card.pos;
export const selectCurrentCard = (state: AppState) => state.card.cards[state.card.pos];
export const selectCardState = (state: AppState) => state.card.state;
export const selectIsCorrect = (state: AppState) => state.card.isCorrect;

export default cardSlice.reducer;