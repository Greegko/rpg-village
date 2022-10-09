import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { GameAIState, PartyAction } from "./interface";

const initialState: GameAIState = { partyStates: {} };

const gameAISlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    setPartyAction(state, action: PayloadAction<{ partyId: string; partyAction: PartyAction }>) {
      state.partyStates[action.payload.partyId] = state.partyStates[action.payload.partyId] || {};
      state.partyStates[action.payload.partyId].action = action.payload.partyAction;
    },
    clearPartyAction(state, action: PayloadAction<{ partyId: string }>) {
      state.partyStates[action.payload.partyId] = state.partyStates[action.payload.partyId] || {};
      state.partyStates[action.payload.partyId].action = null;
    },
    setAutoExplore(state, action: PayloadAction<{ partyId: string; enable: boolean }>) {
      state.partyStates[action.payload.partyId] = state.partyStates[action.payload.partyId] || {};
      state.partyStates[action.payload.partyId].autoExplore = action.payload.enable;
    },
  },
});

export const { setPartyAction, setAutoExplore, clearPartyAction } = gameAISlice.actions;

export const gameAIReducer = gameAISlice.reducer;
