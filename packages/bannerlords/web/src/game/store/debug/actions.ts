import { append } from "rambda";

import { Command } from "@rpg-village/bannerlords";

import { turnSelector } from "../game";
import { gameStore, setGameStore } from "../game-store";

export function clearCommandHistory() {
  setGameStore("debug", "commandHistory", []);
}

export function addToCommandHistory(command: Command) {
  setGameStore("debug", "commandHistory", append({ turn: turnSelector(gameStore.game), command }));
}
