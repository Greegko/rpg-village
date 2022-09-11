import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { GameAIState, PartyPreference } from "./interface";

const initialState: GameAIState = { partyPreferences: {} };

const gameAISlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    setPartyPreference: (state, action: PayloadAction<{ partyId: string; partyPreference: PartyPreference }>) => {
      state.partyPreferences[action.payload.partyId] = action.payload.partyPreference;
    },
  },
});

export const { setPartyPreference } = gameAISlice.actions;

export const gameAIReducer = gameAISlice.reducer;
