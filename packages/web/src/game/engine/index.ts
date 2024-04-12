import { createSignal } from "solid-js";

import { Command } from "@rpg-village/core";

import { GameInstanceWrapper } from "./game-instance-wrapper";

export const [gameInstanceWrapper, setGameInstanceWrapper] = createSignal<GameInstanceWrapper>(
  new GameInstanceWrapper(),
);

export const useGameExecuteCommand = () => {
  return (command: Command) => gameInstanceWrapper().executeCommand(command);
};
