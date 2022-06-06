import { createSlice } from "@reduxjs/toolkit";

import { Command } from "@rpg-village/core";

import { MiddlewareActionFunction, NOOP_ACTION } from "../../action-middleware-factory";

const gameCommandSlice = createSlice({
  name: "game-actions",
  initialState: void 0,
  reducers: {
    fastForward: NOOP_ACTION as MiddlewareActionFunction<number>,
    executeCommand: NOOP_ACTION as MiddlewareActionFunction<Command>,
    save: NOOP_ACTION,
    logState: NOOP_ACTION,
    reset: NOOP_ACTION,
  },
});

export const { fastForward, logState, executeCommand, reset, save } = gameCommandSlice.actions;

export interface ExecuteCommand {
  executeCommand(c: Command): void;
}

export const ExecuteCommand: ExecuteCommand = { executeCommand };
