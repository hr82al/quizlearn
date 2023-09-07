import { Result } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppState, AppThunk } from "../store";


const initialState: Result[] = [];

export const fetchResultAsync = (): AppThunk =>
  async (dispatch, getState) => {
    const result = await (await fetch("/api/result")).json();
    dispatch(setResult(result));
  }


export const resultSlice = createSlice({
  name: "result",
  initialState,
  reducers: {
    setResult: (state, action: PayloadAction<Result[]>) => {
      return action.payload;
    }
  },
});

export const { setResult } = resultSlice.actions;

export const selectResult = (state: AppState) => state.result;

export default resultSlice.reducer;