import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { GameState } from "@rpg-village/core";

const initialState: GameState = {} as GameState;

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameState: (state, action: PayloadAction<GameState>) => {
      return action.payload;
    },
  },
});

export const { setGameState } = gameSlice.actions;

export const gameReducer = gameSlice.reducer;
