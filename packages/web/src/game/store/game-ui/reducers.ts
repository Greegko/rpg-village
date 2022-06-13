import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { MapID } from "@rpg-village/core";

import { GamePage, GameUIState } from "./interface";

const initialState = {
  paused: false,
  ai: false,
} as GameUIState;

const gameUISlice = createSlice({
  name: "game-ui",
  initialState,
  reducers: {
    pause(state) {
      state.paused = true;
    },
    resume(state) {
      state.paused = false;
    },
    enableAI(state) {
      state.ai = true;
    },
    disableAI(state) {
      state.ai = false;
    },
    changePage(state, action: PayloadAction<GamePage>) {
      state.page = action.payload;
    },
    selectMap(state, action: PayloadAction<MapID>) {
      state.map = action.payload;
    },
  },
});

export const { pause, resume, enableAI, disableAI, changePage, selectMap } = gameUISlice.actions;

export const gameUIReducer = gameUISlice.reducer;
