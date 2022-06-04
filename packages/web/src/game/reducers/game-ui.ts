import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { createMiddlewareAction } from "../action-middleware-factory";
import { GamePage } from "../interface";

export interface GameUIState {
  paused: boolean;
  ai: boolean;
  page?: GamePage;
}

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
  },
});

export const { pause, resume, enableAI, disableAI, changePage } = gameUISlice.actions;

export const gameUIactions = [
  createMiddlewareAction(pause, (action, context) => {
    context.gameInstance.pause();
  }),
  createMiddlewareAction(resume, (action, context) => {
    context.gameInstance.resume();
  }),
  createMiddlewareAction(enableAI, (action, context) => {
    context.gameInstance.enableAI(true);
  }),
  createMiddlewareAction(disableAI, (action, context) => {
    context.gameInstance.enableAI(false);
  }),
];

export const gameUIReducer = gameUISlice.reducer;
