import { CategoryEnum, Quiz } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getCards } from "./getCards";
import { AppState, AppThunk } from "@/redux/store";
import { log } from "@/components/prisma";


const HOVER_TIMEOUT = 1500;

export type CardState = "OK" | "NOK" | "CARD" | "FINISHED";

export interface CardI {
  cards: Quiz[];
  isCorrect: boolean[];
  pos: number;
  state: CardState;
  categories: CategoryEnum[],
  categoriesChecked: boolean[];
}

export const initialState: CardI = {
  cards: [],
  isCorrect: [],
  pos: 0,
  state: "CARD",
  categories: Object.keys(CategoryEnum) as CategoryEnum[],
  categoriesChecked: Array(Object.keys(CategoryEnum).length).fill(false),
};

export const initCardAsync = (): AppThunk =>
  async (dispatch, getState) => {
    const cards = selectCards(getState());
    const categories = selectCategories(getState());
    const categoriesChecked = selectCategoriesChecked(getState());
    //if (cards.cards.length === 0 || cards.cards.length === cards.isCorrect.length ) {
      log("download")
      //dispatch(resetCards());
      let checked: CategoryEnum[] = [];
      for (let i = 0; i < categories.length; i++) {
        if (categoriesChecked[i]) {
          checked.push(categories[i]);
        }
      }
      dispatch(setCards(await getCards(categories)));
    //}
  };

  export const setCategoryAsync = (category: CategoryEnum, checked: boolean): AppThunk => 
    async (dispatch) => {
      dispatch(setCategory({
        category: category,
        checked: checked
      }));
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

    setCategory: (state, action: PayloadAction<{category: CategoryEnum, checked: boolean}>) => {
      const idx = state.categories.indexOf(action.payload.category);
      state.categoriesChecked[idx] = action.payload.checked;
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
        categories: Object.keys(CategoryEnum) as CategoryEnum[],
        categoriesChecked: Array(Object.keys(CategoryEnum).length).fill(false),
      };
    },
  },

});

export const { setCards, setPos, setCardState, setIsCorrect, setCategory } = cardSlice.actions;
export const selectCards = (state: AppState) => state.card;
export const selectPos = (state: AppState) => state.card.pos;
export const selectCurrentCard = (state: AppState) => state.card.cards[state.card.pos];
export const selectCardState = (state: AppState) => state.card.state;
export const selectIsCorrect = (state: AppState) => state.card.isCorrect;
export const selectCategories = (state: AppState) => state.card.categories;
export const selectCategoriesChecked = (state: AppState) => state.card.categoriesChecked;

export default cardSlice.reducer;