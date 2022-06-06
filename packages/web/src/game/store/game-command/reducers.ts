import { createSlice } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

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

export const { fastForward, logState, reset, save, executeCommand } = gameCommandSlice.actions;

export const useExecuteCommandDispatch = () => {
  const dispatcher = useDispatch();
  return (command: Command) => dispatcher(executeCommand(command as any));
};
