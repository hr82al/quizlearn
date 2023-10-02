import { CategoryEnum, Prisma, Quiz } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getCards } from "./getCards";
import { AppState, AppThunk } from "@/redux/store";



const HOVER_TIMEOUT = 1500;


export enum CardNotification {
  OK = "Correct!",
  NOK = "Wrong!",
  NONE = "NONE",
}

export interface CardI {
  cards: Quiz[];
  currentCard: Quiz | undefined;
  cardNotification: CardNotification;
  selectedCategories: CategoryEnum[],
  totalNum: number,
  correctNum: number,
}

export const categories = Object.keys(CategoryEnum) as CategoryEnum[];

const initialState: CardI = {
  cards: [],
  currentCard: undefined,
  cardNotification: CardNotification.NONE,
  selectedCategories: [],
  totalNum: 0,
  correctNum: 0,
};


export const initCardAsync = (): AppThunk =>
  async (dispatch, getState) => {
    const selectedCategories = selectSelectedCategories(getState());
    if (selectCardNotification.length > 0) {
      const cards = await getCards(selectedCategories);
      if (cards.length > 0) {
        dispatch(setCurrentCard(cards[0]));
      }
      dispatch(setCards(cards.slice(1)));
    }
  };


export const loadCardsAsync = (): AppThunk => 
  async (dispatch, getState) => {
    const cards = selectCards(getState());
    if (cards.length < 3) {
      const selectedCategories = selectSelectedCategories(getState());
      dispatch(setCards(
        cards.concat(await getCards(selectedCategories))
      ));
    }
  };


export const submitCardAsync = (isCorrect: boolean): AppThunk => 
  async (dispatch) => {
    dispatch(setCardNotification(
      isCorrect ? CardNotification.OK : CardNotification.NOK)
    );
    dispatch(score(isCorrect));
    dispatch(showNotificationAsync());
    dispatch(saveQuizResultAsync(isCorrect));
    dispatch(loadCardsAsync());
  }


export const showNotificationAsync = (): AppThunk => 
  async (dispatch, getState) => {
    const cardNotification = selectCardNotification(getState());
    if (cardNotification !== CardNotification.NONE) {
      setTimeout(() => {
        dispatch(setCardNotification(CardNotification.NONE));
      }, HOVER_TIMEOUT);
    }
  };


export const saveQuizResultAsync = (isCorrect: boolean): AppThunk =>
    async (dispatch, getState) => {
      const currentCard = selectCurrentCard(getState());
      if (currentCard === undefined) {
        return;
      }
      await fetch(`${location.origin}/api/result`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [Prisma.ResultScalarFieldEnum.quizId]: currentCard.id, 
          [Prisma.ResultScalarFieldEnum.isCorrect]: isCorrect}),
      });

      // after save need to select next current card
      dispatch(nextCard());
    }


export const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {

    setCards: (state, action: PayloadAction<Quiz[]>) => {
      state.cards = action.payload;
    },

    setCurrentCard: (state, action: PayloadAction<Quiz>) => {
      state.currentCard = action.payload;
    },

    nextCard: (state) => {
      if (state.cards.length > 0) {
        state.currentCard = state.cards[0];
        state.cards = state.cards.slice(1);
      };
    },

    setCardNotification: (state, action: PayloadAction<CardNotification>) => {
      state.cardNotification = action.payload;
    },

    setCategory: (state, action: PayloadAction<{category: CategoryEnum, checked: boolean}>) => {
      if (action.payload.checked) {
        if (!state.selectedCategories.includes(action.payload.category)) {
          state.selectedCategories.push(action.payload.category)
        }
      } else {
        if (state.selectedCategories.includes(action.payload.category)) {
          state.selectedCategories = state.selectedCategories.filter(category => 
            category !== action.payload.category
          );
        }
      }
    },

    score: (state, action: PayloadAction<boolean>) => {
      state.totalNum++;
      if (action.payload) {
        state.correctNum++;
      }
    },

    resetCards: (state) => {
      return {
        ...state,
        cards: [],
        currentCard: undefined,
        cardNotification: CardNotification.NONE,
        correctNum: 0,
        totalNum: 0,
      };
    },
  },

});


export const { 
  setCards, 
  setCategory,  
  resetCards,
  setCardNotification,
  setCurrentCard,
  nextCard,
  score,
} = cardSlice.actions;


export const selectCards = (state: AppState) => state.card.cards;
export const selectCurrentCard = (state: AppState) => state.card.currentCard;
export const selectCardNotification = (state: AppState) => state.card.cardNotification;
export const selectSelectedCategories = (state: AppState) => state.card.selectedCategories;
export const selectTotalNum = (state: AppState) => state.card.totalNum;
export const selectCorrectNum = (state: AppState) => state.card.correctNum;

export default cardSlice.reducer;