import { createSlice } from "@reduxjs/toolkit";

import { Command } from "@rpg-village/core";

import { MiddlewareActionFunction, NOOP_ACTION, createMiddlewareAction } from "../action-middleware-factory";

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

export const gameCommandsActions = [
  createMiddlewareAction(fastForward, (action, context) => {
    context.gameInstance.fastForward(action.payload);
  }),
  createMiddlewareAction(executeCommand, (action, context) => {
    context.gameInstance.executeCommand(action.payload);
  }),
  createMiddlewareAction(save, (action, context) => {
    context.gameInstance.localSave();
  }),
  createMiddlewareAction(logState, (action, context) => {
    console.log(context.gameInstance.getState());
  }),
  createMiddlewareAction(reset, (action, context) => {
    context.gameInstance.localReset();
    window.location.reload();
  }),
];

export interface ExecuteCommand {
  executeCommand(c: Command): void;
}

export const ExecuteCommand: ExecuteCommand = { executeCommand };
