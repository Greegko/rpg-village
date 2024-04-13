import { Command } from "@rpg-village/bannerlords";

type CommandHistory = { turn: number; command: Command };

export interface GameDebugState {
  commandHistory: CommandHistory[];
}
