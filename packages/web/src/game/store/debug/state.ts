import { Command } from "@rpg-village/core";

type CommandHistory = { turn: number; command: Command };

export interface GameDebugState {
  commandHistory: CommandHistory[];
}
