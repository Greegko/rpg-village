import { batch, createSignal } from "solid-js";

import { Command } from "@rpg-village/village-manager-core";

import { addToCommandHistory } from "@web/store/debug";

import { GameInstanceWrapper } from "./game-instance-wrapper";

export const [gameInstanceWrapper, setGameInstanceWrapper] = createSignal<GameInstanceWrapper>(
  new GameInstanceWrapper(),
);

export const useGameExecuteCommand = () => {
  return (command: Command) => {
    batch(() => {
      addToCommandHistory(command);
      gameInstanceWrapper().executeCommand(command);
    });
  };
};
