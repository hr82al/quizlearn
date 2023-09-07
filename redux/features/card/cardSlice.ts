import { CategoryEnum, Prisma, Quiz } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { NUMBER_PRELOADED_QUIZZES, getCards } from "./getCards";
import { AppState, AppThunk } from "@/redux/store";



const HOVER_TIMEOUT = 1500;

export type CardState = "OK" | "NOK" | "CARD" | "FINISHED";

export interface CardI {
  cards: Quiz[];
  isCorrect: boolean[];
  pos: number;
  state: CardState;
  //userId: number,
  categoriesChecked: boolean[];
}

export const categories = Object.keys(CategoryEnum) as CategoryEnum[];

const initialState: CardI = {
  cards: [],
  isCorrect: [],
  pos: 0,
  state: "CARD",
  //userId: -1,
  categoriesChecked: Array(Object.keys(CategoryEnum).length).fill(false),
};

function onlyChecked(checkedCategories: boolean[]){
  let checked: CategoryEnum[] = [];
  for (let i = 0; i < categories.length; i++) {
    if (checkedCategories[i]) {
      checked.push(categories[i]);
    }
  }
  return checked;
}

export const initCardAsync = (): AppThunk =>
  async (dispatch, getState) => {
    const categoriesChecked = selectCategoriesChecked(getState());
      let checked = onlyChecked(categoriesChecked);
      dispatch(setCards(await getCards(checked)));
  };

export const loadCardsAsync = (): AppThunk => 
  async (dispatch, getState) => {
    const preloadedCards = selectPreloadedCards(getState());
    const pos = selectPos(getState());
    if (preloadedCards.length - pos <= 2) {
      const categoriesChecked = selectCategoriesChecked(getState());
      const checked = onlyChecked(categoriesChecked);
      const newCards = preloadedCards.concat(await getCards(checked));
      if (newCards.length > 10) {
        dispatch(setPos(pos - NUMBER_PRELOADED_QUIZZES));
        dispatch(shiftIsCorrect(NUMBER_PRELOADED_QUIZZES));
        let shiftedCards = newCards.slice(NUMBER_PRELOADED_QUIZZES);
        dispatch(setCards(shiftedCards));
      } 
        dispatch(setCards(newCards));
      }
    }


export const changeCardStateAsync = (): AppThunk =>
  async (dispatch, getState) => {
    const cardState = selectCardState(getState());
    const cards = selectCards(getState());
    let pos = selectPos(getState());

    switch (cardState) {
      case "OK":
      case "NOK": {
        const isCorrect = cardState === "OK";
        dispatch(setIsCorrect(isCorrect)); 
        dispatch(saveQuizResult());
        dispatch(loadCardsAsync);    
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

export const saveQuizResult = (): AppThunk =>
    async (dispatch, getState) => {
      //const userId = selectUserId(getState());
      const isCorrect = selectIsCorrect(getState()).at(-1);
/*       if (userId < 0 || typeof isCorrect !== "boolean") {
        return;
      }  */ 
      const card = selectCurrentCard(getState());
      
      await fetch(`${location.origin}/api/result`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [Prisma.ResultScalarFieldEnum.quizId]: card.id, 
          [Prisma.ResultScalarFieldEnum.isCorrect]: isCorrect}),
      });
    }


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
      const idx = categories.indexOf(action.payload.category);
      state.categoriesChecked[idx] = action.payload.checked;
    },

    setIsCorrect: (state, action: PayloadAction<boolean>) => {
      state.isCorrect[state.pos] = action.payload;
    },

    shiftIsCorrect: (state, action: PayloadAction<number>) => {
      state.isCorrect = state.isCorrect.slice(action.payload);
    },

    resetCards: (state) => {
      return {
        ...state,
        cards: [],
        isCorrect: [],
        pos: 0,
        state: "CARD",
      };
    },

    setUserId: (state, action: PayloadAction<number>) => {
      //state.userId = action.payload;
    },

  },

});

export const { setCards, setPos, setCardState, setIsCorrect, setCategory,  resetCards, shiftIsCorrect } = cardSlice.actions;
export const selectCards = (state: AppState) => state.card;
export const selectPos = (state: AppState) => state.card.pos;
export const selectCurrentCard = (state: AppState) => state.card.cards[state.card.pos];
export const selectCardState = (state: AppState) => state.card.state;
export const selectIsCorrect = (state: AppState) => state.card.isCorrect;
export const selectCategoriesChecked = (state: AppState) => state.card.categoriesChecked;
//export const selectUserId = (state: AppState) => state.card.userId;
export const selectPreloadedCards = (state: AppState) => state.card.cards;

export default cardSlice.reducer;